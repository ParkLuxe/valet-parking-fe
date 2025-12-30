/**
 * QR Code Service - Lightweight wrapper around apiHelper
 * For new code, prefer using TanStack Query hooks from ../api/qrCodes
 */

import { apiHelper } from './api';

const qrCodeService = {
  generateQRCode: async (data: any) => {
    const response = await apiHelper.post('/v1/qr/generate', data);
    return response;
  },

  // Alias for backward compatibility
  generate: async (data: any) => {
    const response = await apiHelper.post('/v1/qr/generate', data);
    return response;
  },

  generateBatch: async (hostId: string, count: number) => {
    const response = await apiHelper.post(`/v1/qr/batch?hostId=${hostId}&count=${count}`);
    return response;
  },

  scanQRCode: async (data: any) => {
    const response = await apiHelper.post('/v1/qr/scan', data);
    return response;
  },

  getQRCode: async (qrCode: string) => {
    const response = await apiHelper.get(`/v1/qr/${qrCode}`);
    return response;
  },

  getActiveQRCodes: async (hostId: string) => {
    const response = await apiHelper.get(`/v1/qr/host/${hostId}/active`);
    return response;
  },

  deactivateQRCode: async (qrCode: string) => {
    const response = await apiHelper.post(`/v1/qr/${qrCode}/deactivate`);
    return response;
  },

  // Alias for backward compatibility
  deactivate: async (qrCode: string) => {
    const response = await apiHelper.post(`/v1/qr/${qrCode}/deactivate`);
    return response;
  },

  linkToSlot: async (qrCode: string, slotId: string) => {
    const response = await apiHelper.post(`/v1/qr/${qrCode}/link-slot?slotId=${slotId}`);
    return response;
  },

  exportQRCodes: async (hostId: string) => {
    // Use getActiveQRCodes for export functionality
    const response = await apiHelper.get(`/v1/qr/host/${hostId}/active`);
    return response;
  },
};

export default qrCodeService;
