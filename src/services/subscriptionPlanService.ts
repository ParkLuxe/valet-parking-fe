/**
 * Subscription Plan Service
 * Handles subscription plan management operations
 */

import {  RESPONSE_VALUES  } from '../utils';
import { apiHelper } from './api';

const subscriptionPlanService = {
  /**
   * Create subscription plan (SUPERADMIN only)
   * @param {object} planData - Plan data
   * @returns {Promise} Created plan
   */
  createPlan: async (planData) => {
    try {
      const response = await apiHelper.post('/v1/subscription-plans', planData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update subscription plan (SUPERADMIN only)
   * @param {string} planId - Plan ID
   * @param {object} planData - Updated plan data
   * @returns {Promise} Updated plan
   */
  updatePlan: async (planId, planData) => {
    try {
      const response = await apiHelper.put(`/v1/subscription-plans/${planId}`, planData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get plan by ID
   * @param {string} planId - Plan ID
   * @returns {Promise} Plan details
   */
  getPlanById: async (planId) => {
    try {
      const response = await apiHelper.get(`/v1/subscription-plans/${planId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get plan by name
   * @param {string} planName - Plan name
   * @returns {Promise} Plan details
   */
  getPlanByName: async (planName) => {
    try {
      const response = await apiHelper.get(`/v1/subscription-plans/name/${planName}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all plans (SUPERADMIN only)
   * @returns {Promise} List of all plans
   */
  getAllPlans: async () => {
    try {
      const response = await apiHelper.get('/v1/subscription-plans');
      if (response?.infoType === RESPONSE_VALUES.SUCCESS)
        return response?.data || [];
      else throw new Error(response?.message || "Failed to fetch plans");
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get active plans
   * @returns {Promise} List of active plans
   */
  getActivePlans: async () => {
    try {
      const response = await apiHelper.get('/v1/subscription-plans/active');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get standard plans
   * @returns {Promise} List of standard plans
   */
  getStandardPlans: async () => {
    try {
      const response = await apiHelper.get('/v1/subscription-plans/standard');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get custom plans (SUPERADMIN only)
   * @returns {Promise} List of custom plans
   */
  getCustomPlans: async () => {
    try {
      const response = await apiHelper.get('/v1/subscription-plans/custom');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default subscriptionPlanService;
