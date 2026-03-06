/**
 * Health check query for debug/connectivity (TanStack Query)
 */

import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../utils';

export const healthCheckQueryKey = ['debug', 'api-health'] as const;

export type ApiHealthStatus = 'connected' | 'error' | 'checking' | 'idle';

export const useApiHealthCheck = (options?: { enabled?: boolean }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: healthCheckQueryKey,
    queryFn: async (): Promise<'connected' | 'error'> => {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok ? 'connected' : 'error';
    },
    enabled: options?.enabled ?? false,
    staleTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const apiStatus: ApiHealthStatus = isFetching ? 'checking' : (data ?? 'idle');
  return { apiStatus, refetch };
};
