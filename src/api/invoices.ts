/**
 * Invoice API hooks using TanStack Query
 * Handles invoice operations with proper caching and state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../services/api';
import {  addToast  } from '../redux';
import { queryKeys } from '../lib/queryKeys';
import type { InvoiceFilters } from '../types/api';

// Filter invoices using POST /v1/invoices/filter-spec
export const useInvoices = (filters: InvoiceFilters = {}) => {
  const page = filters.page ?? 0;
  const size = filters.size ?? 10;
  
  return useQuery({
    queryKey: queryKeys.invoices.list(filters),
    queryFn: () => apiHelper.post('/v1/invoices/filter-spec', { ...filters, page, size }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single invoice by ID
export const useInvoice = (invoiceId: string) => {
  return useQuery({
    queryKey: queryKeys.invoices.detail(invoiceId),
    queryFn: () => apiHelper.get(`/v1/invoices/${invoiceId}`),
    enabled: !!invoiceId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get invoice by number
export const useInvoiceByNumber = (invoiceNumber: string) => {
  return useQuery({
    queryKey: [...queryKeys.invoices.all, 'number', invoiceNumber] as const,
    queryFn: () => apiHelper.get(`/v1/invoices/number/${invoiceNumber}`),
    enabled: !!invoiceNumber,
    staleTime: 5 * 60 * 1000,
  });
};

// Get host invoices
export const useHostInvoices = (hostId: string, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: [...queryKeys.invoices.all, 'host', hostId, page, size] as const,
    queryFn: () => apiHelper.get(`/v1/invoices/host/${hostId}?page=${page}&size=${size}`),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get unpaid invoices
export const useUnpaidInvoices = (hostId: string) => {
  return useQuery({
    queryKey: queryKeys.invoices.unpaid(hostId),
    queryFn: () => apiHelper.get(`/v1/invoices/unpaid/${hostId}`),
    enabled: !!hostId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Get overdue invoices (SUPERADMIN only)
export const useOverdueInvoices = () => {
  return useQuery({
    queryKey: queryKeys.invoices.overdue(),
    queryFn: () => apiHelper.get('/v1/invoices/overdue'),
    staleTime: 5 * 60 * 1000,
  });
};

// Get total revenue (SUPERADMIN only)
export const useTotalRevenue = () => {
  return useQuery({
    queryKey: queryKeys.invoices.revenue.total(),
    queryFn: () => apiHelper.get('/v1/invoices/revenue/total'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get host revenue
export const useHostRevenue = (hostId: string) => {
  return useQuery({
    queryKey: queryKeys.invoices.revenue.host(hostId),
    queryFn: () => apiHelper.get(`/v1/invoices/revenue/${hostId}`),
    enabled: !!hostId,
    staleTime: 10 * 60 * 1000,
  });
};

// Generate invoice mutation
export const useGenerateInvoice = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (hostId: string) => apiHelper.post(`/v1/invoices/generate/${hostId}`),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
      if (data?.hostId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.invoices.revenue.host(data.hostId) });
      }
      dispatch(addToast({
        type: 'success',
        message: 'Invoice generated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to generate invoice',
      }));
    },
  });
};

// Download invoice PDF mutation
export const useDownloadInvoicePDF = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const blob = await apiHelper.get(`/v1/invoices/${invoiceId}/pdf`, {
        responseType: 'blob',
      });
      // Create download link
      const url = window.URL.createObjectURL(blob as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return blob;
    },
    onSuccess: () => {
      dispatch(addToast({
        type: 'success',
        message: 'Invoice downloaded successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to download invoice',
      }));
    },
  });
};

// Generate PDF mutation
export const useGenerateInvoicePDF = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (invoiceId: string) => apiHelper.post(`/v1/invoices/${invoiceId}/generate-pdf`),
    onSuccess: (_, invoiceId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(invoiceId) });
      dispatch(addToast({
        type: 'success',
        message: 'PDF generated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to generate PDF',
      }));
    },
  });
};
