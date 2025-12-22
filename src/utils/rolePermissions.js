/**
 * Role-Based Permissions Configuration
 * Defines what each role can do in the application
 */

import { USER_ROLES } from './constants';

// Permission definitions
export const PERMISSIONS = {
  [USER_ROLES.SUPERADMIN]: {
    // Full system access
    canViewAllHosts: true,
    canManageSubscriptionPlans: true,
    canViewAllInvoices: true,
    canViewRevenue: true,
    canPerformanceComparison: true,
    canManageCountryState: true,
    canViewOverdueInvoices: true,
    canManagePlans: true,
    
    // Host management
    canManageHosts: true,
    canViewHostDetails: true,
    
    // User management
    canManageUsers: true,
    canViewUsers: true,
    
    // Vehicle operations
    canManageVehicles: true,
    canViewVehicles: true,
    canScanQR: true,
    canUpdateVehicleStatus: true,
    
    // QR Code management
    canManageQR: true,
    canGenerateQR: true,
    canExportQR: true,
    canLinkQRToSlot: true,
    
    // Analytics
    canViewAnalytics: true,
    canViewDetailedAnalytics: true,
    canComparePerformance: true,
    
    // Subscription & Billing
    canManageSubscription: true,
    canViewInvoices: true,
    canMakePayments: true,
    canViewPaymentHistory: true,
    
    // Schedules
    canManageSchedules: true,
    
    // Parking slots
    canManageParkingSlots: true,
  },
  
  [USER_ROLES.HOSTADMIN]: {
    // Host-level admin access
    canViewAllHosts: false,
    canManageSubscriptionPlans: false,
    canViewAllInvoices: false,
    canViewRevenue: false,
    canPerformanceComparison: false,
    canManageCountryState: false,
    canViewOverdueInvoices: false,
    canManagePlans: false,
    
    // Host management
    canManageHosts: false,
    canViewHostDetails: true,
    
    // User management (for their host)
    canManageUsers: true,
    canViewUsers: true,
    canCreateHostUsers: true,
    canEditHostUsers: true,
    
    // Vehicle operations
    canManageVehicles: true,
    canViewVehicles: true,
    canScanQR: true,
    canUpdateVehicleStatus: true,
    canAssignValet: true,
    canRequestRetrieval: true,
    
    // QR Code management
    canManageQR: true,
    canGenerateQR: true,
    canExportQR: true,
    canLinkQRToSlot: true,
    canDeactivateQR: true,
    
    // Analytics
    canViewAnalytics: true,
    canViewDetailedAnalytics: true,
    canComparePerformance: false,
    canViewValetPerformance: true,
    
    // Subscription & Billing
    canManageSubscription: true,
    canViewInvoices: true,
    canMakePayments: true,
    canViewPaymentHistory: true,
    canChangeSubscriptionPlan: true,
    
    // Schedules
    canManageSchedules: true,
    canCreateSchedules: true,
    canEditSchedules: true,
    canDeleteSchedules: true,
    
    // Parking slots
    canManageParkingSlots: true,
    canCreateParkingSlots: true,
  },
  
  [USER_ROLES.HOSTUSER]: {
    // Valet-level access (limited)
    canViewAllHosts: false,
    canManageSubscriptionPlans: false,
    canViewAllInvoices: false,
    canViewRevenue: false,
    canPerformanceComparison: false,
    canManageCountryState: false,
    canViewOverdueInvoices: false,
    canManagePlans: false,
    
    // Host management
    canManageHosts: false,
    canViewHostDetails: false,
    
    // User management
    canManageUsers: false,
    canViewUsers: false,
    canViewOwnProfile: true,
    canChangeOwnPassword: true,
    
    // Vehicle operations (limited to assigned)
    canManageVehicles: false,
    canViewVehicles: true,
    canViewAssignedVehicles: true,
    canScanQR: true,
    canUpdateVehicleStatus: true,
    canAcceptRequests: true,
    canCompleteDelivery: true,
    
    // QR Code management (view only)
    canManageQR: false,
    canGenerateQR: false,
    canExportQR: false,
    canLinkQRToSlot: false,
    canViewQR: true,
    canScanQRCode: true,
    
    // Analytics (limited)
    canViewAnalytics: false,
    canViewDetailedAnalytics: false,
    canComparePerformance: false,
    canViewOwnPerformance: true,
    
    // Subscription & Billing (view only)
    canManageSubscription: false,
    canViewInvoices: true,
    canMakePayments: false,
    canViewPaymentHistory: false,
    
    // Schedules (view only)
    canManageSchedules: false,
    canViewSchedules: true,
    
    // Parking slots (view only)
    canManageParkingSlots: false,
    canViewParkingSlots: true,
  },
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if role has permission
 */
export const hasPermission = (role, permission) => {
  // Normalize role
  const normalizedRole = role?.toUpperCase();
  
  // Check if role exists
  if (!PERMISSIONS[normalizedRole]) {
    console.warn(`Unknown role: ${role}`);
    return false;
  }
  
  // Check permission
  return PERMISSIONS[normalizedRole][permission] === true;
};

/**
 * Check if a role has any of the specified permissions
 * @param {string} role - User role
 * @param {Array<string>} permissions - Array of permissions to check
 * @returns {boolean} - True if role has any of the permissions
 */
export const hasAnyPermission = (role, permissions) => {
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a role has all of the specified permissions
 * @param {string} role - User role
 * @param {Array<string>} permissions - Array of permissions to check
 * @returns {boolean} - True if role has all of the permissions
 */
export const hasAllPermissions = (role, permissions) => {
  return permissions.every(permission => hasPermission(role, permission));
};

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {object} - Object containing all permissions for the role
 */
export const getRolePermissions = (role) => {
  const normalizedRole = role?.toUpperCase();
  return PERMISSIONS[normalizedRole] || {};
};

/**
 * Check if user can access a specific route/page
 * @param {string} role - User role
 * @param {string} page - Page identifier
 * @returns {boolean} - True if user can access the page
 */
export const canAccessPage = (role, page) => {
  const pagePermissions = {
    dashboard: ['canViewVehicles', 'canViewAnalytics'],
    analytics: ['canViewAnalytics'],
    invoices: ['canViewInvoices'],
    payments: ['canMakePayments', 'canViewPaymentHistory'],
    subscriptionPlans: ['canManageSubscriptionPlans', 'canManageSubscription'],
    qrManagement: ['canManageQR', 'canScanQR'],
    hostSchedules: ['canManageSchedules', 'canViewSchedules'],
    hostUsers: ['canManageUsers', 'canViewUsers'],
    parkingSlots: ['canManageParkingSlots', 'canViewParkingSlots'],
    profile: ['canViewOwnProfile'],
    vehicles: ['canManageVehicles', 'canViewVehicles', 'canViewAssignedVehicles'],
  };
  
  const requiredPermissions = pagePermissions[page];
  if (!requiredPermissions) {
    return true; // Allow access if no specific permissions defined
  }
  
  return hasAnyPermission(role, requiredPermissions);
};

const rolePermissionsHelper = {
  PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canAccessPage,
};

export default rolePermissionsHelper;
