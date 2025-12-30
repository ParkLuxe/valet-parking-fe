/**
 * Services Barrel Export
 * Central export for all service modules and API hooks
 */

// Legacy service wrappers (for backward compatibility)
// New code should use TanStack Query hooks from ../api/* or hooks/queries instead
export { default as invoiceService } from './invoiceService';
export { default as subscriptionPlanService } from './subscriptionPlanService';
export { default as hostService } from './hostService';

// Core services (kept)
export { default as websocketService } from './websocketService';
export { default as valetService } from './valetService';
export { apiHelper } from './api';

// Export all TanStack Query API hooks
export * from '../hooks/queries/useAuth';
export * from '../hooks/queries/useInvoices';
export * from '../hooks/queries/usePayments';
export * from '../hooks/queries/useSubscriptions';
export * from '../hooks/queries/useSubscriptionPlans';
export * from '../hooks/queries/useVehicles';
export * from '../hooks/queries/useVehicleRequests';
export * from '../hooks/queries/useQRCodes';
export * from '../hooks/queries/useAnalytics';
export * from '../hooks/queries/useHosts';
export * from '../hooks/queries/useHostUsers';
export * from '../hooks/queries/useHostSchedules';
export * from '../hooks/queries/useParkingSlots';
export * from '../hooks/queries/useCountries';

