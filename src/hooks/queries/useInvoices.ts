/**
 * Invoice Query Hooks
 * TanStack Query hooks for invoice data fetching
 */

import { useQuery, useInfiniteQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryKeys';
import invoiceService from '../../services/invoiceService';
import type { Invoice, PaginatedResponse, InvoiceFilterParams } from '../../types/api';

/**
 * Hook to fetch paginated invoices with filters
 */
export const useInvoices = (
  filters: InvoiceFilterParams = {},
  page: number = 0,
  size: number = 10,
  options?: Omit<UseQueryOptions<PaginatedResponse<Invoice>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.invoices.list(filters, page, size),
    queryFn: () => invoiceService.filterInvoices(filters, page, size),
    ...options,
  });
};

/**
 * Hook to fetch a single invoice by ID
 */
export const useInvoice = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<Invoice>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id!),
    queryFn: () => invoiceService.getInvoiceById(id!),
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to fetch invoice by invoice number
 */
export const useInvoiceByNumber = (
  invoiceNumber: string | undefined,
  options?: Omit<UseQueryOptions<Invoice>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.invoices.all, 'number', invoiceNumber],
    queryFn: () => invoiceService.getInvoiceByNumber(invoiceNumber!),
    enabled: !!invoiceNumber,
    ...options,
  });
};

/**
 * Hook to fetch unpaid invoices for a host
 */
export const useUnpaidInvoices = (
  hostId: string | undefined,
  options?: Omit<UseQueryOptions<Invoice[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.invoices.unpaid(hostId!),
    queryFn: () => invoiceService.getUnpaidInvoices(hostId!),
    enabled: !!hostId,
    ...options,
  });
};

/**
 * Hook to fetch overdue invoices (SUPERADMIN only)
 */
export const useOverdueInvoices = (
  options?: Omit<UseQueryOptions<Invoice[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.invoices.overdue(),
    queryFn: () => invoiceService.getOverdueInvoices(),
    ...options,
  });
};

/**
 * Hook for infinite scrolling invoices
 */
export const useInfiniteInvoices = (filters: InvoiceFilterParams = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.invoices.infinite(filters),
    queryFn: ({ pageParam = 0 }) => invoiceService.filterInvoices(filters, pageParam, 10),
    getNextPageParam: (lastPage) =>
      lastPage.number < lastPage.totalPages - 1 ? lastPage.number + 1 : undefined,
    initialPageParam: 0,
  });
};

/**
 * Hook to fetch host revenue
 */
export const useHostRevenue = (
  hostId: string | undefined,
  options?: Omit<UseQueryOptions<number>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.invoices.all, 'revenue', hostId],
    queryFn: () => invoiceService.getHostRevenue(hostId!),
    enabled: !!hostId,
    ...options,
  });
};

/**
 * Hook to fetch total revenue (SUPERADMIN only)
 */
export const useTotalRevenue = (
  options?: Omit<UseQueryOptions<number>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.invoices.all, 'revenue', 'total'],
    queryFn: () => invoiceService.getTotalRevenue(),
    ...options,
  });
};
