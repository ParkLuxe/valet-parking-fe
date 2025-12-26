/**
 * Redux Barrel Export
 * Central export for Redux store and slices
 */

export { default as store } from './store';
export type { RootState, AppDispatch } from './store';

// Auth slice exports
export { 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateProfile, 
  updateToken, 
  clearError as clearAuthError,
  setLoading as setAuthLoading,
  setUserData
} from './slices/authSlice';

// UI slice exports
export { 
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
  clearSelectedItem 
} from './slices/uiSlice';

// Notification slice exports
export { 
  addNotification, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  clearAllNotifications, 
  addToast, 
  removeToast, 
  setNotifications 
} from './slices/notificationSlice';

// Analytics slice exports
export { 
  setMetrics,
  updateMetric,
  setValetPerformance,
  setRecentActivity,
  addActivity,
  setHostMetrics,
  resetAnalytics,
} from './slices/analyticsSlice';

// Invoice slice exports
export {
  setInvoices,
  setInvoicesWithPagination,
  updateInvoice,
  setCurrentInvoice,
} from './slices/invoiceSlice';

// Payment slice exports
export {
  addPayment,
} from './slices/paymentSlice';

// Vehicle slice exports
export {
  addVehicle,
  updateVehicleStatus,
} from './slices/vehicleSlice';

// Subscription slice exports
export {
  setSubscriptionData,
  setSubscriptionStatus,
  incrementScanCount,
  setBillingInfo,
  addPayment as addSubscriptionPayment,
} from './slices/subscriptionSlice';
