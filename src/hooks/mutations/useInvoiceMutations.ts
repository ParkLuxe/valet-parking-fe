/**
 * Invoice Mutation Hooks
 * TanStack Query hooks for invoice-related mutations
 */

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { queryKeys } from '../../lib/queryKeys';
import { invoiceService } from '../../services';
import {  addToast  } from '../../redux';
import type { Invoice } from '../../types/api';

/**
 * Hook to generate an invoice for a host
 */
export function useGenerateInvoice(): UseMutationResult<Invoice, Error, string> {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (hostId: string) => invoiceService.generateInvoice(hostId),
    onSuccess: () => {
      // Invalidate and refetch invoice queries
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      
      dispatch(addToast({
        type: 'success',
        message: 'Invoice generated successfully',
      }));
    },
    onError: (error: Error) => {
      dispatch(addToast({
        type: 'error',
        message: error.message || 'Failed to generate invoice',
      }));
    },
  });
}

/**
 * Hook to download invoice PDF
 */
export function useDownloadInvoicePDF(): UseMutationResult<void, Error, string> {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const pdfBlob = await invoiceService.downloadPDF(invoiceId);
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      dispatch(addToast({
        type: 'success',
        message: 'Invoice downloaded successfully',
      }));
    },
    onError: (error: Error) => {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to download invoice',
      }));
    },
  });
}

/**
 * Hook to generate PDF for an invoice
 */
export function useGenerateInvoicePDF(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (invoiceId: string) => invoiceService.generatePDF(invoiceId),
    onSuccess: (_, invoiceId) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.invoices.detail(invoiceId) 
      });
      
      dispatch(addToast({
        type: 'success',
        message: 'Invoice PDF generated successfully',
      }));
    },
    onError: (error: Error) => {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to generate PDF',
      }));
    },
  });
}

/**
 * Hook to regenerate PDF for an invoice
 * Note: Uses the same endpoint as generatePDF
 */
export function useRegenerateInvoicePDF(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (invoiceId: string) => invoiceService.generatePDF(invoiceId),
    onSuccess: (_, invoiceId) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.invoices.detail(invoiceId) 
      });
      
      dispatch(addToast({
        type: 'success',
        message: 'Invoice PDF regenerated successfully',
      }));
    },
    onError: (error: Error) => {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to regenerate PDF',
      }));
    },
  });
}

/**
 * Hook to send invoice via email
 * Note: Backend doesn't have a send-email endpoint in the spec, so this is commented out
 */
export function useSendInvoiceEmail(): UseMutationResult<void, Error, string> {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (invoiceId: string) => {
      // TODO: Backend doesn't have /send-email endpoint yet
      throw new Error('Send email endpoint not yet implemented');
    },
    onSuccess: () => {
      dispatch(addToast({
        type: 'success',
        message: 'Invoice sent via email successfully',
      }));
    },
    onError: (error: Error) => {
      dispatch(addToast({
        type: 'error',
        message: error.message || 'Failed to send invoice email',
      }));
    },
  });
}
