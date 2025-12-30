/**
 * Subscription Plan API hooks using TanStack Query
 * Handles subscription plan management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../services/api';
import { addToast } from '../redux';
import { queryKeys } from '../lib/queryKeys';

// Create subscription plan mutation (SUPERADMIN)
export const useCreateSubscriptionPlan = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (planData: {
      planName: string;
      description?: string;
      monthlyPrice: number;
      scanLimit: number;
      features?: string[];
      isCustom?: boolean;
    }) => {
      const response = await apiHelper.post('/v1/subscription-plans', planData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.plans() });
      dispatch(addToast({
        type: 'success',
        message: 'Subscription plan created successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to create subscription plan',
      }));
    },
  });
};

// Update subscription plan mutation (SUPERADMIN)
export const useUpdateSubscriptionPlan = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ planId, ...planData }: {
      planId: string;
      planName?: string;
      description?: string;
      monthlyPrice?: number;
      scanLimit?: number;
      features?: string[];
      isActive?: boolean;
    }) => {
      const response = await apiHelper.put(`/v1/subscription-plans/${planId}`, planData);
      return response;
    },
    onSuccess: (_, { planId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.plans() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.plan(planId) });
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

// Get subscription plan by ID
export const useSubscriptionPlan = (planId: string) => {
  return useQuery({
    queryKey: queryKeys.subscriptions.plan(planId),
    queryFn: () => apiHelper.get(`/v1/subscription-plans/${planId}`),
    enabled: !!planId,
    staleTime: 10 * 60 * 1000,
  });
};

// Get subscription plan by name
export const useSubscriptionPlanByName = (planName: string) => {
  return useQuery({
    queryKey: [...queryKeys.subscriptions.plans(), 'name', planName] as const,
    queryFn: () => apiHelper.get(`/v1/subscription-plans/name/${planName}`),
    enabled: !!planName,
    staleTime: 10 * 60 * 1000,
  });
};

// Get all subscription plans (SUPERADMIN)
export const useAllSubscriptionPlans = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: [...queryKeys.subscriptions.plans(), 'all', page, size] as const,
    queryFn: () => apiHelper.get(`/v1/subscription-plans?page=${page}&size=${size}`),
    staleTime: 10 * 60 * 1000,
  });
};

// Get active subscription plans
export const useActiveSubscriptionPlans = () => {
  return useQuery({
    queryKey: [...queryKeys.subscriptions.plans(), 'active'] as const,
    queryFn: () => apiHelper.get('/v1/subscription-plans/active'),
    staleTime: 10 * 60 * 1000,
  });
};

// Get standard subscription plans
export const useStandardSubscriptionPlans = () => {
  return useQuery({
    queryKey: [...queryKeys.subscriptions.plans(), 'standard'] as const,
    queryFn: () => apiHelper.get('/v1/subscription-plans/standard'),
    staleTime: 10 * 60 * 1000,
  });
};

// Get custom subscription plans (SUPERADMIN)
export const useCustomSubscriptionPlans = () => {
  return useQuery({
    queryKey: [...queryKeys.subscriptions.plans(), 'custom'] as const,
    queryFn: () => apiHelper.get('/v1/subscription-plans/custom'),
    staleTime: 10 * 60 * 1000,
  });
};

// Filter subscription plans mutation
export const useFilterSubscriptionPlans = () => {
  return useMutation({
    mutationFn: async (filters: {
      planName?: string;
      isActive?: boolean;
      isCustom?: boolean;
      minPrice?: number;
      maxPrice?: number;
      page?: number;
      size?: number;
    }) => {
      const response = await apiHelper.post('/v1/subscription-plans/filter', filters);
      return response;
    },
  });
};
