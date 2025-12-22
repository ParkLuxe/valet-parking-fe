/**
 * Country and State Service
 * Handles country and state management operations
 */

import { apiHelper } from './api';

const countryStateService = {
  /**
   * Create country
   * @param {object} countryData - Country data
   * @returns {Promise} Created country
   */
  createCountry: async (countryData) => {
    try {
      const response = await apiHelper.post('/v1/country/create', countryData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * List all countries
   * @returns {Promise} List of countries
   */
  listCountries: async () => {
    try {
      const response = await apiHelper.get('/v1/country');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get country by code
   * @param {string} countryCode - Country code
   * @returns {Promise} Country details
   */
  getCountry: async (countryCode) => {
    try {
      const response = await apiHelper.get(`/v1/country/${countryCode}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create state
   * @param {object} stateData - State data
   * @returns {Promise} Created state
   */
  createState: async (stateData) => {
    try {
      const response = await apiHelper.post('/v1/states/create', stateData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Batch create states
   * @param {Array<object>} statesData - Array of state data
   * @returns {Promise} Created states
   */
  batchCreateStates: async (statesData) => {
    try {
      const response = await apiHelper.post('/v1/states/batch-create', statesData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * List all states
   * @returns {Promise} List of states
   */
  listStates: async () => {
    try {
      const response = await apiHelper.get('/v1/states');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get state by ID
   * @param {string} id - State ID
   * @returns {Promise} State details
   */
  getState: async (id) => {
    try {
      const response = await apiHelper.get(`/v1/states/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get states by country
   * @param {string} countryCode - Country code
   * @returns {Promise} List of states for the country
   */
  getStatesByCountry: async (countryCode) => {
    try {
      const response = await apiHelper.get(`/v1/states/country/${countryCode}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default countryStateService;
