/**
 * Redux Slices Barrel Export
 * Central export for all Redux slices
 */

// Auth slice - export all
export { default as authReducer } from './authSlice';
export * from './authSlice';

// UI slice - export all
export { default as uiReducer } from './uiSlice';
export * from './uiSlice';

// Notification slice - export all
export { default as notificationReducer } from './notificationSlice';
export * from './notificationSlice';

// Analytics slice - export specific actions to avoid conflicts
export { 
  setMetrics,
  updateMetric,
  setValetPerformance,
  setRecentActivity,
  addActivity,
  setHostMetrics,
  resetAnalytics,
} from './analyticsSlice';

// Invoice slice - export specific actions
export {
  setInvoices,
  setInvoicesWithPagination,
  updateInvoice,
  setCurrentInvoice,
} from './invoiceSlice';

// Payment slice - export specific actions
export {
  addPayment,
} from './paymentSlice';

// Vehicle slice - export specific actions
export {
  addVehicle,
  updateVehicleStatus,
} from './vehicleSlice';

// Subscription slice - export specific actions
export {
  setSubscriptionData,
  setSubscriptionStatus,
  incrementScanCount,
  setBillingInfo,
  addPayment as addSubscriptionPayment,
} from './subscriptionSlice';
