/**
 * Host API hooks using TanStack Query
 * Handles host management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../../services/api';
import { addToast } from '../../redux';
import { queryKeys } from '../../lib/queryKeys';

// Register new host mutation
export const useRegisterHost = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (hostData: any) => {
      const response = await apiHelper.post('/v1/admin/host/register', hostData);
      return response;
    },
    onSuccess: () => {
      // Invalidate all host list queries to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.hosts.all });
      dispatch(addToast({
        type: 'success',
        message: 'Host registered successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to register host',
      }));
    },
  });
};

// Update host mutation (SUPERADMIN)
export const useUpdateHost = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ hostId, ...hostData }: {
      hostId: string;
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
      businessName?: string;
      gstNumber?: string;
      isActive?: boolean;
    }) => {
      const response = await apiHelper.put(`/v1/admin/host/update/${hostId}`, hostData);
      return response;
    },
    onSuccess: (_, { hostId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hosts.detail(hostId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.hosts.all });
      dispatch(addToast({
        type: 'success',
        message: 'Host updated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to update host',
      }));
    },
  });
};

// Get host by ID (SUPERADMIN)
export const useHost = (hostId: string) => {
  return useQuery({
    queryKey: queryKeys.hosts.detail(hostId),
    queryFn: () => apiHelper.get(`/v1/admin/host/${hostId}`),
    enabled: !!hostId,
    staleTime: 10 * 60 * 1000,
  });
};

// Get all hosts (SUPERADMIN, paginated)
// Using filter endpoint as the primary method since GET endpoint may not be available
export const useHosts = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: queryKeys.hosts.list(page, size),
    queryFn: () => apiHelper.post('/v1/admin/host/filter', {
      page,
      size,
    }),
    staleTime: 10 * 60 * 1000,
  });
};

// Filter hosts mutation
export const useFilterHosts = () => {
  return useMutation({
    mutationFn: async (filters: {
      name?: string;
      email?: string;
      city?: string;
      state?: string;
      country?: string;
      isActive?: boolean;
      page?: number;
      size?: number;
    }) => {
      const response = await apiHelper.post('/v1/admin/host/filter', filters);
      return response;
    },
  });
};
