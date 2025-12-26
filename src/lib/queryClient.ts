/**
 * TanStack Query Client Configuration
 * Sets up React Query with global defaults
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - cached data is kept for 10 minutes (formerly cacheTime)
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: true, // Refetch on network reconnect
      refetchOnMount: true, // Refetch on component mount
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
});
