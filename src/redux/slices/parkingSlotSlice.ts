/**
 * Redux slice for parking slot state management
 * Manages parking slots and their availability
 */

import { createSlice } from '@reduxjs/toolkit';

// Mock parking slots data with fixed timestamps for consistency
const mockSlots = [
  { id: 'P001', slotNumber: 'A1', floor: 1, status: 'available', isAvailable: true, name: 'A1' },
  { id: 'P002', slotNumber: 'A2', floor: 1, status: 'occupied', isAvailable: false, name: 'A2', vehicleNumber: 'MH12AB1234', valetName: 'John Doe', parkedAt: '2025-12-14T18:00:00.000Z' },
  { id: 'P003', slotNumber: 'A3', floor: 1, status: 'occupied', isAvailable: false, name: 'A3', vehicleNumber: 'MH14XY5678', valetName: 'Mike Smith', parkedAt: '2025-12-14T15:00:00.000Z' },
  { id: 'P004', slotNumber: 'A4', floor: 1, status: 'reserved', isAvailable: false, name: 'A4' },
  { id: 'P005', slotNumber: 'A5', floor: 1, status: 'available', isAvailable: true, name: 'A5' },
  { id: 'P006', slotNumber: 'B1', floor: 1, status: 'available', isAvailable: true, name: 'B1' },
  { id: 'P007', slotNumber: 'B2', floor: 1, status: 'occupied', isAvailable: false, name: 'B2', vehicleNumber: 'MH01CD9012', valetName: 'Sara Wilson', parkedAt: '2025-12-14T11:00:00.000Z' },
  { id: 'P008', slotNumber: 'B3', floor: 1, status: 'available', isAvailable: true, name: 'B3' },
  { id: 'P009', slotNumber: 'B4', floor: 1, status: 'reserved', isAvailable: false, name: 'B4' },
  { id: 'P010', slotNumber: 'B5', floor: 1, status: 'available', isAvailable: true, name: 'B5' },
  { id: 'P011', slotNumber: 'C1', floor: 1, status: 'occupied', isAvailable: false, name: 'C1', vehicleNumber: 'MH05EF3456', valetName: 'John Doe', parkedAt: '2025-12-14T17:30:00.000Z' },
  { id: 'P012', slotNumber: 'C2', floor: 1, status: 'available', isAvailable: true, name: 'C2' },
  { id: 'P013', slotNumber: 'C3', floor: 1, status: 'available', isAvailable: true, name: 'C3' },
  { id: 'P014', slotNumber: 'C4', floor: 1, status: 'occupied', isAvailable: false, name: 'C4', vehicleNumber: 'MH09GH7890', valetName: 'Mike Smith', parkedAt: '2025-12-14T13:30:00.000Z' },
  { id: 'P015', slotNumber: 'C5', floor: 1, status: 'available', isAvailable: true, name: 'C5' },
  // Floor 2
  { id: 'P016', slotNumber: 'D1', floor: 2, status: 'available', isAvailable: true, name: 'D1' },
  { id: 'P017', slotNumber: 'D2', floor: 2, status: 'available', isAvailable: true, name: 'D2' },
  { id: 'P018', slotNumber: 'D3', floor: 2, status: 'occupied', isAvailable: false, name: 'D3', vehicleNumber: 'MH11IJ2345', valetName: 'Sara Wilson', parkedAt: '2025-12-14T18:45:00.000Z' },
  { id: 'P019', slotNumber: 'D4', floor: 2, status: 'available', isAvailable: true, name: 'D4' },
  { id: 'P020', slotNumber: 'D5', floor: 2, status: 'reserved', isAvailable: false, name: 'D5' },
];

const initialState = {
  slots: mockSlots,
  availableSlots: mockSlots.filter(slot => slot.isAvailable),
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
    
    // Update slot status (for parking operations)
    updateSlotStatus: (state, action) => {
      const { slotId, status, vehicleNumber, valetName } = action.payload;
      const slot = state.slots.find(s => s.id === slotId);
      if (slot) {
        slot.status = status;
        if (status === 'occupied') {
          slot.vehicleNumber = vehicleNumber;
          slot.valetName = valetName;
          slot.parkedAt = new Date().toISOString();
          slot.isAvailable = false;
        } else if (status === 'available') {
          slot.vehicleNumber = null;
          slot.valetName = null;
          slot.parkedAt = null;
          slot.isAvailable = true;
        } else if (status === 'reserved') {
          slot.isAvailable = false;
        }
        // Update available slots list
        state.availableSlots = state.slots.filter(s => s.isAvailable);
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
  updateSlotStatus,
  updateSlot,
  deleteSlot,
  setError,
  clearError,
} = parkingSlotSlice.actions;

export default parkingSlotSlice.reducer;
