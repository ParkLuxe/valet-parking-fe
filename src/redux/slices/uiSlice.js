/**
 * Redux slice for UI state management
 * Manages loading states, modals, errors, and other UI elements
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  loading: {
    global: false,
    page: false,
  },
  modals: {
    addVehicle: false,
    addValet: false,
    addSlot: false,
    payment: false,
    confirmDelete: false,
    vehicleDetails: false,
    valetPerformance: false,
  },
  errors: {
    global: null,
    page: null,
  },
  selectedItem: null, // For storing selected item (vehicle, valet, etc.) for modals
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toggle sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    // Set sidebar state
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Set global loading
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    // Set page loading
    setPageLoading: (state, action) => {
      state.loading.page = action.payload;
    },
    
    // Open modal
    openModal: (state, action) => {
      const { modalName, data } = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
        if (data) {
          state.selectedItem = data;
        }
      }
    },
    
    // Close modal
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
        state.selectedItem = null;
      }
    },
    
    // Close all modals
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
      state.selectedItem = null;
    },
    
    // Set global error
    setGlobalError: (state, action) => {
      state.errors.global = action.payload;
    },
    
    // Set page error
    setPageError: (state, action) => {
      state.errors.page = action.payload;
    },
    
    // Clear global error
    clearGlobalError: (state) => {
      state.errors.global = null;
    },
    
    // Clear page error
    clearPageError: (state) => {
      state.errors.page = null;
    },
    
    // Clear all errors
    clearAllErrors: (state) => {
      state.errors = {
        global: null,
        page: null,
      };
    },
    
    // Set selected item
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    
    // Clear selected item
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setGlobalLoading,
  setPageLoading,
  openModal,
  closeModal,
  closeAllModals,
  setGlobalError,
  setPageError,
  clearGlobalError,
  clearPageError,
  clearAllErrors,
  setSelectedItem,
  clearSelectedItem,
} = uiSlice.actions;

export default uiSlice.reducer;
