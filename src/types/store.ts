/**
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
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

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
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
}

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
}
