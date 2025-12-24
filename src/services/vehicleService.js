/**
 * Vehicle Service
 * Handles vehicle-related API operations
 */

import { apiHelper } from './api';

const vehicleService = {
  /**
   * Update vehicle status
   * @param {string} customerId - Customer ID
   * @param {object} statusData - Status update data
   * @returns {Promise} Updated vehicle status
   */
  updateVehicleStatus: async (customerId, statusData) => {
    try {
      const response = await apiHelper.put(`/v1/vehicles/${customerId}/status`, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get vehicle status
   * @param {string} customerId - Customer ID
   * @returns {Promise} Vehicle status
   */
  getVehicleStatus: async (customerId) => {
    try {
      const response = await apiHelper.get(`/v1/vehicles/${customerId}/status`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get vehicle status history
   * @param {string} customerId - Customer ID
   * @returns {Promise} Status history
   */
  getStatusHistory: async (customerId) => {
    try {
      const response = await apiHelper.get(`/v1/vehicles/${customerId}/history`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Assign valet to vehicle
   * @param {string} customerId - Customer ID
   * @param {string} valetId - Valet ID
   * @returns {Promise}
   */
  assignValet: async (customerId, valetId) => {
    try {
      const response = await apiHelper.post(`/v1/vehicles/${customerId}/assign-valet?valetId=${valetId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get vehicles by status
   * @param {string} hostId - Host ID
   * @param {string} status - Vehicle status
   * @returns {Promise} List of vehicles
   */
  getVehiclesByStatus: async (hostId, status) => {
    try {
      const response = await apiHelper.get(`/v1/vehicles/host/${hostId}/status/${status}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get vehicle status counts
   * @param {string} hostId - Host ID
   * @returns {Promise} Status counts
   */
  getStatusCounts: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/vehicles/host/${hostId}/counts`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request vehicle retrieval
   * @param {string} customerId - Customer ID
   * @returns {Promise}
   */
  requestRetrieval: async (customerId) => {
    try {
      const response = await apiHelper.post(`/v1/vehicles/${customerId}/retrieval-request`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mark vehicle as out for delivery
   * @param {string} customerId - Customer ID
   * @param {string} valetId - Valet ID
   * @returns {Promise}
   */
  markOutForDelivery: async (customerId, valetId) => {
    try {
      const response = await apiHelper.post(`/v1/vehicles/${customerId}/out-for-delivery?valetId=${valetId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mark vehicle as delivered
   * @param {string} customerId - Customer ID
   * @returns {Promise}
   */
  markDelivered: async (customerId) => {
    try {
      const response = await apiHelper.post(`/v1/vehicles/${customerId}/delivered`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get parking duration
   * @param {string} customerId - Customer ID
   * @returns {Promise} Duration data
   */
  getParkingDuration: async (customerId) => {
    try {
      const response = await apiHelper.get(`/v1/vehicles/${customerId}/duration`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all active vehicles (legacy method for backward compatibility)
   * @param {string} hostId - Host ID
   * @returns {Promise} List of active vehicles
   */
  getActiveVehicles: async (hostId) => {
    try {
      if (!hostId) {
        console.warn('No hostId provided for getActiveVehicles');
        return [];
      }
      const response = await apiHelper.get(`/v1/vehicles/host/${hostId}/status/PARKED`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get vehicle history (legacy method)
   * @param {object} filters - Filters (date range, status, etc.)
   * @returns {Promise} List of historical vehicles
   */
  getVehicleHistory: async (filters = {}) => {
    try {
      // This might need adjustment based on backend implementation
      const response = await apiHelper.get('/v1/vehicles/history', { params: filters });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default vehicleService;
