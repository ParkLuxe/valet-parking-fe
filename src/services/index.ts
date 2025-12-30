/**
 * Services Barrel Export
 * Central export for all service modules and API hooks
 */

// Legacy service wrappers (for backward compatibility)
// New code should use TanStack Query hooks from ../api/* instead
export { default as authService } from './authService';
export { default as invoiceService } from './invoiceService';
export { default as subscriptionPlanService } from './subscriptionPlanService';
export { default as hostService } from './hostService';

// Core services (kept)
export { default as websocketService } from './websocketService';
export { default as valetService } from './valetService';
export { apiHelper } from './api';

// Export all TanStack Query API hooks
export * from '../api/auth';
export * from '../api/invoices';
export * from '../api/payments';
export * from '../api/subscriptions';
export * from '../api/subscriptionPlans';
export * from '../api/vehicles';
export * from '../api/vehicleRequests';
export * from '../api/qrCodes';
export * from '../api/analytics';
export * from '../api/hosts';
export * from '../api/hostUsers';
export * from '../api/hostSchedules';
export * from '../api/parkingSlots';
export * from '../api/countries';

