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

// Analytics slice - export specific actions (still used in Dashboard.tsx)
export { 
  setMetrics,
} from './analyticsSlice';

// Invoice slice - export specific actions (still used in RazorpayButton.tsx)
export {
  updateInvoice,
} from './invoiceSlice';

// Payment slice - export specific actions (still used in Subscription.tsx and RazorpayButton.tsx)
export {
  addPayment,
} from './paymentSlice';

// Vehicle slice - export specific actions (still used in QRScanPage.tsx)
export {
  addVehicle,
} from './vehicleSlice';

// Subscription slice - export specific actions (still used in QRScanPage.tsx)
export {
  incrementScanCount,
} from './subscriptionSlice';
