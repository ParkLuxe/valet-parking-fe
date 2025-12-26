/**
 * Redux store configuration
 * Combines essential slices: auth, ui, and notifications
 * Data fetching is now handled by TanStack Query
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';

// Configure Redux store with essential reducers only
const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['notifications/addNotification', 'notifications/addToast'],
        ignoredPaths: ['notifications.toastQueue'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
