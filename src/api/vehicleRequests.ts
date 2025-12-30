/**
 * Vehicle Request API hooks using TanStack Query
 * Handles vehicle retrieval request operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../services/api';
import { addToast } from '../redux';
import { queryKeys } from '../lib/queryKeys';

// Create retrieval request mutation
export const useCreateRetrievalRequest = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (customerId: string) => {
      const response = await apiHelper.post(`/v1/requests/create?customerId=${customerId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      dispatch(addToast({
        type: 'success',
        message: 'Retrieval request created successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to create retrieval request',
      }));
    },
  });
};

// Accept request mutation
export const useAcceptRequest = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ requestId, valetId }: { requestId: string; valetId: string }) => {
      const response = await apiHelper.post(`/v1/requests/${requestId}/accept?valetId=${valetId}`);
      return response;
    },
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.vehicles.all, 'request', requestId] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.vehicles.all, 'requests'] });
      dispatch(addToast({
        type: 'success',
        message: 'Request accepted successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to accept request',
      }));
    },
  });
};

// Complete delivery mutation
export const useCompleteDelivery = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await apiHelper.post(`/v1/requests/${requestId}/complete`);
      return response;
    },
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.vehicles.all, 'request', requestId] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.vehicles.all, 'requests'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.lists() });
      dispatch(addToast({
        type: 'success',
        message: 'Delivery completed successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to complete delivery',
      }));
    },
  });
};

// Cancel request mutation
export const useCancelRequest = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await apiHelper.post(`/v1/requests/${requestId}/cancel`);
      return response;
    },
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.vehicles.all, 'request', requestId] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.vehicles.all, 'requests'] });
      dispatch(addToast({
        type: 'success',
        message: 'Request cancelled successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to cancel request',
      }));
    },
  });
};

// Get pending requests for host
export const usePendingRequests = (hostId: string) => {
  return useQuery({
    queryKey: [...queryKeys.vehicles.all, 'requests', 'pending', hostId] as const,
    queryFn: () => apiHelper.get(`/v1/requests/host/${hostId}/pending`),
    enabled: !!hostId,
    staleTime: 1 * 60 * 1000, // 1 minute - frequent updates for pending requests
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

// Get valet requests
export const useValetRequests = (valetId: string) => {
  return useQuery({
    queryKey: [...queryKeys.vehicles.all, 'requests', 'valet', valetId] as const,
    queryFn: () => apiHelper.get(`/v1/requests/valet/${valetId}`),
    enabled: !!valetId,
    staleTime: 1 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });
};

// Get request details
export const useRequestDetails = (requestId: string) => {
  return useQuery({
    queryKey: [...queryKeys.vehicles.all, 'request', requestId] as const,
    queryFn: () => apiHelper.get(`/v1/requests/${requestId}`),
    enabled: !!requestId,
    staleTime: 3 * 60 * 1000,
  });
};

// Manually assign request mutation
export const useAssignRequest = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ requestId, valetId }: { requestId: string; valetId: string }) => {
      const response = await apiHelper.post(`/v1/requests/${requestId}/assign?valetId=${valetId}`);
      return response;
    },
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.vehicles.all, 'request', requestId] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.vehicles.all, 'requests'] });
      dispatch(addToast({
        type: 'success',
        message: 'Request assigned successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to assign request',
      }));
    },
  });
};

// Get all requests for host (paginated)
export const useHostRequests = (hostId: string, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: [...queryKeys.vehicles.all, 'requests', 'host', hostId, page, size] as const,
    queryFn: () => apiHelper.get(`/v1/requests/host/${hostId}/all?page=${page}&size=${size}`),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
};

// Filter requests mutation
export const useFilterRequests = () => {
  return useMutation({
    mutationFn: async (filters: {
      hostId?: string;
      valetId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      size?: number;
    }) => {
      const response = await apiHelper.post('/v1/requests/filter', filters);
      return response;
    },
  });
};
