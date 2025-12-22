/**
 * Constants used throughout the application
 * Contains API endpoints, role definitions, vehicle statuses, and other constant values
 */

// API Base URL - Replace with your actual API endpoint
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// WebSocket URL - Replace with your actual WebSocket endpoint
export const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';

// User Roles - Updated to match backend
export const USER_ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  HOSTADMIN: 'HOSTADMIN',
  HOSTUSER: 'HOSTUSER',
  // Legacy support
  SUPER_ADMIN: 'SUPERADMIN',
  HOST: 'HOSTADMIN',
  VALET_HEAD: 'HOSTADMIN',
  VALET: 'HOSTUSER',
};

// Vehicle Status Constants - Updated to match backend
export const VEHICLE_STATUS = {
  BEING_ASSIGNED: 'BEING_ASSIGNED',
  PARKING_IN_PROGRESS: 'PARKING_IN_PROGRESS',
  PARKED: 'PARKED',
  RETRIEVAL_REQUESTED: 'RETRIEVAL_REQUESTED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
};

// Vehicle Status Display Names
export const VEHICLE_STATUS_DISPLAY = {
  [VEHICLE_STATUS.BEING_ASSIGNED]: 'Being Assigned',
  [VEHICLE_STATUS.PARKING_IN_PROGRESS]: 'Parking In Progress',
  [VEHICLE_STATUS.PARKED]: 'Parked',
  [VEHICLE_STATUS.RETRIEVAL_REQUESTED]: 'Retrieval Requested',
  [VEHICLE_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [VEHICLE_STATUS.DELIVERED]: 'Delivered',
};

// Vehicle Types
export const VEHICLE_TYPES = {
  CAR: 'car',
  BIKE: 'bike',
  SUV: 'suv',
  VAN: 'van',
};

// Subscription Constants
export const SUBSCRIPTION = {
  BASE_PRICE: 1000,
  BASE_SCANS: 100,
  ADDITIONAL_SCAN_PRICE: 10,
  GRACE_PERIOD_DAYS: 3,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'park_luxe_auth_token',
  USER_DATA: 'park_luxe_user_data',
  REFRESH_TOKEN: 'park_luxe_refresh_token',
};

// Toast Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Default Placeholder Credentials (For Development Only - CHANGE IN PRODUCTION)
export const PLACEHOLDER_CREDENTIALS = {
  superAdmin: {
    email: 'admin@parkluxe.com',
    password: 'Admin@123',
  },
  host: {
    email: 'host@example.com',
    password: 'Host@123',
  },
  valet: {
    email: 'valet@example.com',
    password: 'Valet@123',
  },
};

// Date Format
export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_DISPLAY_FORMAT = 'MMM DD, YYYY hh:mm A';

// Razorpay Configuration (Replace with your actual keys)
export const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_XXXXXXXXXXXXXXXX';

// Chart Colors
export const CHART_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

// Performance Thresholds (in minutes)
export const PERFORMANCE_THRESHOLDS = {
  PARKING_TIME_EXCELLENT: 5,
  PARKING_TIME_GOOD: 10,
  PARKING_TIME_POOR: 15,
  DELIVERY_TIME_EXCELLENT: 3,
  DELIVERY_TIME_GOOD: 7,
  DELIVERY_TIME_POOR: 10,
};
