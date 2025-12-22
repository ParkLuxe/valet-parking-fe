/**
 * Invoice Redux Slice
 * Manages invoice state
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoices: [],
  currentInvoice: null,
  unpaidInvoices: [],
  overdueInvoices: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  },
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Set invoices
    setInvoices: (state, action) => {
      state.invoices = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set invoices with pagination
    setInvoicesWithPagination: (state, action) => {
      const { content, totalPages, totalElements, number, size } = action.payload;
      state.invoices = content || action.payload;
      state.pagination = {
        currentPage: number || 0,
        pageSize: size || 10,
        totalPages: totalPages || 0,
        totalElements: totalElements || 0,
      };
      state.loading = false;
      state.error = null;
    },

    // Set current invoice
    setCurrentInvoice: (state, action) => {
      state.currentInvoice = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Add new invoice
    addInvoice: (state, action) => {
      state.invoices.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },

    // Update invoice
    updateInvoice: (state, action) => {
      const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
      if (index !== -1) {
        state.invoices[index] = { ...state.invoices[index], ...action.payload };
      }
      if (state.currentInvoice?.id === action.payload.id) {
        state.currentInvoice = { ...state.currentInvoice, ...action.payload };
      }
      state.loading = false;
      state.error = null;
    },

    // Set unpaid invoices
    setUnpaidInvoices: (state, action) => {
      state.unpaidInvoices = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set overdue invoices
    setOverdueInvoices: (state, action) => {
      state.overdueInvoices = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Clear current invoice
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },

    // Clear all invoices
    clearInvoices: (state) => {
      state.invoices = [];
      state.currentInvoice = null;
      state.unpaidInvoices = [];
      state.overdueInvoices = [];
      state.error = null;
    },

    // Reset state
    resetInvoiceState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setInvoices,
  setInvoicesWithPagination,
  setCurrentInvoice,
  addInvoice,
  updateInvoice,
  setUnpaidInvoices,
  setOverdueInvoices,
  clearCurrentInvoice,
  clearInvoices,
  resetInvoiceState,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
