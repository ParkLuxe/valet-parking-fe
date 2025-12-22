/**
 * Host Service
 * Handles host-related API operations
 */

import { apiHelper } from './api';

const hostService = {
  /**
   * Register new host
   * @param {object} hostData - Host registration data
   * @returns {Promise} Created host data
   */
  register: async (hostData) => {
    try {
      const response = await apiHelper.post('/v1/admin/host/register', hostData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get host details
   * @param {string} hostId - Host ID
   * @returns {Promise} Host details
   */
  getHostDetails: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/admin/host/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default hostService;
