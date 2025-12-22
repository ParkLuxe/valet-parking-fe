/**
 * Analytics Service
 * Handles analytics and reporting operations
 */

import { apiHelper } from './api';

const analyticsService = {
  /**
   * Get comprehensive dashboard data
   * @param {string} hostId - Host ID
   * @returns {Promise} Dashboard data
   */
  getDashboard: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/analytics/dashboard/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get valet performance
   * @param {string} valetId - Valet ID
   * @returns {Promise} Valet performance data
   */
  getValetPerformance: async (valetId) => {
    try {
      const response = await apiHelper.get(`/v1/analytics/valet/${valetId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get average parking time
   * @param {string} hostId - Host ID
   * @returns {Promise} Average parking time in minutes
   */
  getAverageParkingTime: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/analytics/parking-time/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get average delivery time
   * @param {string} hostId - Host ID
   * @returns {Promise} Average delivery time in minutes
   */
  getAverageDeliveryTime: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/analytics/delivery-time/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get active valets count
   * @param {string} hostId - Host ID
   * @returns {Promise} Active valets count
   */
  getActiveValets: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/analytics/active-valets/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get currently parked vehicles count
   * @param {string} hostId - Host ID
   * @returns {Promise} Parked vehicles count
   */
  getParkedVehicles: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/analytics/parked-vehicles/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get recent activity
   * @param {string} hostId - Host ID
   * @param {number} limit - Number of activities to fetch
   * @returns {Promise} Recent activity list
   */
  getRecentActivity: async (hostId, limit = 10) => {
    try {
      const response = await apiHelper.get(`/v1/analytics/recent-activity/${hostId}?limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get monthly revenue
   * @param {string} hostId - Host ID
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @returns {Promise} Monthly revenue data
   */
  getMonthlyRevenue: async (hostId, month, year) => {
    try {
      const response = await apiHelper.get(
        `/v1/analytics/revenue/${hostId}?month=${month}&year=${year}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get scan trends
   * @param {string} hostId - Host ID
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Promise} Scan trends data
   */
  getScanTrends: async (hostId, startDate, endDate) => {
    try {
      const response = await apiHelper.get(
        `/v1/analytics/scan-trends/${hostId}?startDate=${startDate}&endDate=${endDate}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get performance comparison (SUPERADMIN only)
   * @param {Array<string>} hostIds - Array of host IDs
   * @returns {Promise} Comparison data
   */
  getPerformanceComparison: async (hostIds) => {
    try {
      const hostIdsParam = hostIds.join(',');
      const response = await apiHelper.get(`/v1/analytics/comparison?hostIds=${hostIdsParam}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default analyticsService;
