/**
 * QR Code Service
 * Handles QR code generation, scanning, and management
 */

import { apiHelper } from './api';

const qrCodeService = {
  /**
   * Generate single QR code
   * @param {object} qrData - QR code data
   * @returns {Promise} Generated QR code
   */
  generate: async (qrData) => {
    try {
      const response = await apiHelper.post('/v1/qr/generate', qrData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generate batch QR codes
   * @param {string} hostId - Host ID
   * @param {number} count - Number of QR codes to generate
   * @returns {Promise} Generated QR codes
   */
  generateBatch: async (hostId, count) => {
    try {
      const response = await apiHelper.post(`/v1/qr/batch?hostId=${hostId}&count=${count}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Scan QR code (public, no auth)
   * @param {object} scanData - Scan data
   * @returns {Promise} Scan result
   */
  scan: async (scanData) => {
    try {
      const response = await apiHelper.post('/v1/qr/scan', scanData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get QR code details
   * @param {string} qrCode - QR code
   * @returns {Promise} QR code details
   */
  getDetails: async (qrCode) => {
    try {
      const response = await apiHelper.get(`/v1/qr/${qrCode}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Validate QR code
   * @param {string} qrCode - QR code
   * @returns {Promise} Validation result
   */
  validate: async (qrCode) => {
    try {
      const response = await apiHelper.get(`/v1/qr/validate/${qrCode}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get active QR codes for host
   * @param {string} hostId - Host ID
   * @returns {Promise} List of active QR codes
   */
  getActiveQRCodes: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/qr/host/${hostId}/active`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deactivate QR code
   * @param {string} qrCode - QR code
   * @returns {Promise}
   */
  deactivate: async (qrCode) => {
    try {
      const response = await apiHelper.post(`/v1/qr/${qrCode}/deactivate`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Link QR code to parking slot
   * @param {string} qrCode - QR code
   * @param {string} slotId - Parking slot ID
   * @returns {Promise}
   */
  linkToSlot: async (qrCode, slotId) => {
    try {
      const response = await apiHelper.post(`/v1/qr/${qrCode}/link-slot?slotId=${slotId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export QR codes for host
   * @param {string} hostId - Host ID
   * @returns {Promise} Export data
   */
  exportQRCodes: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/qr/host/${hostId}/export`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default qrCodeService;
