/**
 * Redux slice for analytics state management
 * Manages metrics, performance data, and analytics information
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metrics: {
    activeValets: 0,
    carsParked: 0,
    avgParkingTime: 0,
    avgDeliveryTime: 0,
    totalRevenue: 0,
    totalScans: 0,
  },
  valetPerformance: [],
  recentActivity: [],
  hostMetrics: [], // For super admin
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set metrics
    setMetrics: (state, action) => {
      state.metrics = { ...state.metrics, ...action.payload };
      state.loading = false;
    },
    
    // Update single metric
    updateMetric: (state, action) => {
      const { key, value } = action.payload;
      state.metrics[key] = value;
    },
    
    // Set valet performance data
    setValetPerformance: (state, action) => {
      state.valetPerformance = action.payload;
    },
    
    // Set recent activity
    setRecentActivity: (state, action) => {
      state.recentActivity = action.payload;
    },
    
    // Add new activity
    addActivity: (state, action) => {
      state.recentActivity.unshift(action.payload);
      // Keep only last 50 activities
      if (state.recentActivity.length > 50) {
        state.recentActivity = state.recentActivity.slice(0, 50);
      }
    },
    
    // Set host metrics (for super admin)
    setHostMetrics: (state, action) => {
      state.hostMetrics = action.payload;
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
    
    // Reset analytics
    resetAnalytics: (state) => {
      state.metrics = {
        activeValets: 0,
        carsParked: 0,
        avgParkingTime: 0,
        avgDeliveryTime: 0,
        totalRevenue: 0,
        totalScans: 0,
      };
      state.valetPerformance = [];
      state.recentActivity = [];
      state.hostMetrics = [];
    },
  },
});

export const {
  setLoading,
  setMetrics,
  updateMetric,
  setValetPerformance,
  setRecentActivity,
  addActivity,
  setHostMetrics,
  setError,
  clearError,
  resetAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
