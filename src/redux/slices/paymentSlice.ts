/**
 * Payment Redux Slice
 * Manages payment state
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  currentPayment: null,
  paymentStats: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  },
  // Razorpay specific
  razorpayOrder: null,
  paymentInProgress: false,
};

const paymentSlice = createSlice({
  name: 'payment',
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

    // Set payments
    setPayments: (state, action) => {
      state.payments = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set payments with pagination
    setPaymentsWithPagination: (state, action) => {
      const { content, totalPages, totalElements, number, size } = action.payload;
      state.payments = content || action.payload;
      state.pagination = {
        currentPage: number || 0,
        pageSize: size || 10,
        totalPages: totalPages || 0,
        totalElements: totalElements || 0,
      };
      state.loading = false;
      state.error = null;
    },

    // Set current payment
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Add new payment
    addPayment: (state, action) => {
      state.payments.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },

    // Update payment
    updatePayment: (state, action) => {
      const index = state.payments.findIndex(pay => pay.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = { ...state.payments[index], ...action.payload };
      }
      if (state.currentPayment?.id === action.payload.id) {
        state.currentPayment = { ...state.currentPayment, ...action.payload };
      }
      state.loading = false;
      state.error = null;
    },

    // Set payment stats
    setPaymentStats: (state, action) => {
      state.paymentStats = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Razorpay order management
    setRazorpayOrder: (state, action) => {
      state.razorpayOrder = action.payload;
      state.error = null;
    },

    clearRazorpayOrder: (state) => {
      state.razorpayOrder = null;
    },

    setPaymentInProgress: (state, action) => {
      state.paymentInProgress = action.payload;
    },

    // Clear current payment
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },

    // Clear all payments
    clearPayments: (state) => {
      state.payments = [];
      state.currentPayment = null;
      state.paymentStats = null;
      state.error = null;
    },

    // Reset state
    resetPaymentState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setPayments,
  setPaymentsWithPagination,
  setCurrentPayment,
  addPayment,
  updatePayment,
  setPaymentStats,
  setRazorpayOrder,
  clearRazorpayOrder,
  setPaymentInProgress,
  clearCurrentPayment,
  clearPayments,
  resetPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;
