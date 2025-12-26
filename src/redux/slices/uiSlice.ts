/**
 * Redux slice for UI state management
 * Manages loading states, modals, errors, and other UI elements
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalName = 
  | 'addVehicle'
  | 'addValet'
  | 'addSlot'
  | 'payment'
  | 'confirmDelete'
  | 'vehicleDetails'
  | 'valetPerformance';

interface UIState {
  sidebarOpen: boolean;
  loading: {
    global: boolean;
    page: boolean;
  };
  modals: Record<ModalName, boolean>;
  errors: {
    global: string | null;
    page: string | null;
  };
  selectedItem: unknown | null;
}

const initialState: UIState = {
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
  selectedItem: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.page = action.payload;
    },
    
    openModal: (state, action: PayloadAction<{ modalName: ModalName; data?: unknown }>) => {
      const { modalName, data } = action.payload;
      if (modalName in state.modals) {
        state.modals[modalName] = true;
        if (data !== undefined) {
          state.selectedItem = data;
        }
      }
    },
    
    closeModal: (state, action: PayloadAction<ModalName>) => {
      const modalName = action.payload;
      if (modalName in state.modals) {
        state.modals[modalName] = false;
        state.selectedItem = null;
      }
    },
    
    closeAllModals: (state) => {
      (Object.keys(state.modals) as ModalName[]).forEach(key => {
        state.modals[key] = false;
      });
      state.selectedItem = null;
    },
    
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.errors.global = action.payload;
    },
    
    setPageError: (state, action: PayloadAction<string | null>) => {
      state.errors.page = action.payload;
    },
    
    clearGlobalError: (state) => {
      state.errors.global = null;
    },
    
    clearPageError: (state) => {
      state.errors.page = null;
    },
    
    clearAllErrors: (state) => {
      state.errors = {
        global: null,
        page: null,
      };
    },
    
    setSelectedItem: (state, action: PayloadAction<unknown>) => {
      state.selectedItem = action.payload;
    },
    
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
