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
    mutationFn: async (scheduleData: {
      hostId: string;
      dayOfWeek: string;
      openTime: string;
      closeTime: string;
      isOpen: boolean;
    }) => {
      const response = await apiHelper.post('/v1/host-schedule', scheduleData);
      return response;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hostSchedules.list(data.hostId) });
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
    queryKey: [...queryKeys.hostSchedules.all, 'detail', scheduleId] as const,
    queryFn: () => apiHelper.get(`/v1/host-schedule/${scheduleId}`),
    enabled: !!scheduleId,
    staleTime: 10 * 60 * 1000,
  });
};

// Get host schedules
export const useHostSchedules = (hostId: string) => {
  return useQuery({
    queryKey: queryKeys.hostSchedules.list(hostId),
    queryFn: () => apiHelper.get(`/v1/host-schedule/host/${hostId}`),
    enabled: !!hostId,
    staleTime: 10 * 60 * 1000,
  });
};

// Update schedule mutation
export const useUpdateSchedule = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ scheduleId, ...scheduleData }: {
      scheduleId: string;
      dayOfWeek?: string;
      openTime?: string;
      closeTime?: string;
      isOpen?: boolean;
    }) => {
      const response = await apiHelper.put(`/v1/host-schedule/${scheduleId}`, scheduleData);
      return response;
    },
    onSuccess: (data: any, { scheduleId }) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.hostSchedules.all, 'detail', scheduleId] });
      queryClient.invalidateQueries({ queryKey: queryKeys.hostSchedules.list(data.hostId) });
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
    mutationFn: async ({ scheduleId, hostId }: { scheduleId: string; hostId: string }) => {
      const response = await apiHelper.delete(`/v1/host-schedule/${scheduleId}`);
      return { response, hostId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hostSchedules.list(data.hostId) });
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
