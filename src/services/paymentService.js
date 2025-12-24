/**
 * Payment Service
 * Handles payment operations and Razorpay integration
 */

import { apiHelper } from './api';

const paymentService = {
  /**
   * Create Razorpay order
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise} Razorpay order details
   */
  createOrder: async (invoiceId) => {
    try {
      const response = await apiHelper.post(`/v1/payments/create-order?invoiceId=${invoiceId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify payment
   * @param {object} paymentData - Payment verification data
   * @returns {Promise} Verification result
   */
  verifyPayment: async (paymentData) => {
    try {
      const response = await apiHelper.post('/v1/payments/verify', paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Handle webhook
   * @param {object} webhookData - Webhook data
   * @returns {Promise}
   */
  handleWebhook: async (webhookData) => {
    try {
      const response = await apiHelper.post('/v1/payments/webhook', webhookData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get payment details
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Payment details
   */
  getPaymentDetails: async (paymentId) => {
    try {
      const response = await apiHelper.get(`/v1/payments/${paymentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get payment history
   * @param {string} hostId - Host ID
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise} Payment history
   */
  getPaymentHistory: async (hostId, page = 0, size = 10) => {
    try {
      const response = await apiHelper.get(`/v1/payments/host/${hostId}?page=${page}&size=${size}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get payment stats
   * @param {string} hostId - Host ID
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Promise} Payment statistics
   */
  getPaymentStats: async (hostId, startDate, endDate) => {
    try {
      const response = await apiHelper.get(
        `/v1/payments/stats/${hostId}?startDate=${startDate}&endDate=${endDate}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Initiate refund
   * @param {string} paymentId - Payment ID
   * @param {number} amount - Refund amount
   * @returns {Promise}
   */
  initiateRefund: async (paymentId, amount) => {
    try {
      const response = await apiHelper.post(`/v1/payments/${paymentId}/refund?amount=${amount}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;
