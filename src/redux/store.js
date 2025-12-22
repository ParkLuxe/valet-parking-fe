/**
 * Redux store configuration
 * Combines all slices and configures the Redux store
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vehicleReducer from './slices/vehicleSlice';
import valetReducer from './slices/valetSlice';
import parkingSlotReducer from './slices/parkingSlotSlice';
import analyticsReducer from './slices/analyticsSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';
import invoiceReducer from './slices/invoiceSlice';
import paymentReducer from './slices/paymentSlice';

// Configure Redux store with all reducers
const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehicleReducer,
    valets: valetReducer,
    parkingSlots: parkingSlotReducer,
    analytics: analyticsReducer,
    subscription: subscriptionReducer,
    notifications: notificationReducer,
    ui: uiReducer,
    invoices: invoiceReducer,
    payments: paymentReducer,
  },
  // Middleware configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['notifications/addNotification', 'notifications/addToast'],
        // Ignore these paths in the state
        ignoredPaths: ['notifications.toastQueue'],
      },
    }),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
