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
    canManageUsers: false,
    canViewUsers: false,
    
    // Vehicle operations (NO ACCESS)
    canManageVehicles: false,
    canViewVehicles: false,
    canScanQR: false,
    canUpdateVehicleStatus: false,
    
    // QR Code management (NO ACCESS)
    canManageQR: false,
    canGenerateQR: false,
    canExportQR: false,
    canLinkQRToSlot: false,
    
    // Analytics (System level only)
    canViewAnalytics: false,
    canViewDetailedAnalytics: false,
    canComparePerformance: false,
    canViewSystemAnalytics: true,
    
    // Subscription & Billing
    canManageSubscription: false,
    canViewInvoices: false,
    canMakePayments: false,
    canViewPaymentHistory: false,
    canViewAllPayments: true,
    
    // Schedules (NO ACCESS)
    canManageSchedules: false,
    
    // Parking slots (NO ACCESS)
    canManageParkingSlots: false,
    
    // System Settings
    canManageSystemSettings: true,
    
    // Reports (NO ACCESS for now)
    canViewReports: false,
    canExportReports: false,
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
    canViewSystemAnalytics: false,
    canViewAllPayments: false,
    canManageSystemSettings: false,
    
    // Host management
    canManageHosts: false,
    canViewHostDetails: true,
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
    
    // QR Code management (REMOVED - not needed for Host/HostAdmin)
    canManageQR: false,
    canGenerateQR: false,
    canExportQR: false,
    canLinkQRToSlot: false,
    canDeactivateQR: false,
    
    // Analytics (REMOVED for now)
    canViewAnalytics: false,
    canViewDetailedAnalytics: false,
    canComparePerformance: false,
    canViewValetPerformance: false,
    
    // Subscription & Billing
    canManageSubscription: true,
    canViewInvoices: true,
    canMakePayments: true,
    canViewPaymentHistory: false, // Payments page removed
    canChangeSubscriptionPlan: true,
    
    // Schedules
    canManageSchedules: true,
    canCreateSchedules: true,
    canEditSchedules: true,
    canDeleteSchedules: true,
    
    // Parking slots
    canManageParkingSlots: true,
    canCreateParkingSlots: true,
    
    // Reports (REMOVED for now)
    canViewReports: false,
    canExportReports: false,
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
    canViewSystemAnalytics: false,
    canViewAllPayments: false,
    canManageSystemSettings: false,
    
    // Host management
    canManageHosts: false,
    canViewHostDetails: false,
    canCreateHost: false,
    canEditHost: false,
    canDeactivateHost: false,
    
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
    
    // Subscription & Billing (NO ACCESS - invoices removed for HostUser)
    canManageSubscription: false,
    canViewInvoices: false,
    canMakePayments: false,
    canViewPaymentHistory: false,
    
    // Schedules (view only)
    canManageSchedules: false,
    canViewSchedules: true,
    
    // Parking slots (view only)
    canManageParkingSlots: false,
    canViewParkingSlots: true,
    
    // Reports (limited)
    canViewReports: false,
    canExportReports: false,
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
    return false;
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
export const getRolePermissions = (role: string) => {
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
