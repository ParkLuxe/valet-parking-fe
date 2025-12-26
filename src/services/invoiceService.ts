/**
 * Invoice Service
 * Handles invoice management operations
 */

import { apiHelper } from './api';
import type { Invoice, PaginatedResponse, InvoiceFilters } from '../types/api';

const invoiceService = {
  /**
   * Generate monthly invoice
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
   */
  filterInvoices: async (
    filters: InvoiceFilters = {}, 
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
   */
  generatePDF: async (invoiceId: string): Promise<void> => {
    try {
      const response = await apiHelper.post<void>(`/v1/invoices/${invoiceId}/generate-pdf`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Regenerate PDF
   */
  regeneratePDF: async (invoiceId: string): Promise<void> => {
    try {
      const response = await apiHelper.post<void>(`/v1/invoices/${invoiceId}/regenerate-pdf`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send invoice via email
   */
  sendEmail: async (invoiceId: string): Promise<void> => {
    try {
      const response = await apiHelper.post<void>(`/v1/invoices/${invoiceId}/send-email`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get unpaid invoices for host
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
