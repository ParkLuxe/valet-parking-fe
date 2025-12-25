/**
 * Constants used throughout the application
 * Contains API endpoints, role definitions, vehicle statuses, and other constant values
 */

import type { UserRole, VehicleStatus, VehicleType } from '../types/api';

// API Base URL - Replace with your actual API endpoint
export const API_BASE_URL: string = process.env.REACT_APP_API_URL || 'https://parkluxe.co.in';

// WebSocket URL - Replace with your actual WebSocket endpoint
export const WS_URL: string = process.env.REACT_APP_WS_URL || 'wss://parkluxe.co.in';

// User Roles - Updated to match backend
export const USER_ROLES = {
  SUPERADMIN: 'SUPERADMIN' as const,
  HOSTADMIN: 'HOSTADMIN' as const,
  HOSTUSER: 'HOSTUSER' as const,
  // Legacy support
  SUPER_ADMIN: 'SUPERADMIN' as const,
  HOST: 'HOSTADMIN' as const,
  VALET_HEAD: 'HOSTADMIN' as const,
  VALET: 'HOSTUSER' as const,
} as const;

// Vehicle Status Constants - Updated to match backend
export const VEHICLE_STATUS: Record<string, VehicleStatus> = {
  BEING_ASSIGNED: 'BEING_ASSIGNED',
  PARKING_IN_PROGRESS: 'PARKING_IN_PROGRESS',
  PARKED: 'PARKED',
  RETRIEVAL_REQUESTED: 'RETRIEVAL_REQUESTED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
} as const;

// Vehicle Status Display Names
export const VEHICLE_STATUS_DISPLAY: Record<VehicleStatus, string> = {
  [VEHICLE_STATUS.BEING_ASSIGNED]: 'Being Assigned',
  [VEHICLE_STATUS.PARKING_IN_PROGRESS]: 'Parking In Progress',
  [VEHICLE_STATUS.PARKED]: 'Parked',
  [VEHICLE_STATUS.RETRIEVAL_REQUESTED]: 'Retrieval Requested',
  [VEHICLE_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [VEHICLE_STATUS.DELIVERED]: 'Delivered',
} as const;

// Vehicle Types
export const VEHICLE_TYPES: Record<string, VehicleType> = {
  CAR: 'car',
  BIKE: 'bike',
  SUV: 'suv',
  VAN: 'van',
} as const;

// Subscription Constants
export const SUBSCRIPTION = {
  BASE_PRICE: 1000,
  BASE_SCANS: 100,
  ADDITIONAL_SCAN_PRICE: 10,
  GRACE_PERIOD_DAYS: 3,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'park_luxe_auth_token' as const,
  USER_DATA: 'park_luxe_user_data' as const,
  REFRESH_TOKEN: 'park_luxe_refresh_token' as const,
} as const;

// Toast Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success' as const,
  ERROR: 'error' as const,
  WARNING: 'warning' as const,
  INFO: 'info' as const,
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100] as const,
} as const;

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
} as const;

// Date Format
export const DATE_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';
export const DATE_DISPLAY_FORMAT: string = 'MMM DD, YYYY hh:mm A';

// Razorpay Configuration (Replace with your actual keys)
export const RAZORPAY_KEY: string = process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_XXXXXXXXXXXXXXXX';

// Chart Colors
export const CHART_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
} as const;

// Performance Thresholds (in minutes)
export const PERFORMANCE_THRESHOLDS = {
  PARKING_TIME_EXCELLENT: 5,
  PARKING_TIME_GOOD: 10,
  PARKING_TIME_POOR: 15,
  DELIVERY_TIME_EXCELLENT: 3,
  DELIVERY_TIME_GOOD: 7,
  DELIVERY_TIME_POOR: 10,
} as const;

export const RESPONSE_VALUES = {
  SUCCESS: 'SUCCESS' as const,
  ERROR: 'ERROR' as const,
  WARNING: 'WARNING' as const,
} as const;