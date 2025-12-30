/**
 * Analytics API hooks using TanStack Query
 * Handles analytics and reporting operations
 */

import { useQuery } from '@tanstack/react-query';
import { apiHelper } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';

// Get comprehensive dashboard analytics
export const useDashboardAnalytics = (hostId: string) => {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(hostId),
    queryFn: () => apiHelper.get(`/v1/analytics/dashboard/${hostId}`),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get valet performance analytics
export const useValetPerformance = (valetId: string) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'valet', valetId] as const,
    queryFn: () => apiHelper.get(`/v1/analytics/valet/${valetId}`),
    enabled: !!valetId,
    staleTime: 10 * 60 * 1000,
  });
};

// Get average parking time
export const useAverageParkingTime = (hostId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'parking-time', hostId, startDate, endDate] as const,
    queryFn: () => {
      let url = `/v1/analytics/parking-time/${hostId}`;
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const queryString = params.toString();
      return apiHelper.get(queryString ? `${url}?${queryString}` : url);
    },
    enabled: !!hostId,
    staleTime: 10 * 60 * 1000,
  });
};

// Get average delivery time
export const useAverageDeliveryTime = (hostId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'delivery-time', hostId, startDate, endDate] as const,
    queryFn: () => {
      let url = `/v1/analytics/delivery-time/${hostId}`;
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const queryString = params.toString();
      return apiHelper.get(queryString ? `${url}?${queryString}` : url);
    },
    enabled: !!hostId,
    staleTime: 10 * 60 * 1000,
  });
};

// Get active valets count
export const useActiveValetsCount = (hostId: string) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'active-valets', hostId] as const,
    queryFn: () => apiHelper.get(`/v1/analytics/active-valets/${hostId}`),
    enabled: !!hostId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Get parked vehicles count
export const useParkedVehiclesCount = (hostId: string) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'parked-vehicles', hostId] as const,
    queryFn: () => apiHelper.get(`/v1/analytics/parked-vehicles/${hostId}`),
    enabled: !!hostId,
    staleTime: 2 * 60 * 1000, // 2 minutes - more frequent updates
  });
};

// Get monthly revenue
export const useMonthlyRevenue = (hostId: string, month?: number, year?: number) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'revenue', hostId, month, year] as const,
    queryFn: () => {
      let url = `/v1/analytics/revenue/${hostId}`;
      const params = new URLSearchParams();
      if (month !== undefined) params.append('month', month.toString());
      if (year !== undefined) params.append('year', year.toString());
      const queryString = params.toString();
      return apiHelper.get(queryString ? `${url}?${queryString}` : url);
    },
    enabled: !!hostId,
    staleTime: 10 * 60 * 1000,
  });
};

// Get recent activity
export const useRecentActivity = (hostId: string, limit: number = 10) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'recent-activity', hostId, limit] as const,
    queryFn: () => apiHelper.get(`/v1/analytics/recent-activity/${hostId}?limit=${limit}`),
    enabled: !!hostId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for recent activity
  });
};

// Get peak hours analysis
export const usePeakHours = (hostId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'peak-hours', hostId, startDate, endDate] as const,
    queryFn: () => {
      let url = `/v1/analytics/peak-hours/${hostId}`;
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const queryString = params.toString();
      return apiHelper.get(queryString ? `${url}?${queryString}` : url);
    },
    enabled: !!hostId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get slot utilization
export const useSlotUtilization = (hostId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'slot-utilization', hostId, startDate, endDate] as const,
    queryFn: () => {
      let url = `/v1/analytics/slot-utilization/${hostId}`;
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const queryString = params.toString();
      return apiHelper.get(queryString ? `${url}?${queryString}` : url);
    },
    enabled: !!hostId,
    staleTime: 10 * 60 * 1000,
  });
};
