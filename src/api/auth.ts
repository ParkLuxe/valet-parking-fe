/**
 * Authentication API hooks using TanStack Query
 * Handles login, register, logout, and profile operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiHelper } from '../services';
import { loginSuccess, logout as logoutAction, addToast } from '../redux';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  validate: () => [...authKeys.all, 'validate'] as const,
};

// Login mutation
export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
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
      navigate('/dashboard');
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.response?.data?.message || 'Login failed. Please try again.',
      }));
    },
  });
};

// Register mutation
export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await apiHelper.post('/v1/admin/host/register', userData);
      return response as AuthResponse;
    },
    onSuccess: () => {
      dispatch(addToast({
        type: 'success',
        message: 'Registration successful! Please login.',
      }));
      navigate('/login');
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.response?.data?.message || 'Registration failed. Please try again.',
      }));
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
    mutationFn: async (userData: Partial<User>) => {
      const response = await apiHelper.put('/v1/users/profile', userData);
      return response as User;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      dispatch(addToast({
        type: 'success',
        message: 'Profile updated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to update profile',
      }));
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiHelper.post('/v1/users/change-password', data);
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
        message: error?.response?.data?.message || 'Failed to change password',
      }));
    },
  });
};
