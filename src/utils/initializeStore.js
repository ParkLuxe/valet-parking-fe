/**
 * Initialize Redux store with dummy data for development
 * This helps demonstrate the app functionality without a backend
 */

import { setSlots } from '../redux/slices/parkingSlotSlice';
import { setValetList, setActiveValets } from '../redux/slices/valetSlice';

export const initializeStore = (dispatch) => {
  // Initialize parking slots
  const dummySlots = [
    { id: '1', name: 'A-101', isAvailable: true },
    { id: '2', name: 'A-102', isAvailable: true },
    { id: '3', name: 'A-103', isAvailable: false },
    { id: '4', name: 'B-201', isAvailable: true },
    { id: '5', name: 'B-202', isAvailable: true },
  ];
  dispatch(setSlots(dummySlots));

  // Initialize valets
  const dummyValets = [
    {
      id: 'v1',
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      phone: '+919876543210',
      role: 'valet',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'v2',
      name: 'Amit Sharma',
      email: 'amit@example.com',
      phone: '+919876543211',
      role: 'valet',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'v3',
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+919876543212',
      role: 'valet_head',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];
  dispatch(setValetList(dummyValets));
  dispatch(setActiveValets(dummyValets.filter(v => v.isActive)));
};
