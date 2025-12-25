/**
<<<<<<< HEAD
 * Redux Store Type Definitions
 * Defines types for Redux state management (UI and Auth state only)
 */

import type { User } from './api';

// Auth State (Keep in Redux)
=======
 * Redux Store Types
 * Type definitions for Redux state
 */

import type {
  User,
  Invoice,
  Payment,
  Vehicle,
  Host,
  ParkingSlot,
  SubscriptionPlan,
  AnalyticsData,
  VehicleRequest,
  Schedule,
} from './api';

// Auth State
>>>>>>> master
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

<<<<<<< HEAD
// UI State (Keep in Redux)
=======
// Invoice State
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  unpaidInvoices: Invoice[];
  overdueInvoices: Invoice[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// Payment State
export interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// Vehicle State
export interface VehicleState {
  vehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  activeVehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// Parking Slot State
export interface ParkingSlotState {
  slots: ParkingSlot[];
  availableSlots: ParkingSlot[];
  occupiedSlots: ParkingSlot[];
  loading: boolean;
  error: string | null;
}

// Subscription State
export interface SubscriptionState {
  plans: SubscriptionPlan[];
  currentPlan: SubscriptionPlan | null;
  userSubscription: any | null;
  loading: boolean;
  error: string | null;
}

// Analytics State
export interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

// Valet State
export interface ValetState {
  valets: User[];
  currentValet: User | null;
  myVehicles: Vehicle[];
  myRequests: VehicleRequest[];
  performance: any | null;
  loading: boolean;
  error: string | null;
}

// Notification State
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface NotificationState {
  toastQueue: Toast[];
  notifications: any[];
}

// UI State
>>>>>>> master
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
}

<<<<<<< HEAD
// Notification/Toast State (Keep in Redux)
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface NotificationState {
  toasts: Toast[];
}

// Root State Type
export interface RootState {
  auth: AuthState;
  ui: UIState;
  notifications: NotificationState;
=======
// Root State
export interface RootState {
  auth: AuthState;
  invoice: InvoiceState;
  payment: PaymentState;
  vehicle: VehicleState;
  parkingSlot: ParkingSlotState;
  subscription: SubscriptionState;
  analytics: AnalyticsState;
  valet: ValetState;
  notifications: NotificationState;
  ui: UIState;
>>>>>>> master
}
