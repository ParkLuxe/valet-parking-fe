/**
 * Host User API hooks using TanStack Query
 * Handles host user management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../../services/api';
import { addToast } from '../../redux';
import { queryKeys } from '../../lib/queryKeys';
import type { User } from '../../types/api';

// Create host user mutation
export const useCreateHostUser = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: {
      firstName: string;
      lastName: string;
      userName: string;
      password: string;
      phoneNumber: string;
      email: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      countryCode?: string;
      dlNumber?: string;
      designation?: string;
      userRole: 'HOSTADMIN' | 'HOSTUSER' | 'VALET';
      hostId?: string;
    }) => {
      const { hostId, ...data } = userData;
      const url = hostId
        ? `/v1/host-users/create?hostId=${hostId}`
        : '/v1/host-users/create';
      const response = await apiHelper.post(url, data);
      return response;
    },
    onSuccess: (data: any, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      if (variables.hostId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.list(variables.hostId) });
      }
      dispatch(addToast({
        type: 'success',
        message: 'Host user created successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to create host user',
      }));
    },
  });
};

// Update host user mutation
export const useUpdateHostUser = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, ...userData }: Partial<User> & { userId: string }) => {
      const response = await apiHelper.put(`/v1/host-users`, userData);
      return response;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() });
      dispatch(addToast({
        type: 'success',
        message: 'Host user updated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to update host user',
      }));
    },
  });
};

// Get host user by ID
export const useHostUser = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => apiHelper.get(`/v1/host-users/${userId}`),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
};

// Get host's users (with optional role filter)
export const useHostUsers = () => {
  return useQuery({
    queryKey: [...queryKeys.users.all, 'host'] as const,
    queryFn: () => {
      const url = `/v1/host-users`;
      return apiHelper.get(url);
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch current user profile (for use with queryClient.fetchQuery, e.g. after login)
export const fetchCurrentUserProfile = () => apiHelper.get('/v1/host-users/me');

// Get current user profile
export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.users.profile(),
    queryFn: fetchCurrentUserProfile,
    staleTime: 10 * 60 * 1000,
  });
};

// Get user count by role (widget)
export const useHostUsersCount = (hostId: string) => {
  return useQuery({
    queryKey: [...queryKeys.users.all, 'widget', hostId] as const,
    queryFn: () => apiHelper.get(`/v1/host-users/widget/${hostId}`),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get user counts by role from /v1/host-users/count
export const useHostUsersRoleCount = (hostId: string) => {
  return useQuery<Record<string, number>>({
    queryKey: [...queryKeys.users.all, 'count', hostId] as const,
    queryFn: () => apiHelper.get(`/v1/host-users/count${hostId ? `?hostId=${hostId}` : ''}`),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
};

// Change password mutation
export const useChangeUserPassword = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async ({ userId, ...data }: { userId: string; currentPassword: string; newPassword: string }) => {
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
        message: error?.message || 'Failed to change password',
      }));
    },
  });
};

// Delete host user mutation
export const useDeleteHostUser = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiHelper.delete(`/v1/host-users/${userId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      dispatch(addToast({
        type: 'success',
        message: 'Host user deleted successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to delete host user',
      }));
    },
  });
};

// Filter host users mutation
export const useFilterHostUsers = () => {
  return useMutation({
    mutationFn: async (filters: {
      hostId?: string;
      role?: string;
      isActive?: boolean;
      searchTerm?: string;
      page?: number;
      size?: number;
    }) => {
      const response = await apiHelper.post('/v1/host-users/filter', filters);
      return response;
    },
  });
};
