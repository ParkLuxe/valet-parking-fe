/**
 * Invoice Service - Lightweight wrapper around apiHelper
 * For new code, prefer using TanStack Query hooks from ../api/invoices
 */

import { apiHelper } from './api';

const invoiceService = {
  generateInvoice: async (hostId: string) => {
    const response = await apiHelper.post(`/v1/invoices/generate/${hostId}`);
    return response;
  },

  getInvoiceById: async (invoiceId: string) => {
    const response = await apiHelper.get(`/v1/invoices/${invoiceId}`);
    return response;
  },

  getInvoiceByNumber: async (invoiceNumber: string) => {
    const response = await apiHelper.get(`/v1/invoices/number/${invoiceNumber}`);
    return response;
  },

  filterInvoices: async (filters: any = {}, page: number = 0, size: number = 10) => {
    const response = await apiHelper.post('/v1/invoices/filter-spec', { ...filters, page, size });
    return response;
  },

  getHostInvoices: async (hostId: string, page: number = 0, size: number = 10) => {
    const response = await apiHelper.get(`/v1/invoices/host/${hostId}?page=${page}&size=${size}`);
    return response;
  },

  downloadPDF: async (invoiceId: string) => {
    const response = await apiHelper.get(`/v1/invoices/${invoiceId}/pdf`, {
      responseType: 'blob',
    });
    return response;
  },

  generatePDF: async (invoiceId: string) => {
    const response = await apiHelper.post(`/v1/invoices/${invoiceId}/generate-pdf`);
    return response;
  },

  getUnpaidInvoices: async (hostId: string) => {
    const response = await apiHelper.get(`/v1/invoices/unpaid/${hostId}`);
    return response;
  },

  getOverdueInvoices: async () => {
    const response = await apiHelper.get('/v1/invoices/overdue');
    return response;
  },

  getTotalRevenue: async () => {
    const response = await apiHelper.get('/v1/invoices/revenue/total');
    return response;
  },

  getHostRevenue: async (hostId: string) => {
    const response = await apiHelper.get(`/v1/invoices/revenue/${hostId}`);
    return response;
  },

  sendEmail: async (invoiceId: string) => {
    // Backend doesn't have this endpoint in the spec yet
    throw new Error('Send email endpoint not yet implemented in backend');
  },
};

export default invoiceService;
