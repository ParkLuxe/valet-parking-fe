/**
 * Payment API hooks using TanStack Query
 * Handles payment operations and Razorpay integration
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../services/api';
import { addToast } from '../redux';
import { queryKeys } from '../lib/queryKeys';

// Create Razorpay order mutation
export const useCreatePaymentOrder = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const response = await apiHelper.post(`/v1/payments/create-order?invoiceId=${invoiceId}`);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({
        type: 'success',
        message: 'Payment order created successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to create payment order',
      }));
    },
  });
};

// Verify payment mutation
export const useVerifyPayment = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (paymentData: {
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
    }) => {
      const response = await apiHelper.post('/v1/payments/verify', paymentData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      dispatch(addToast({
        type: 'success',
        message: 'Payment verified successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Payment verification failed',
      }));
    },
  });
};

// Get payment details by ID
export const usePayment = (paymentId: string) => {
  return useQuery({
    queryKey: queryKeys.payments.detail(paymentId),
    queryFn: () => apiHelper.get(`/v1/payments/${paymentId}`),
    enabled: !!paymentId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get payment history for host (paginated)
export const useHostPayments = (hostId: string, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: queryKeys.payments.list(hostId, page, size),
    queryFn: () => apiHelper.get(`/v1/payments/host/${hostId}?page=${page}&size=${size}`),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get payment statistics
export const usePaymentStats = (hostId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [...queryKeys.payments.all, 'stats', hostId, startDate, endDate] as const,
    queryFn: () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const queryString = params.toString();
      const url = queryString 
        ? `/v1/payments/stats/${hostId}?${queryString}`
        : `/v1/payments/stats/${hostId}`;
      return apiHelper.get(url);
    },
    enabled: !!hostId,
    staleTime: 10 * 60 * 1000,
  });
};

// Initiate refund mutation
export const useInitiateRefund = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ paymentId, amount }: { paymentId: string; amount?: number }) => {
      const url = amount 
        ? `/v1/payments/${paymentId}/refund?amount=${amount}`
        : `/v1/payments/${paymentId}/refund`;
      const response = await apiHelper.post(url);
      return response;
    },
    onSuccess: (_, { paymentId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.detail(paymentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.lists() });
      dispatch(addToast({
        type: 'success',
        message: 'Refund initiated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to initiate refund',
      }));
    },
  });
};

// Filter payments mutation
export const useFilterPayments = () => {
  return useMutation({
    mutationFn: async (filters: {
      hostId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      size?: number;
    }) => {
      const response = await apiHelper.post('/v1/payments/filter', filters);
      return response;
    },
  });
};
