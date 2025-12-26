/**
 * API Type Definitions
 * Defines all API request and response types
 */

// Common API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

// User & Authentication Types
export type UserRole = 'SUPERADMIN' | 'HOSTADMIN' | 'HOSTUSER' | 'VALET';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  role: UserRole;
  hostId?: string;
  active?: boolean;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  token?: string;
  user?: User;
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  role?: UserRole;
  hostId?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  hostId?: string;
}

// Invoice Types
export type InvoiceStatus = 'PAID' | 'UNPAID' | 'OVERDUE' | 'PENDING';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  paymentStatus: InvoiceStatus;
  invoiceDate: string;
  dueDate: string;
  hostId: string;
  hostName?: string;
  pdfUrl?: string;
  items?: InvoiceItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoiceFilters {
  hostId?: string;
  status?: InvoiceStatus | 'ALL';
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

// Payment Types
export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'COMPLETED';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentRequest {
  invoiceId: string;
  amount: number;
  paymentMethod?: string;
}

export interface PaymentStats {
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
}

// Vehicle Types
export type VehicleStatus = 'PARKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'PENDING';

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  customerName: string;
  customerPhone?: string;
  status: VehicleStatus;
  parkingSlotId?: string;
  parkingSlotNumber?: string;
  hostId: string;
  valetId?: string;
  valetName?: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VehicleFilters {
  hostId?: string;
  status?: VehicleStatus;
  valetId?: string;
  startDate?: string;
  endDate?: string;
}

export interface VehicleRequest {
  id: string;
  vehicleId: string;
  requestType: 'DELIVERY' | 'RETRIEVAL';
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  valetId?: string;
  createdAt: string;
  updatedAt?: string;
}

// Parking Slot Types
export type ParkingSlotStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  status: ParkingSlotStatus;
  hostId: string;
  vehicleId?: string;
  floor?: string;
  section?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Host Types
export interface Host {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  subscriptionPlanId?: string;
  subscriptionStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  totalSlots?: number;
  occupiedSlots?: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  maxSlots: number;
  maxUsers?: number;
  features?: string[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  id: string;
  hostId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CANCELLED';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Analytics Types
export interface AnalyticsData {
  totalVehicles: number;
  parkedVehicles: number;
  deliveredVehicles: number;
  revenue: number;
  occupancyRate?: number;
  averageStayDuration?: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface VehicleStats {
  date: string;
  parked: number;
  delivered: number;
}

// QR Code Types
export interface QRCode {
  id: string;
  code: string;
  valetId?: string;
  valetName?: string;
  hostId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ASSIGNED' | 'UNASSIGNED';
  createdAt: string;
  updatedAt?: string;
}

// Host Schedule Types
export interface HostSchedule {
  id: string;
  hostId: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Country & State Types
export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface State {
  id: string;
  name: string;
  code: string;
  countryId: string;
}

// Valet Types
export interface Valet {
  id: string;
  name: string;
  email: string;
  phone?: string;
  hostId: string;
  qrCodeId?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValetPerformance {
  valetId: string;
  valetName: string;
  totalVehiclesHandled: number;
  averageResponseTime?: number;
  rating?: number;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
