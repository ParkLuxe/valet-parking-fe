/**
 * Subscription Service
 * Handles subscription management operations
 */

import { apiHelper } from './api';

const subscriptionService = {
  /**
   * Initialize subscription
   * @param {object} subscriptionData - Subscription data (hostId, planId)
   * @returns {Promise} Created subscription
   */
  initialize: async (subscriptionData) => {
    try {
      const response = await apiHelper.post('/v1/subscriptions/initialize', subscriptionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Increment scan usage
   * @param {string} hostId - Host ID
   * @returns {Promise}
   */
  incrementScan: async (hostId) => {
    try {
      const response = await apiHelper.post(`/v1/subscriptions/${hostId}/scan`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get subscription details
   * @param {string} hostId - Host ID
   * @returns {Promise} Subscription details
   */
  getSubscription: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/subscriptions/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get usage statistics
   * @param {string} hostId - Host ID
   * @param {number} month - Month
   * @param {number} year - Year
   * @returns {Promise} Usage stats
   */
  getUsageStats: async (hostId, month, year) => {
    try {
      const response = await apiHelper.get(`/v1/subscriptions/${hostId}/usage?month=${month}&year=${year}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Renew subscription
   * @param {string} hostId - Host ID
   * @returns {Promise}
   */
  renewSubscription: async (hostId) => {
    try {
      const response = await apiHelper.post(`/v1/subscriptions/${hostId}/renew`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update subscription plan
   * @param {string} hostId - Host ID
   * @param {string} newPlanId - New plan ID
   * @returns {Promise}
   */
  updatePlan: async (hostId, newPlanId) => {
    try {
      const response = await apiHelper.put(`/v1/subscriptions/${hostId}/plan?newPlanId=${newPlanId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get pending charges
   * @param {string} hostId - Host ID
   * @returns {Promise} Pending charges
   */
  getPendingCharges: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/subscriptions/${hostId}/charges`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deactivate subscription
   * @param {string} hostId - Host ID
   * @returns {Promise}
   */
  deactivate: async (hostId) => {
    try {
      const response = await apiHelper.post(`/v1/subscriptions/${hostId}/deactivate`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get subscription status
   * @param {string} hostId - Host ID
   * @returns {Promise} Status
   */
  getStatus: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/subscriptions/${hostId}/status`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default subscriptionService;
