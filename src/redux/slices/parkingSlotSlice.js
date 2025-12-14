/**
 * Redux slice for parking slot state management
 * Manages parking slots and their availability
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  slots: [],
  availableSlots: [],
  loading: false,
  error: null,
};

const parkingSlotSlice = createSlice({
  name: 'parkingSlots',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set all parking slots
    setSlots: (state, action) => {
      state.slots = action.payload;
      state.availableSlots = action.payload.filter(slot => slot.isAvailable);
      state.loading = false;
    },
    
    // Add new parking slot
    addSlot: (state, action) => {
      state.slots.push(action.payload);
      if (action.payload.isAvailable) {
        state.availableSlots.push(action.payload);
      }
    },
    
    // Update slot availability
    updateSlotAvailability: (state, action) => {
      const { slotId, isAvailable } = action.payload;
      const slot = state.slots.find(s => s.id === slotId);
      if (slot) {
        slot.isAvailable = isAvailable;
        
        // Update available slots list
        if (isAvailable) {
          if (!state.availableSlots.find(s => s.id === slotId)) {
            state.availableSlots.push(slot);
          }
        } else {
          state.availableSlots = state.availableSlots.filter(s => s.id !== slotId);
        }
      }
    },
    
    // Update slot details
    updateSlot: (state, action) => {
      const updatedSlot = action.payload;
      const index = state.slots.findIndex(s => s.id === updatedSlot.id);
      if (index !== -1) {
        state.slots[index] = { ...state.slots[index], ...updatedSlot };
      }
    },
    
    // Delete slot
    deleteSlot: (state, action) => {
      const slotId = action.payload;
      state.slots = state.slots.filter(s => s.id !== slotId);
      state.availableSlots = state.availableSlots.filter(s => s.id !== slotId);
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
  setSlots,
  addSlot,
  updateSlotAvailability,
  updateSlot,
  deleteSlot,
  setError,
  clearError,
} = parkingSlotSlice.actions;

export default parkingSlotSlice.reducer;
