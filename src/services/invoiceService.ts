/**
 * Invoice Service
 * Handles invoice management operations
 */

import { apiHelper } from './api';

const invoiceService = {
  /**
   * Generate monthly invoice
   * @param {string} hostId - Host ID
   * @returns {Promise} Generated invoice
   */
  generateInvoice: async (hostId) => {
    try {
      const response = await apiHelper.post(`/v1/invoices/generate/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get invoice by ID
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise} Invoice details
   */
  getInvoiceById: async (invoiceId) => {
    try {
      const response = await apiHelper.get(`/v1/invoices/${invoiceId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get invoice by invoice number
   * @param {string} invoiceNumber - Invoice number
   * @returns {Promise} Invoice details
   */
  getInvoiceByNumber: async (invoiceNumber) => {
    try {
      const response = await apiHelper.get(`/v1/invoices/number/${invoiceNumber}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Filter invoices
   * @param {object} filters - Filter criteria (status, hostId, dateRange, etc.)
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise} List of filtered invoices
   */
  filterInvoices: async (filters = {}, page = 0, size = 10) => {
    try {
      const params = new URLSearchParams();
      
      // Add pagination
      params.append('page', page.toString());
      params.append('size', size.toString());
      
      // Add filters
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.hostId) {
        params.append('hostId', filters.hostId);
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      
      const response = await apiHelper.get(`/v1/invoices/filter?${params.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get host invoices
   * @param {string} hostId - Host ID
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise} List of invoices
   */
  getHostInvoices: async (hostId, page = 0, size = 10) => {
    try {
      const response = await apiHelper.get(`/v1/invoices/host/${hostId}?page=${page}&size=${size}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download invoice PDF
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise} PDF file
   */
  downloadPDF: async (invoiceId) => {
    try {
      const response = await apiHelper.get(`/v1/invoices/${invoiceId}/pdf`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generate PDF
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise}
   */
  generatePDF: async (invoiceId) => {
    try {
      const response = await apiHelper.post(`/v1/invoices/${invoiceId}/generate-pdf`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Regenerate PDF
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise}
   */
  regeneratePDF: async (invoiceId) => {
    try {
      const response = await apiHelper.post(`/v1/invoices/${invoiceId}/regenerate-pdf`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send invoice via email
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise}
   */
  sendEmail: async (invoiceId) => {
    try {
      const response = await apiHelper.post(`/v1/invoices/${invoiceId}/send-email`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get unpaid invoices for host
   * @param {string} hostId - Host ID
   * @returns {Promise} List of unpaid invoices
   */
  getUnpaidInvoices: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/invoices/unpaid/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get overdue invoices (SUPERADMIN only)
   * @returns {Promise} List of overdue invoices
   */
  getOverdueInvoices: async () => {
    try {
      const response = await apiHelper.get('/v1/invoices/overdue');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get total revenue (SUPERADMIN only)
   * @returns {Promise} Total revenue
   */
  getTotalRevenue: async () => {
    try {
      const response = await apiHelper.get('/v1/invoices/revenue/total');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get host revenue
   * @param {string} hostId - Host ID
   * @returns {Promise} Host revenue
   */
  getHostRevenue: async (hostId) => {
    try {
      const response = await apiHelper.get(`/v1/invoices/revenue/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default invoiceService;
