/**
 * Vehicle API hooks using TanStack Query
 * Handles vehicle status and parking management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../services/api';
import { addToast } from '../redux';
import { queryKeys } from '../lib/queryKeys';

// Park vehicle mutation
export const useParkVehicle = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      customerId: string;
      vehicleNumber: string;
      vehicleModel?: string;
      parkingSlotId?: string;
      qrCode?: string;
    }) => {
      const response = await apiHelper.post('/v1/vehicle-status/park', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      dispatch(addToast({
        type: 'success',
        message: 'Vehicle parked successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to park vehicle',
      }));
    },
  });
};

// Update parking slot mutation
export const useUpdateParkingSlot = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ statusId, slotId }: { statusId: string; slotId: string }) => {
      const response = await apiHelper.post(`/v1/vehicle-status/${statusId}/update-slot`, { slotId });
      return response;
    },
    onSuccess: (_, { statusId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.detail(statusId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.lists() });
      dispatch(addToast({
        type: 'success',
        message: 'Parking slot updated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to update parking slot',
      }));
    },
  });
};

// Assign valet mutation
export const useAssignValet = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ statusId, valetId }: { statusId: string; valetId: string }) => {
      const response = await apiHelper.post(`/v1/vehicle-status/${statusId}/assign-valet`, { valetId });
      return response;
    },
    onSuccess: (_, { statusId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.detail(statusId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.lists() });
      dispatch(addToast({
        type: 'success',
        message: 'Valet assigned successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to assign valet',
      }));
    },
  });
};

// Mark vehicle out for delivery mutation
export const useMarkOutForDelivery = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (statusId: string) => {
      const response = await apiHelper.post(`/v1/vehicle-status/${statusId}/mark-out-for-delivery`);
      return response;
    },
    onSuccess: (_, statusId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.detail(statusId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.lists() });
      dispatch(addToast({
        type: 'success',
        message: 'Vehicle marked for delivery',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to mark vehicle for delivery',
      }));
    },
  });
};

// Deliver vehicle mutation
export const useDeliverVehicle = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (statusId: string) => {
      const response = await apiHelper.post(`/v1/vehicle-status/${statusId}/deliver`);
      return response;
    },
    onSuccess: (_, statusId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.detail(statusId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.lists() });
      dispatch(addToast({
        type: 'success',
        message: 'Vehicle delivered successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to deliver vehicle',
      }));
    },
  });
};

// Get vehicle status by ID
export const useVehicleStatus = (statusId: string) => {
  return useQuery({
    queryKey: queryKeys.vehicles.detail(statusId),
    queryFn: () => apiHelper.get(`/v1/vehicle-status/${statusId}`),
    enabled: !!statusId,
    staleTime: 3 * 60 * 1000,
  });
};

// Get customer's vehicle
export const useCustomerVehicle = (customerId: string) => {
  return useQuery({
    queryKey: [...queryKeys.vehicles.all, 'customer', customerId] as const,
    queryFn: () => apiHelper.get(`/v1/vehicle-status/customer/${customerId}`),
    enabled: !!customerId,
    staleTime: 3 * 60 * 1000,
  });
};

// Get parked vehicles for host
export const useParkedVehicles = (hostId: string) => {
  return useQuery({
    queryKey: [...queryKeys.vehicles.all, 'parked', hostId] as const,
    queryFn: () => apiHelper.get(`/v1/vehicle-status/host/${hostId}/parked`),
    enabled: !!hostId,
    staleTime: 2 * 60 * 1000, // 2 minutes - more frequent updates
  });
};

// Get valet's vehicles
export const useValetVehicles = (valetId: string) => {
  return useQuery({
    queryKey: [...queryKeys.vehicles.all, 'valet', valetId] as const,
    queryFn: () => apiHelper.get(`/v1/vehicle-status/valet/${valetId}`),
    enabled: !!valetId,
    staleTime: 2 * 60 * 1000,
  });
};

// Get all host vehicles (paginated)
export const useHostVehicles = (hostId: string, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: [...queryKeys.vehicles.all, 'host', hostId, page, size] as const,
    queryFn: () => apiHelper.get(`/v1/vehicle-status/host/${hostId}/all?page=${page}&size=${size}`),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
};
