/**
 * Redux slice for parking slot state management
 * Manages parking slots and their availability
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  slots: [
    { id: 'P001', slotNumber: 'A1', floor: 1, status: 'available', isAvailable: true, name: 'A1' },
    { id: 'P002', slotNumber: 'A2', floor: 1, status: 'occupied', isAvailable: false, name: 'A2', vehicleNumber: 'MH12AB1234', valetName: 'John', parkedAt: '2025-12-14T10:30:00.000Z' },
    { id: 'P003', slotNumber: 'A3', floor: 1, status: 'reserved', isAvailable: false, name: 'A3' },
    { id: 'P004', slotNumber: 'A4', floor: 1, status: 'available', isAvailable: true, name: 'A4' },
    { id: 'P005', slotNumber: 'A5', floor: 1, status: 'occupied', isAvailable: false, name: 'A5', vehicleNumber: 'MH14XY5678', valetName: 'Mike', parkedAt: '2025-12-14T12:15:00.000Z' },
    { id: 'P006', slotNumber: 'B1', floor: 1, status: 'available', isAvailable: true, name: 'B1' },
    { id: 'P007', slotNumber: 'B2', floor: 1, status: 'available', isAvailable: true, name: 'B2' },
    { id: 'P008', slotNumber: 'B3', floor: 1, status: 'occupied', isAvailable: false, name: 'B3', vehicleNumber: 'MH01CD9012', valetName: 'Sara', parkedAt: '2025-12-14T14:45:00.000Z' },
    { id: 'P009', slotNumber: 'B4', floor: 1, status: 'reserved', isAvailable: false, name: 'B4' },
    { id: 'P010', slotNumber: 'B5', floor: 1, status: 'available', isAvailable: true, name: 'B5' },
    { id: 'P011', slotNumber: 'C1', floor: 2, status: 'available', isAvailable: true, name: 'C1' },
    { id: 'P012', slotNumber: 'C2', floor: 2, status: 'available', isAvailable: true, name: 'C2' },
  ],
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
