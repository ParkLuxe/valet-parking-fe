/**
 * Redux Barrel Export
 * Central export for Redux store and types
 * Note: Slice actions with naming conflicts are renamed (e.g., setLoading -> setAuthLoading)
 * For full access to all actions, import directly from specific slices
 */

export { default as store } from './store';
export type { RootState, AppDispatch } from './store';

// Re-export slice reducers for convenience
export { default as authReducer } from './slices/authSlice';
export { default as uiReducer } from './slices/uiSlice';
export { default as notificationReducer } from './slices/notificationSlice';
export { default as analyticsReducer } from './slices/analyticsSlice';
export { default as invoiceReducer } from './slices/invoiceSlice';
export { default as parkingSlotReducer } from './slices/parkingSlotSlice';
export { default as paymentReducer } from './slices/paymentSlice';
export { default as subscriptionReducer } from './slices/subscriptionSlice';
export { default as valetReducer } from './slices/valetSlice';
export { default as vehicleReducer } from './slices/vehicleSlice';

// Re-export specific commonly-used actions from authSlice
export {
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  updateToken,
  clearError as clearAuthError,
  setLoading as setAuthLoading,
} from './slices/authSlice';

// Re-export actions from uiSlice
export {
  setSidebarOpen,
  toggleSidebar,
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
} from './slices/uiSlice';

// Re-export actions from notificationSlice
export {
  addToast,
  removeToast,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  setNotifications,
} from './slices/notificationSlice';

// Re-export actions from analyticsSlice
export {
  setMetrics,
  updateMetric,
  setValetPerformance,
  setRecentActivity,
  addActivity,
  setHostMetrics,
  resetAnalytics,
  setError as setAnalyticsError,
  clearError as clearAnalyticsError,
  setLoading as setAnalyticsLoading,
} from './slices/analyticsSlice';
