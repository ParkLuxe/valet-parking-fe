/**
 * Invoice API hooks using TanStack Query
 * Handles invoice operations with proper caching and state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import invoiceService from '../services/invoiceService';
import { addToast } from '../redux/slices/notificationSlice';
import { queryKeys } from '../lib/queryKeys';
import type { Invoice, InvoiceFilters } from '../types/api';

// Get invoices with filters
export const useInvoices = (filters: InvoiceFilters = {}) => {
  const page = filters.page ?? 0;
  const size = filters.size ?? 10;
  
  return useQuery({
    queryKey: queryKeys.invoices.list(filters),
    queryFn: () => invoiceService.filterInvoices(filters, page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single invoice by ID
export const useInvoice = (invoiceId: string) => {
  return useQuery({
    queryKey: queryKeys.invoices.detail(invoiceId),
    queryFn: () => invoiceService.getInvoiceById(invoiceId),
    enabled: !!invoiceId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get invoice by number
export const useInvoiceByNumber = (invoiceNumber: string) => {
  return useQuery({
    queryKey: [...queryKeys.invoices.all, 'number', invoiceNumber] as const,
    queryFn: () => invoiceService.getInvoiceByNumber(invoiceNumber),
    enabled: !!invoiceNumber,
    staleTime: 5 * 60 * 1000,
  });
};

// Get host invoices
export const useHostInvoices = (hostId: string, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: [...queryKeys.invoices.all, 'host', hostId, page, size] as const,
    queryFn: () => invoiceService.getHostInvoices(hostId, page, size),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get unpaid invoices
export const useUnpaidInvoices = (hostId: string) => {
  return useQuery({
    queryKey: queryKeys.invoices.unpaid(hostId),
    queryFn: () => invoiceService.getUnpaidInvoices(hostId),
    enabled: !!hostId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Get overdue invoices (SUPERADMIN only)
export const useOverdueInvoices = () => {
  return useQuery({
    queryKey: queryKeys.invoices.overdue(),
    queryFn: () => invoiceService.getOverdueInvoices(),
    staleTime: 5 * 60 * 1000,
  });
};

// Get total revenue (SUPERADMIN only)
export const useTotalRevenue = () => {
  return useQuery({
    queryKey: queryKeys.invoices.revenue.total(),
    queryFn: () => invoiceService.getTotalRevenue(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get host revenue
export const useHostRevenue = (hostId: string) => {
  return useQuery({
    queryKey: queryKeys.invoices.revenue.host(hostId),
    queryFn: () => invoiceService.getHostRevenue(hostId),
    enabled: !!hostId,
    staleTime: 10 * 60 * 1000,
  });
};

// Generate invoice mutation
export const useGenerateInvoice = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (hostId: string) => invoiceService.generateInvoice(hostId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.revenue.host(data.hostId) });
      dispatch(addToast({
        type: 'success',
        message: 'Invoice generated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to generate invoice',
      }));
    },
  });
};

// Download invoice PDF mutation
export const useDownloadInvoicePDF = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const blob = await invoiceService.downloadPDF(invoiceId);
      // Create download link
      const url = window.URL.createObjectURL(blob);
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
        message: error?.response?.data?.message || 'Failed to download invoice',
      }));
    },
  });
};

// Generate PDF mutation
export const useGenerateInvoicePDF = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (invoiceId: string) => invoiceService.generatePDF(invoiceId),
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
        message: error?.response?.data?.message || 'Failed to generate PDF',
      }));
    },
  });
};

// Send invoice email mutation
export const useSendInvoiceEmail = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: (invoiceId: string) => invoiceService.sendEmail(invoiceId),
    onSuccess: () => {
      dispatch(addToast({
        type: 'success',
        message: 'Invoice email sent successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to send invoice email',
      }));
    },
  });
};
