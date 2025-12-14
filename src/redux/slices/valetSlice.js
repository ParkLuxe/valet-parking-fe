/**
 * Redux slice for valet state management
 * Manages valet list, active valets, and valet performance data
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  valetList: [],
  activeValets: [],
  valetPerformance: {},
  loading: false,
  error: null,
};

const valetSlice = createSlice({
  name: 'valets',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set valet list
    setValetList: (state, action) => {
      state.valetList = action.payload;
      state.loading = false;
    },
    
    // Set active valets
    setActiveValets: (state, action) => {
      state.activeValets = action.payload;
    },
    
    // Add new valet
    addValet: (state, action) => {
      state.valetList.push(action.payload);
    },
    
    // Update valet
    updateValet: (state, action) => {
      const updatedValet = action.payload;
      const index = state.valetList.findIndex(v => v.id === updatedValet.id);
      if (index !== -1) {
        state.valetList[index] = { ...state.valetList[index], ...updatedValet };
      }
    },
    
    // Delete valet
    deleteValet: (state, action) => {
      const valetId = action.payload;
      state.valetList = state.valetList.filter(v => v.id !== valetId);
    },
    
    // Update valet status (active/inactive)
    updateValetStatus: (state, action) => {
      const { valetId, isActive } = action.payload;
      const valet = state.valetList.find(v => v.id === valetId);
      if (valet) {
        valet.isActive = isActive;
      }
      
      // Update active valets list
      if (isActive) {
        if (!state.activeValets.find(v => v.id === valetId)) {
          state.activeValets.push(valet);
        }
      } else {
        state.activeValets = state.activeValets.filter(v => v.id !== valetId);
      }
    },
    
    // Set valet performance data
    setValetPerformance: (state, action) => {
      state.valetPerformance = action.payload;
    },
    
    // Update single valet performance
    updateValetPerformance: (state, action) => {
      const { valetId, performance } = action.payload;
      state.valetPerformance[valetId] = performance;
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
  setValetList,
  setActiveValets,
  addValet,
  updateValet,
  deleteValet,
  updateValetStatus,
  setValetPerformance,
  updateValetPerformance,
  setError,
  clearError,
} = valetSlice.actions;

export default valetSlice.reducer;
