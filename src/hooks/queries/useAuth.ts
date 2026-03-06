/**
 * Authentication API hooks using TanStack Query
 * Handles login, register, logout, and profile operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiHelper } from '../../services/api';
import {  loginSuccess, logout as logoutAction  } from '../../redux';
import {  addToast  } from '../../redux';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../../types/api';

/** Payload expected by POST /v1/admin/host/register (same as HostManagement) */
interface HostRegisterPayload {
  hostName: string;
  hostType: 'ORGANIZATION' | 'INDIVIDUAL';
  phoneNumber: string;
  hostEmail: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  parkingSlots: number;
  username: string;
  masterFirstName: string;
  masterLastName: string;
  masterPassword: string;
  masterPhoneNumber: string;
  /** Master user role for the new host (required by backend) */
  userRole: 'HOSTADMIN';
  designation?: string;
}

/**
 * Maps the simple Register page form to the full host register API payload.
 * Uses sensible defaults for required fields not collected on the simple form.
 */
function mapRegisterFormToHostPayload(form: RegisterRequest & { phone?: string; businessName?: string; designation?: string }): HostRegisterPayload {
  const namePart = (form.name || 'User').trim();
  const parts = namePart.split(/\s+/);
  const masterFirstName = parts[0] || 'User';
  const masterLastName = parts.slice(1).join(' ') || '';
  const username = (form.email || '').replace(/@.+$/, '').replace(/\W/g, '') || 'user';
  const designation = (form as { designation?: string }).designation?.trim();
  return {
    hostName: (form as { businessName?: string }).businessName?.trim() || namePart,
    hostType: 'ORGANIZATION',
    phoneNumber: (form as { phone?: string }).phone?.trim() || '',
    hostEmail: form.email.trim(),
    addressLine1: 'To be updated',
    addressLine2: '',
    city: 'To be updated',
    state: 'To be updated',
    postalCode: '',
    countryCode: 'IN',
    parkingSlots: 1,
    username,
    masterFirstName,
    masterLastName,
    masterPassword: form.password,
    masterPhoneNumber: (form as { phone?: string }).phone?.trim() || '',
    userRole: 'HOSTADMIN',
    ...(designation ? { designation } : {}),
  };
}

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  validate: () => [...authKeys.all, 'validate'] as const,
};

// Login mutation (caller controls navigation so profile can be fetched first)
export const useLogin = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (credentials: LoginRequest & { role?: string }) => {
      const response = await apiHelper.post('/v1/auth/login', {
        userName: credentials.username,
        password: credentials.password,
        role: credentials.role,
      });
      return response as AuthResponse;
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      dispatch(addToast({
        type: 'success',
        message: 'Login successful!',
      }));
    },
    // Error handling: caller (Login page) shows a single toast in its catch block
  });
};

// Register mutation (caller controls post-success and post-error: e.g. auto-login + navigate, or show error toast in catch)
// Accepts simple form (name, email, phone, businessName, password) and maps to host register API payload.
export const useRegister = () => {
  return useMutation({
    mutationFn: async (formData: RegisterRequest & { phone?: string; businessName?: string; designation?: string }) => {
      const payload = mapRegisterFormToHostPayload(formData);
      const response = await apiHelper.post('/v1/admin/host/register', payload);
      return response as AuthResponse;
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('park_luxe_refresh_token');
      try {
        await apiHelper.post('/v1/auth/logout', { refreshToken });
      } catch (error) {
        // Continue with logout even if API call fails
      }
      localStorage.clear();
      return { success: true };
    },
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear(); // Clear all cached queries
      navigate('/login');
      dispatch(addToast({
        type: 'success',
        message: 'Logged out successfully',
      }));
    },
  });
};

// Validate token query
export const useValidateToken = () => {
  return useQuery({
    queryKey: authKeys.validate(),
    queryFn: async () => {
      const response = await apiHelper.get('/v1/auth/validate-token');
      return response as { valid: boolean };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Get user profile query
export const useProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await apiHelper.get('/v1/users/profile');
      return response as User;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, ...userData }: Partial<User> & { userId: string }) => {
      const response = await apiHelper.put(`/v1/host-users/${userId}`, userData);
      return response as User;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      // Also invalidate the host-users profile cache
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
      dispatch(addToast({
        type: 'success',
        message: 'Profile updated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.response?.data?.message || error?.message || 'Failed to update profile',
      }));
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async ({ userId, ...data }: { userId: string; currentPassword: string; newPassword: string; confirmPassword: string }) => {
      const response = await apiHelper.post(`/v1/host-users/${userId}/change-password`, data);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({
        type: 'success',
        message: 'Password changed successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.response?.data?.message || error?.message || 'Failed to change password',
      }));
    },
  });
};

