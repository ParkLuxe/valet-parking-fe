/**
 * Host Schedule API hooks using TanStack Query
 * Handles host schedule management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../services/api';
import { addToast } from '../redux';
import { queryKeys } from '../lib/queryKeys';

// Create schedule mutation
export const useCreateSchedule = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ hostId, ...data }: { hostId: string; dayOfWeek: string; openTime: string; closeTime: string; isOpen: boolean }) => {
      const response = await apiHelper.post(`/v1/host-schedules/create/host/${hostId}`, data);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.host(variables.hostId) });
      dispatch(addToast({
        type: 'success',
        message: 'Schedule created successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to create schedule',
      }));
    },
  });
};

// Get schedule by ID
export const useSchedule = (scheduleId: string) => {
  return useQuery({
    queryKey: queryKeys.schedules.detail(scheduleId),
    queryFn: () => apiHelper.get(`/v1/host-schedules/${scheduleId}`),
    enabled: !!scheduleId,
    staleTime: 10 * 60 * 1000,
  });
};

// Get all schedules for host
export const useHostSchedules = (hostId: string) => {
  return useQuery({
    queryKey: queryKeys.schedules.host(hostId),
    queryFn: () => apiHelper.get(`/v1/host-schedules/host/${hostId}`),
    enabled: !!hostId,
    staleTime: 10 * 60 * 1000,
  });
};

// Update schedule mutation
export const useUpdateSchedule = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ scheduleId, ...data }: { scheduleId: string; dayOfWeek?: string; openTime?: string; closeTime?: string; isOpen?: boolean }) => {
      const response = await apiHelper.put(`/v1/host-schedules/${scheduleId}`, data);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.detail(variables.scheduleId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
      dispatch(addToast({
        type: 'success',
        message: 'Schedule updated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to update schedule',
      }));
    },
  });
};

// Delete schedule mutation
export const useDeleteSchedule = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (scheduleId: string) => {
      const response = await apiHelper.delete(`/v1/host-schedules/${scheduleId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
      dispatch(addToast({
        type: 'success',
        message: 'Schedule deleted successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to delete schedule',
      }));
    },
  });
};
