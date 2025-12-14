/**
 * Redux slice for subscription state management
 * Manages subscription status, usage, and billing information
 */

import { createSlice } from '@reduxjs/toolkit';
import { SUBSCRIPTION } from '../../utils/constants';

const initialState = {
  status: 'active', // active, expired, grace_period
  usage: {
    usedScans: 0,
    totalScans: SUBSCRIPTION.BASE_SCANS,
    remainingScans: SUBSCRIPTION.BASE_SCANS,
  },
  billing: {
    currentAmount: SUBSCRIPTION.BASE_PRICE,
    basePrice: SUBSCRIPTION.BASE_PRICE,
    additionalCharges: 0,
    lastPaymentDate: null,
    nextBillingDate: null,
  },
  paymentHistory: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set subscription status
    setSubscriptionStatus: (state, action) => {
      state.status = action.payload;
    },
    
    // Update usage
    updateUsage: (state, action) => {
      const { usedScans, totalScans } = action.payload;
      state.usage.usedScans = usedScans;
      state.usage.totalScans = totalScans || state.usage.totalScans;
      state.usage.remainingScans = state.usage.totalScans - usedScans;
      
      // Calculate additional charges if exceeded base scans
      if (usedScans > SUBSCRIPTION.BASE_SCANS) {
        const additionalScans = usedScans - SUBSCRIPTION.BASE_SCANS;
        state.billing.additionalCharges = additionalScans * SUBSCRIPTION.ADDITIONAL_SCAN_PRICE;
        state.billing.currentAmount = state.billing.basePrice + state.billing.additionalCharges;
      } else {
        state.billing.additionalCharges = 0;
        state.billing.currentAmount = state.billing.basePrice;
      }
      
      // Update status if limit exceeded and not in grace period
      if (state.usage.remainingScans <= 0 && state.status === 'active') {
        state.status = 'grace_period';
      }
    },
    
    // Increment scan count
    incrementScanCount: (state) => {
      state.usage.usedScans += 1;
      state.usage.remainingScans = state.usage.totalScans - state.usage.usedScans;
      
      // Recalculate billing
      if (state.usage.usedScans > SUBSCRIPTION.BASE_SCANS) {
        const additionalScans = state.usage.usedScans - SUBSCRIPTION.BASE_SCANS;
        state.billing.additionalCharges = additionalScans * SUBSCRIPTION.ADDITIONAL_SCAN_PRICE;
        state.billing.currentAmount = state.billing.basePrice + state.billing.additionalCharges;
      }
    },
    
    // Set billing info
    setBillingInfo: (state, action) => {
      state.billing = { ...state.billing, ...action.payload };
    },
    
    // Add payment to history
    addPayment: (state, action) => {
      state.paymentHistory.unshift(action.payload);
      
      // Reset usage after payment
      state.usage.usedScans = 0;
      state.usage.totalScans = SUBSCRIPTION.BASE_SCANS;
      state.usage.remainingScans = SUBSCRIPTION.BASE_SCANS;
      state.billing.additionalCharges = 0;
      state.billing.currentAmount = state.billing.basePrice;
      state.status = 'active';
      state.billing.lastPaymentDate = action.payload.date;
    },
    
    // Set payment history
    setPaymentHistory: (state, action) => {
      state.paymentHistory = action.payload;
    },
    
    // Set complete subscription data
    setSubscriptionData: (state, action) => {
      const { status, usage, billing, paymentHistory } = action.payload;
      if (status) state.status = status;
      if (usage) state.usage = { ...state.usage, ...usage };
      if (billing) state.billing = { ...state.billing, ...billing };
      if (paymentHistory) state.paymentHistory = paymentHistory;
      state.loading = false;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setSubscriptionStatus,
  updateUsage,
  incrementScanCount,
  setBillingInfo,
  addPayment,
  setPaymentHistory,
  setSubscriptionData,
  setError,
  clearError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
