/**
 * Parking Slot API hooks using TanStack Query
 * Handles parking slot management operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../services/api';
import { addToast } from '../redux';
import { queryKeys } from '../lib/queryKeys';

// Create parking slots mutation
export const useCreateParkingSlots = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ hostId, slots }: {
      hostId: string;
      slots: Array<{
        slotNumber: string;
        slotType?: string;
        isAvailable?: boolean;
      }>;
    }) => {
      const response = await apiHelper.post(`/v1/parking-slot/create?hostId=${hostId}`, slots);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parkingSlots.all });
      dispatch(addToast({
        type: 'success',
        message: 'Parking slots created successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to create parking slots',
      }));
    },
  });
};
