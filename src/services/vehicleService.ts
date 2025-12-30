/**
 * Vehicle Service - Lightweight wrapper around apiHelper
 * For new code, prefer using TanStack Query hooks from ../api/vehicles
 */

import { apiHelper } from './api';

const vehicleService = {
  parkVehicle: async (data: any) => {
    const response = await apiHelper.post('/v1/vehicle-status/park', data);
    return response;
  },

  // Alias for backward compatibility
  addVehicle: async (data: any) => {
    const response = await apiHelper.post('/v1/vehicle-status/park', data);
    return response;
  },

  updateParkingSlot: async (statusId: string, slotId: string) => {
    const response = await apiHelper.post(`/v1/vehicle-status/${statusId}/update-slot`, { slotId });
    return response;
  },

  assignValet: async (statusId: string, valetId: string) => {
    const response = await apiHelper.post(`/v1/vehicle-status/${statusId}/assign-valet`, { valetId });
    return response;
  },

  markOutForDelivery: async (statusId: string) => {
    const response = await apiHelper.post(`/v1/vehicle-status/${statusId}/mark-out-for-delivery`);
    return response;
  },

  deliverVehicle: async (statusId: string) => {
    const response = await apiHelper.post(`/v1/vehicle-status/${statusId}/deliver`);
    return response;
  },

  getVehicleStatus: async (statusId: string) => {
    const response = await apiHelper.get(`/v1/vehicle-status/${statusId}`);
    return response;
  },

  getCustomerVehicle: async (customerId: string) => {
    const response = await apiHelper.get(`/v1/vehicle-status/customer/${customerId}`);
    return response;
  },

  getParkedVehicles: async (hostId: string) => {
    const response = await apiHelper.get(`/v1/vehicle-status/host/${hostId}/parked`);
    return response;
  },

  getValetVehicles: async (valetId: string) => {
    const response = await apiHelper.get(`/v1/vehicle-status/valet/${valetId}`);
    return response;
  },

  getHostVehicles: async (hostId: string, page: number = 0, size: number = 10) => {
    const response = await apiHelper.get(`/v1/vehicle-status/host/${hostId}/all?page=${page}&size=${size}`);
    return response;
  },

  updateVehicleStatus: async (statusId: string, data: any) => {
    // This is a generic update - map to specific endpoint based on status
    if (data.status === 'OUT_FOR_DELIVERY') {
      return await apiHelper.post(`/v1/vehicle-status/${statusId}/mark-out-for-delivery`);
    } else if (data.status === 'DELIVERED') {
      return await apiHelper.post(`/v1/vehicle-status/${statusId}/deliver`);
    }
    // For other updates, may need specific endpoint
    throw new Error('Update vehicle status: endpoint not determined for this status');
  },
};

export default vehicleService;
