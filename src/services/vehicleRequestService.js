/**
 * Vehicle Request Service
 * Handles vehicle retrieval request operations
 */

import { apiHelper } from './api';

const vehicleRequestService = {
  /**
   * Create retrieval request
   * @param {string} customerId - Customer ID
   * @returns {Promise} Created request
   */
  createRequest: async (customerId) => {
    try {
      const response = await apiHelper.post(`/v1/requests/create?customerId=${customerId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Accept retrieval request
   * @param {string} requestId - Request ID
   * @param {string} valetId - Valet ID
   * @returns {Promise}
   */
  acceptRequest: async (requestId, valetId) => {
    try {
      const response = await apiHelper.post(`/v1/requests/${requestId}/accept?valetId=${valetId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete delivery
   * @param {string} requestId - Request ID
   * @returns {Promise}
   */
  completeDelivery: async (requestId) => {
    try {
      const response = await apiHelper.post(`/v1/requests/${requestId}/complete`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cancel request
   * @param {string} requestId - Request ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise}
   */
  cancelRequest: async (requestId, reason) => {
    try {
      const response = await apiHelper.post(`/v1/requests/${requestId}/cancel`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get pending requests for host
   * @param {string} hostId - Host ID
   * @returns {Promise} List of pending requests
   */
  getPendingRequests: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/requests/host/${hostId}/pending`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get valet requests
   * @param {string} valetId - Valet ID
   * @returns {Promise} List of valet requests
   */
  getValetRequests: async (valetId) => {
    try {
      const response = await apiHelper.get(`/v1/requests/valet/${valetId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get request details
   * @param {string} requestId - Request ID
   * @returns {Promise} Request details
   */
  getRequestDetails: async (requestId) => {
    try {
      const response = await apiHelper.get(`/v1/requests/${requestId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Manually assign request to valet
   * @param {string} requestId - Request ID
   * @param {string} valetId - Valet ID
   * @returns {Promise}
   */
  assignToValet: async (requestId, valetId) => {
    try {
      const response = await apiHelper.post(`/v1/requests/${requestId}/assign?valetId=${valetId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Broadcast request to all valets
   * @param {string} requestId - Request ID
   * @param {string} hostId - Host ID
   * @returns {Promise}
   */
  broadcastRequest: async (requestId, hostId) => {
    try {
      const response = await apiHelper.post(`/v1/requests/${requestId}/broadcast?hostId=${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default vehicleRequestService;
