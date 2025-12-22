/**
 * Host Schedules Service
 * Handles host operating schedule management
 */

import { apiHelper } from './api';

const hostSchedulesService = {
  /**
   * Create host schedule
   * @param {string} hostId - Host ID
   * @param {object} scheduleData - Schedule data
   * @returns {Promise} Created schedule
   */
  createSchedule: async (hostId, scheduleData) => {
    try {
      const response = await apiHelper.post(`/v1/host-schedules/create/host/${hostId}`, scheduleData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get schedule by ID
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise} Schedule details
   */
  getSchedule: async (scheduleId) => {
    try {
      const response = await apiHelper.get(`/v1/host-schedules/${scheduleId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * List schedules by host
   * @param {string} hostId - Host ID
   * @returns {Promise} List of schedules
   */
  getSchedulesByHost: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/host-schedules/host/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update schedule
   * @param {string} scheduleId - Schedule ID
   * @param {object} scheduleData - Updated schedule data
   * @returns {Promise} Updated schedule
   */
  updateSchedule: async (scheduleId, scheduleData) => {
    try {
      const response = await apiHelper.put(`/v1/host-schedules/${scheduleId}`, scheduleData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete schedule
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise}
   */
  deleteSchedule: async (scheduleId) => {
    try {
      const response = await apiHelper.delete(`/v1/host-schedules/${scheduleId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default hostSchedulesService;
