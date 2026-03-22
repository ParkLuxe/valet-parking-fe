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
    canCreateHost: true,
    canEditHost: true,
    canDeactivateHost: true,

    // User management (NO ACCESS to host users)
    canManageUsers: true,
    canViewUsers: true,

    // Vehicle operations (NO ACCESS)
    canManageVehicles: true,
    canViewVehicles: true,
    canScanQR: true,
    canUpdateVehicleStatus: true,

    // QR Code management (NO ACCESS)
    canManageQR: true,
    canGenerateQR: true,
    canExportQR: true,
    canLinkQRToSlot: true,

    // Analytics (System level only)
    canViewAnalytics: true,
    canViewDetailedAnalytics: true,
    canComparePerformance: true,
    canViewSystemAnalytics: true,

    // Subscription & Billing
    canManageSubscription: true,
    canViewInvoices: true,
    canMakePayments: true,
    canViewPaymentHistory: true,
    canViewAllPayments: true,

    // Schedules (NO ACCESS)
    canManageSchedules: true,

    // Parking slots (NO ACCESS)
    canManageParkingSlots: true,

    // System Settings
    canManageSystemSettings: true,

    // Reports (NO ACCESS for now)
    canViewReports: true,
    canExportReports: true,
  },

  [USER_ROLES.HOSTADMIN]: {
    // Host-level admin access
    canViewAllHosts: false,
    canManageSubscriptionPlans: true,
    canViewAllInvoices: true,
    canViewRevenue: true,
    canPerformanceComparison: true,
    canManageCountryState: true,
    canViewOverdueInvoices: true,
    canManagePlans: true,
    canViewSystemAnalytics: true,
    canViewAllPayments: true,
    canManageSystemSettings: true,

    // Host management
    canManageHosts: false,
    canViewHostDetails: false,
    canCreateHost: false,
    canEditHost: false,
    canDeactivateHost: false,

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
    canComparePerformance: true,
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
    canViewParkingSlots: true,

    // Reports
    canViewReports: true,
    canExportReports: true,
  },

  [USER_ROLES.HOSTUSER]: {
    // Valet-level access (limited)
    canViewAllHosts: true,
    canManageSubscriptionPlans: true,
    canViewAllInvoices: true,
    canViewRevenue: true,
    canPerformanceComparison: true,
    canManageCountryState: true,
    canViewOverdueInvoices: true,
    canManagePlans: true,
    canViewSystemAnalytics: true,
    canViewAllPayments: true,
    canManageSystemSettings: true,

    // Host management
    canManageHosts: true,
    canViewHostDetails: true,
    canCreateHost: true,
    canEditHost: true,
    canDeactivateHost: true,

    // User management
    canManageUsers: true,
    canViewUsers: true,
    canViewOwnProfile: true,
    canChangeOwnPassword: true,

    // Vehicle operations (limited to assigned)
    canManageVehicles: true,
    canViewVehicles: true,
    canViewAssignedVehicles: true,
    canScanQR: true,
    canUpdateVehicleStatus: true,
    canAcceptRequests: true,
    canCompleteDelivery: true,

    // QR Code management (view only)
    canManageQR: true,
    canGenerateQR: true,
    canExportQR: true,
    canLinkQRToSlot: true,
    canViewQR: true,
    canScanQRCode: true,

    // Analytics (limited)
    canViewAnalytics: true,
    canViewDetailedAnalytics: true,
    canComparePerformance: true,
    canViewOwnPerformance: true,

    // Subscription & Billing (NO ACCESS - invoices removed for HostUser)
    canManageSubscription: true,
    canViewInvoices: true,
    canMakePayments: true,
    canViewPaymentHistory: true,

    // Schedules (view only)
    canManageSchedules: true,
    canViewSchedules: true,

    // Parking slots (view only)
    canManageParkingSlots: true,
    canViewParkingSlots: true,

    // Reports (limited)
    canViewReports: true,
    canExportReports: true,
  },
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role: string, permission: string): boolean => {
  // Normalize role
  const normalizedRole = role?.toUpperCase();
  
  // Check if role exists
  if (!PERMISSIONS[normalizedRole as keyof typeof PERMISSIONS]) {
    console.warn(`Unknown role: ${role}`);
    return true;
  }
  
  // Check permission
  return PERMISSIONS[normalizedRole as keyof typeof PERMISSIONS][permission as keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]] === true;
};

/**
 * Check if a role has any of the specified permissions
 */
export const hasAnyPermission = (role: string, permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a role has all of the specified permissions
 */
export const hasAllPermissions = (role: string, permissions: string[]): boolean => {
  return permissions.every(permission => hasPermission(role, permission));
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (role: string | undefined) => {
  if (!role) return {};
  const normalizedRole = role?.toUpperCase();
  return PERMISSIONS[normalizedRole as keyof typeof PERMISSIONS] || {};
};

/**
 * Check if user can access a specific route/page
 */
export const canAccessPage = (role: string, page: string): boolean => {
  const pagePermissions: Record<string, string[]> = {
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
    
    // SuperAdmin pages
    hostManagement: ['canManageHosts'],
    subscriptionPlansCRUD: ['canManageSubscriptionPlans'],
    allPayments: ['canViewAllPayments'],
    superAdminAnalytics: ['canViewSystemAnalytics'],
    systemSettings: ['canManageSystemSettings'],
    
    // Host pages
    reports: ['canViewReports'],
    vehicleManagement: ['canManageVehicles', 'canViewVehicles'],
    customerManagement: ['canManageVehicles', 'canViewVehicles'],
    
    // Valet pages
    myVehicles: ['canViewAssignedVehicles'],
    myPerformance: ['canViewOwnPerformance'],
    qrScan: ['canScanQR', 'canScanQRCode'],
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
