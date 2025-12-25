/**
 * Invoice Mutation Hooks
 * TanStack Query mutation hooks for invoice operations
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryKeys';
import invoiceService from '../../services/invoiceService';
import type { Invoice } from '../../types/api';

/**
 * Hook to generate an invoice
 */
export const useGenerateInvoice = (
  options?: Omit<UseMutationOptions<Invoice, Error, string>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (hostId: string) => invoiceService.generateInvoice(hostId),
    onSuccess: (data, variables, context) => {
      // Invalidate invoice queries to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      // Call the original onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

/**
 * Hook to download invoice PDF
 */
export const useDownloadInvoicePDF = (
  options?: Omit<UseMutationOptions<Blob, Error, string>, 'mutationFn'>
) => {
  return useMutation({
    ...options,
    mutationFn: (invoiceId: string) => invoiceService.downloadPDF(invoiceId),
    onSuccess: (blob, invoiceId, context) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      // Call the original onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(blob, invoiceId, context);
      }
    },
  });
};

/**
 * Hook to generate invoice PDF
 */
export const useGenerateInvoicePDF = (
  options?: Omit<UseMutationOptions<any, Error, string>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (invoiceId: string) => invoiceService.generatePDF(invoiceId),
    onSuccess: (data, invoiceId, context) => {
      // Invalidate specific invoice to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(invoiceId) });
      if (options?.onSuccess) {
        options.onSuccess(data, invoiceId, context);
      }
    },
  });
};

/**
 * Hook to regenerate invoice PDF
 */
export const useRegenerateInvoicePDF = (
  options?: Omit<UseMutationOptions<any, Error, string>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (invoiceId: string) => invoiceService.regeneratePDF(invoiceId),
    onSuccess: (data, invoiceId, context) => {
      // Invalidate specific invoice to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(invoiceId) });
      if (options?.onSuccess) {
        options.onSuccess(data, invoiceId, context);
      }
    },
  });
};

/**
 * Hook to send invoice email
 */
export const useSendInvoiceEmail = (
  options?: Omit<UseMutationOptions<any, Error, string>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: (invoiceId: string) => invoiceService.sendEmail(invoiceId),
    ...options,
  });
};
