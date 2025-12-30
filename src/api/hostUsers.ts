/**
 * Host User API hooks using TanStack Query
 * Handles host user management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../services/api';
import { addToast } from '../redux';
import { queryKeys } from '../lib/queryKeys';

// Create host user mutation
export const useCreateHostUser = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      phone?: string;
      password: string;
      role: 'HOSTADMIN' | 'HOSTUSER' | 'VALET';
      hostId: string;
    }) => {
      const response = await apiHelper.post('/v1/host-users', userData);
      return response;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list(data.hostId) });
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
    mutationFn: async ({ userId, ...userData }: {
      userId: string;
      name?: string;
      email?: string;
      phone?: string;
      role?: 'HOSTADMIN' | 'HOSTUSER' | 'VALET';
      isActive?: boolean;
    }) => {
      const response = await apiHelper.put(`/v1/host-users/${userId}`, userData);
      return response;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
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

// Get host's users (paginated)
export const useHostUsers = (hostId: string, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: [...queryKeys.users.all, 'host', hostId, page, size] as const,
    queryFn: () => apiHelper.get(`/v1/host-users/host/${hostId}?page=${page}&size=${size}`),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get current user profile
export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.users.profile(),
    queryFn: () => apiHelper.get('/v1/host-users/me'),
    staleTime: 10 * 60 * 1000,
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
