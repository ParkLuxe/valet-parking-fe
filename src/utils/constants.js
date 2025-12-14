/**
 * Constants used throughout the application
 * Contains API endpoints, role definitions, vehicle statuses, and other constant values
 */

// API Base URL - Replace with your actual API endpoint
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// WebSocket URL - Replace with your actual WebSocket endpoint
export const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  HOST: 'host',
  VALET_HEAD: 'valet_head',
  VALET: 'valet',
};

// Vehicle Status Constants
export const VEHICLE_STATUS = {
  BEING_ASSIGNED: 'being_assigned',
  PARKING_IN_PROGRESS: 'parking_in_progress',
  PARKED: 'parked',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
};

// Vehicle Status Display Names
export const VEHICLE_STATUS_DISPLAY = {
  [VEHICLE_STATUS.BEING_ASSIGNED]: 'Being Assigned',
  [VEHICLE_STATUS.PARKING_IN_PROGRESS]: 'Parking In Progress',
  [VEHICLE_STATUS.PARKED]: 'Parked',
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
