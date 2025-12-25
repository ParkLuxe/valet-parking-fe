/**
 * React Query Client Configuration
 * Configures the QueryClient with default options
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Cached data is kept for 30 minutes
      gcTime: 1000 * 60 * 30,
      // Retry failed requests once
      retry: 1,
      // Don't refetch on window focus to reduce API calls
      refetchOnWindowFocus: false,
      // Don't refetch on component mount if data is fresh
      refetchOnMount: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Don't retry mutations by default
      retry: 0,
    },
  },
});
