/**
 * QR Code API hooks using TanStack Query
 * Handles QR code generation, scanning, and management operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiHelper } from '../../services/api';
import { addToast } from '../../redux';
import { queryKeys } from '../../lib/queryKeys';

// Generate single QR code mutation
export const useGenerateQRCode = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      hostId: string;
      customData?: any;
    }) => {
      const response = await apiHelper.post('/v1/qr/generate', data);
      return response;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qrCodes.list(data.hostId) });
      dispatch(addToast({
        type: 'success',
        message: 'QR code generated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to generate QR code',
      }));
    },
  });
};

// Generate batch QR codes mutation
export const useGenerateBatchQRCodes = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ hostId, count }: { hostId: string; count: number }) => {
      const response = await apiHelper.post(`/v1/qr/batch?hostId=${hostId}&count=${count}`);
      return response;
    },
    onSuccess: (_, { hostId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qrCodes.list(hostId) });
      dispatch(addToast({
        type: 'success',
        message: 'QR codes generated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to generate QR codes',
      }));
    },
  });
};

// Scan QR code mutation (public, no auth)
export const useScanQRCode = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (data: {
      qrCode: string;
      customerPhone?: string;
      customerName?: string;
    }) => {
      const response = await apiHelper.post('/v1/qr/scan', data);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({
        type: 'success',
        message: 'QR code scanned successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to scan QR code',
      }));
    },
  });
};

// Get QR code details
export const useQRCode = (qrCode: string) => {
  return useQuery({
    queryKey: queryKeys.qrCodes.detail(qrCode),
    queryFn: () => apiHelper.get(`/v1/qr/${qrCode}`),
    enabled: !!qrCode,
    staleTime: 5 * 60 * 1000,
  });
};

// Validate QR code
export const useValidateQRCode = (qrCode: string) => {
  return useQuery({
    queryKey: [...queryKeys.qrCodes.all, 'validate', qrCode] as const,
    queryFn: () => apiHelper.get(`/v1/qr/validate/${qrCode}`),
    enabled: !!qrCode,
    staleTime: 2 * 60 * 1000,
  });
};

// Get active QR codes for host
export const useActiveQRCodes = (hostId: string) => {
  return useQuery({
    queryKey: queryKeys.qrCodes.list(hostId),
    queryFn: () => apiHelper.get(`/v1/qr/host/${hostId}/active`),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
};

// Deactivate QR code mutation
export const useDeactivateQRCode = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (qrCode: string) => {
      const response = await apiHelper.post(`/v1/qr/${qrCode}/deactivate`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qrCodes.all });
      dispatch(addToast({
        type: 'success',
        message: 'QR code deactivated successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to deactivate QR code',
      }));
    },
  });
};

// Link QR code to parking slot mutation
export const useLinkQRCodeToSlot = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ qrCode, slotId }: { qrCode: string; slotId: string }) => {
      const response = await apiHelper.post(`/v1/qr/${qrCode}/link-slot?slotId=${slotId}`);
      return response;
    },
    onSuccess: (_, { qrCode }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qrCodes.detail(qrCode) });
      queryClient.invalidateQueries({ queryKey: queryKeys.qrCodes.all });
      dispatch(addToast({
        type: 'success',
        message: 'QR code linked to parking slot successfully',
      }));
    },
    onError: (error: any) => {
      dispatch(addToast({
        type: 'error',
        message: error?.message || 'Failed to link QR code to parking slot',
      }));
    },
  });
};

// Get QR code usage tracking
export const useQRCodeUsage = (qrCode: string) => {
  return useQuery({
    queryKey: [...queryKeys.qrCodes.all, 'usage', qrCode] as const,
    queryFn: () => apiHelper.get(`/v1/qr/${qrCode}/usage`),
    enabled: !!qrCode,
    staleTime: 5 * 60 * 1000,
  });
};
