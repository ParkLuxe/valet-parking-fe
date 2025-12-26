/**
 * Redux slice for vehicle state management
 * Manages active vehicles, vehicle history, and vehicle operations
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeVehicles: [],
  vehicleHistory: [],
  currentVehicle: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    searchQuery: '',
  },
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set active vehicles
    setActiveVehicles: (state, action) => {
      state.activeVehicles = action.payload;
      state.loading = false;
    },
    
    // Set vehicle history
    setVehicleHistory: (state, action) => {
      state.vehicleHistory = action.payload;
      state.loading = false;
    },
    
    // Add new vehicle
    addVehicle: (state, action) => {
      state.activeVehicles.unshift(action.payload);
    },
    
    // Update vehicle status
    updateVehicleStatus: (state, action) => {
      const { vehicleId, status, updatedData } = action.payload;
      const vehicle = state.activeVehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        vehicle.status = status;
        if (updatedData) {
          Object.assign(vehicle, updatedData);
        }
      }
    },
    
    // Update vehicle details
    updateVehicle: (state, action) => {
      const updatedVehicle = action.payload;
      const index = state.activeVehicles.findIndex(v => v.id === updatedVehicle.id);
      if (index !== -1) {
        state.activeVehicles[index] = { ...state.activeVehicles[index], ...updatedVehicle };
      }
    },
    
    // Remove vehicle from active (when delivered)
    removeActiveVehicle: (state, action) => {
      const vehicleId = action.payload;
      const vehicle = state.activeVehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        // Move to history
        state.vehicleHistory.unshift(vehicle);
        // Remove from active
        state.activeVehicles = state.activeVehicles.filter(v => v.id !== vehicleId);
      }
    },
    
    // Set current vehicle (for details view)
    setCurrentVehicle: (state, action) => {
      state.currentVehicle = action.payload;
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
    
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        searchQuery: '',
      };
    },
  },
});

export const {
  setLoading,
  setActiveVehicles,
  setVehicleHistory,
  addVehicle,
  updateVehicleStatus,
  updateVehicle,
  removeActiveVehicle,
  setCurrentVehicle,
  setError,
  clearError,
  setFilters,
  clearFilters,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
