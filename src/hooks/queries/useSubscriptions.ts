/**
 * Subscription API hooks using TanStack Query
 * Handles subscription management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../../services/api';
import { addToast } from '../../redux';
import { queryKeys } from '../../lib/queryKeys';

// Initialize subscription mutation
export const useInitializeSubscription = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      hostId: string;
      planId: string;
      startDate?: string;
    }) => {
      const response = await apiHelper.post('/v1/subscriptions/initialize', data);
      return response;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.current(data.hostId) });
      dispatch(addToast({
        type: 'success',
        message: 'Subscription initialized successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to initialize subscription',
      }));
    },
  });
};

// Increment scan usage mutation
export const useIncrementScanUsage = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (hostId: string) => {
      const response = await apiHelper.post(`/v1/subscriptions/${hostId}/scan`);
      return response;
    },
    onSuccess: (_, hostId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.current(hostId) });
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to increment scan usage',
      }));
    },
  });
};

// Get subscription details
export const useSubscription = (hostId: string) => {
  return useQuery({
    queryKey: queryKeys.subscriptions.current(hostId),
    queryFn: () => apiHelper.get(`/v1/subscriptions/${hostId}`),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get usage statistics
export const useSubscriptionUsage = (hostId: string, month?: number, year?: number) => {
  return useQuery({
    queryKey: [...queryKeys.subscriptions.all, 'usage', hostId, month, year] as const,
    queryFn: () => {
      const params = new URLSearchParams();
      if (month !== undefined) params.append('month', month.toString());
      if (year !== undefined) params.append('year', year.toString());
      const queryString = params.toString();
      const url = queryString 
        ? `/v1/subscriptions/${hostId}/usage?${queryString}`
        : `/v1/subscriptions/${hostId}/usage`;
      return apiHelper.get(url);
    },
    enabled: !!hostId,
    staleTime: 3 * 60 * 1000,
  });
};

// Renew subscription mutation
export const useRenewSubscription = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (hostId: string) => {
      const response = await apiHelper.post(`/v1/subscriptions/${hostId}/renew`);
      return response;
    },
    onSuccess: (_, hostId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.current(hostId) });
      dispatch(addToast({
        type: 'success',
        message: 'Subscription renewed successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to renew subscription',
      }));
    },
  });
};

// Change subscription plan for a host
export const useChangeSubscriptionPlan = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ hostId, newPlanId }: { hostId: string; newPlanId: string }) => {
      const response = await apiHelper.put(`/v1/subscriptions/${hostId}/plan?newPlanId=${newPlanId}`);
      return response;
    },
    onSuccess: (_, { hostId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.current(hostId) });
      dispatch(addToast({
        type: 'success',
        message: 'Subscription plan updated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to update subscription plan',
      }));
    },
  });
};

// Get pending charges
export const useSubscriptionCharges = (hostId: string) => {
  return useQuery({
    queryKey: [...queryKeys.subscriptions.all, 'charges', hostId] as const,
    queryFn: () => apiHelper.get(`/v1/subscriptions/${hostId}/charges`),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
};

// Deactivate subscription mutation
export const useDeactivateSubscription = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (hostId: string) => {
      const response = await apiHelper.post(`/v1/subscriptions/${hostId}/deactivate`);
      return response;
    },
    onSuccess: (_, hostId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.current(hostId) });
      dispatch(addToast({
        type: 'success',
        message: 'Subscription deactivated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to deactivate subscription',
      }));
    },
  });
};

// Get subscription status
export const useSubscriptionStatus = (hostId: string) => {
  return useQuery({
    queryKey: [...queryKeys.subscriptions.all, 'status', hostId] as const,
    queryFn: () => apiHelper.get(`/v1/subscriptions/${hostId}/status`),
    enabled: !!hostId,
    staleTime: 3 * 60 * 1000,
  });
};

// Filter subscriptions mutation
export const useFilterSubscriptions = () => {
  return useMutation({
    mutationFn: async (filters: {
      status?: string;
      planId?: string;
      page?: number;
      size?: number;
    }) => {
      const response = await apiHelper.post('/v1/subscriptions/filter', filters);
      return response;
    },
  });
};
