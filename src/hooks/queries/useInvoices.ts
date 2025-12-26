/**
 * Invoice Query Hooks
 * TanStack Query hooks for invoice-related data fetching
 */

import { useQuery, useInfiniteQuery, type UseQueryResult, type UseInfiniteQueryResult } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryKeys';
import { invoiceService } from '../../services';
import type { Invoice, InvoiceFilters, PaginatedResponse } from '../../types';

/**
 * Hook to fetch invoices with filters and pagination
 */
export function useInvoices(
  filters: InvoiceFilters, 
  page: number = 0, 
  size: number = 10
): UseQueryResult<PaginatedResponse<Invoice>, Error> {
  return useQuery({
    queryKey: queryKeys.invoices.list({ ...filters, page, size }),
    queryFn: () => invoiceService.filterInvoices(filters, page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single invoice by ID
 */
export function useInvoice(
  id: string | undefined
): UseQueryResult<Invoice, Error> {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id!),
    queryFn: () => invoiceService.getInvoiceById(id!),
    enabled: !!id,
  });
}

/**
 * Hook to fetch invoices with infinite scroll
 */
export function useInfiniteInvoices(
  filters: InvoiceFilters, 
  size: number = 10
): UseInfiniteQueryResult<PaginatedResponse<Invoice>, Error> {
  return useInfiniteQuery({
    queryKey: queryKeys.invoices.list(filters),
    queryFn: ({ pageParam = 0 }) => 
      invoiceService.filterInvoices(filters, pageParam as number, size),
    getNextPageParam: (lastPage) => {
      if (lastPage.number < lastPage.totalPages - 1) {
        return lastPage.number + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
}

/**
 * Hook to fetch unpaid invoices for a host
 */
export function useUnpaidInvoices(
  hostId: string | undefined
): UseQueryResult<Invoice[], Error> {
  return useQuery({
    queryKey: queryKeys.invoices.unpaid(hostId!),
    queryFn: () => invoiceService.getUnpaidInvoices(hostId!),
    enabled: !!hostId,
  });
}

/**
 * Hook to fetch overdue invoices (SUPERADMIN only)
 */
export function useOverdueInvoices(): UseQueryResult<Invoice[], Error> {
  return useQuery({
    queryKey: queryKeys.invoices.overdue(),
    queryFn: () => invoiceService.getOverdueInvoices(),
  });
}

/**
 * Hook to fetch total revenue (SUPERADMIN only)
 */
export function useTotalRevenue(): UseQueryResult<number, Error> {
  return useQuery({
    queryKey: queryKeys.invoices.revenue.total(),
    queryFn: () => invoiceService.getTotalRevenue(),
  });
}

/**
 * Hook to fetch host revenue
 */
export function useHostRevenue(
  hostId: string | undefined
): UseQueryResult<number, Error> {
  return useQuery({
    queryKey: queryKeys.invoices.revenue.host(hostId!),
    queryFn: () => invoiceService.getHostRevenue(hostId!),
    enabled: !!hostId,
  });
}
