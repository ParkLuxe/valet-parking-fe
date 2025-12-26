/**
 * Host User Service
 * Handles host user (valet/admin) management operations
 */

import { apiHelper } from './api';

const hostUserService = {
  /**
   * Create host user (valet/admin)
   * @param {string} hostId - Host ID
   * @param {object} userData - User data
   * @returns {Promise} Created user data
   */
  createUser: async (hostId, userData) => {
    try {
      const response = await apiHelper.post(`/v1/host-users/create?hostId=${hostId}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all host users
   * @param {string} hostId - Host ID
   * @param {string} role - Optional role filter
   * @returns {Promise} List of host users
   */
  getHostUsers: async (hostId, role = null) => {
    try {
      const url = role 
        ? `/v1/host-users/host/${hostId}?role=${role}`
        : `/v1/host-users/host/${hostId}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {object} passwordData - Password data
   * @returns {Promise}
   */
  changePassword: async (userId, passwordData) => {
    try {
      const response = await apiHelper.post(`/v1/host-users/${userId}/change-password`, passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile
   */
  getCurrentUser: async () => {
    try {
      const response = await apiHelper.get('/v1/host-users/me');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default hostUserService;
