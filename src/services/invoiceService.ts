/**
 * Invoice Service
 * Handles invoice management operations
 */

import { apiHelper } from './api';
import type { Invoice, PaginatedResponse, InvoiceFilterParams } from '../types/api';

const invoiceService = {
  /**
   * Generate monthly invoice
   * @param hostId - Host ID
   * @returns Generated invoice
   */
  generateInvoice: async (hostId: string): Promise<Invoice> => {
    try {
      const response = await apiHelper.post<Invoice>(`/v1/invoices/generate/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get invoice by ID
   * @param invoiceId - Invoice ID
   * @returns Invoice details
   */
  getInvoiceById: async (invoiceId: string): Promise<Invoice> => {
    try {
      const response = await apiHelper.get<Invoice>(`/v1/invoices/${invoiceId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get invoice by invoice number
   * @param invoiceNumber - Invoice number
   * @returns Invoice details
   */
  getInvoiceByNumber: async (invoiceNumber: string): Promise<Invoice> => {
    try {
      const response = await apiHelper.get<Invoice>(`/v1/invoices/number/${invoiceNumber}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Filter invoices
   * @param filters - Filter criteria (status, hostId, dateRange, etc.)
   * @param page - Page number
   * @param size - Page size
   * @returns List of filtered invoices
   */
  filterInvoices: async (
    filters: InvoiceFilterParams = {},
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Invoice>> => {
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
      
      const response = await apiHelper.get<PaginatedResponse<Invoice>>(
        `/v1/invoices/filter?${params.toString()}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get host invoices
   * @param hostId - Host ID
   * @param page - Page number
   * @param size - Page size
   * @returns List of invoices
   */
  getHostInvoices: async (
    hostId: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Invoice>> => {
    try {
      const response = await apiHelper.get<PaginatedResponse<Invoice>>(
        `/v1/invoices/host/${hostId}?page=${page}&size=${size}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download invoice PDF
   * @param invoiceId - Invoice ID
   * @returns PDF file
   */
  downloadPDF: async (invoiceId: string): Promise<Blob> => {
    try {
      const response = await apiHelper.get<Blob>(`/v1/invoices/${invoiceId}/pdf`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generate PDF
   * @param invoiceId - Invoice ID
   * @returns
   */
  generatePDF: async (invoiceId: string): Promise<any> => {
    try {
      const response = await apiHelper.post(`/v1/invoices/${invoiceId}/generate-pdf`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Regenerate PDF
   * @param invoiceId - Invoice ID
   * @returns
   */
  regeneratePDF: async (invoiceId: string): Promise<any> => {
    try {
      const response = await apiHelper.post(`/v1/invoices/${invoiceId}/regenerate-pdf`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send invoice via email
   * @param invoiceId - Invoice ID
   * @returns
   */
  sendEmail: async (invoiceId: string): Promise<any> => {
    try {
      const response = await apiHelper.post(`/v1/invoices/${invoiceId}/send-email`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get unpaid invoices for host
   * @param hostId - Host ID
   * @returns List of unpaid invoices
   */
  getUnpaidInvoices: async (hostId: string): Promise<Invoice[]> => {
    try {
      const response = await apiHelper.get<Invoice[]>(`/v1/invoices/unpaid/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get overdue invoices (SUPERADMIN only)
   * @returns List of overdue invoices
   */
  getOverdueInvoices: async (): Promise<Invoice[]> => {
    try {
      const response = await apiHelper.get<Invoice[]>('/v1/invoices/overdue');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get total revenue (SUPERADMIN only)
   * @returns Total revenue
   */
  getTotalRevenue: async (): Promise<number> => {
    try {
      const response = await apiHelper.get<number>('/v1/invoices/revenue/total');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get host revenue
   * @param hostId - Host ID
   * @returns Host revenue
   */
  getHostRevenue: async (hostId: string): Promise<number> => {
    try {
      const response = await apiHelper.get<number>(`/v1/invoices/revenue/${hostId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default invoiceService;
