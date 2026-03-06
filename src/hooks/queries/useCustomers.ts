/**
 * Customer API hooks using TanStack Query
 * Handles customer listing with filter/pagination via POST /v1/customer/filter
 */

import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../../services/api';
import { addToast } from '../../redux';

// Customer filter request type
export interface CustomerFilters {
  hostId?: number | null;
  customerId?: number | null;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
  vehicleColor?: string;
  vehicleStatus?: string;
  licenseNumber?: string;
  customerName?: string;
  status?: string;
}

// Customer response type
export interface Customer {
  customerId: number;
  customerName: string;
  vehicleNumber?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleStatus?: string;
  licenseNumber?: string;
  qrCode?: string;
  parkingSlot?: string;
  parkingSlotNumber?: string;
  status?: string;
  hostId?: number;
  hostName?: string;
  checkInTime?: string;
  checkOutTime?: string;
  phone?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerFilterResponse {
  content: Customer[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

// Filter customers mutation (POST-based filter with pagination)
export const useFilterCustomers = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({
      filters,
      page = 0,
      size = 10,
      sortBy = 'customerId',
      sortDirection = 'ASC',
    }: {
      filters: CustomerFilters;
      page?: number;
      size?: number;
      sortBy?: string;
      sortDirection?: 'ASC' | 'DESC';
    }) => {
      const response = await apiHelper.post(
        `/v1/customer/filter?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
        filters
      );
      return response as CustomerFilterResponse;
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to load customers',
      }));
    },
  });
};
