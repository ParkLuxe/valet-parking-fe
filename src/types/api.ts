/**
 * API Type Definitions
 * Types for API requests and responses
 */

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

// ============================================================================
// Invoice Types
// ============================================================================

export type InvoiceStatus = 'PAID' | 'UNPAID' | 'OVERDUE';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  paymentStatus: InvoiceStatus;
  invoiceDate: string;
  dueDate: string;
  hostId: string;
  subscriptionPlanId: string;
  scansUsed: number;
  baseAmount: number;
  additionalCharges: number;
  taxAmount: number;
  pdfUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceFilterParams {
  hostId?: string;
  status?: InvoiceStatus;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED';
export type PaymentMethod = 'RAZORPAY' | 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  paymentDate: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentFilterParams {
  invoiceId?: string;
  hostId?: string;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

// ============================================================================
// Vehicle Types
// ============================================================================

export type VehicleStatus =
  | 'BEING_ASSIGNED'
  | 'PARKING_IN_PROGRESS'
  | 'PARKED'
  | 'RETRIEVAL_REQUESTED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export type VehicleType = 'car' | 'bike' | 'suv' | 'van';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  customerName: string;
  customerPhone: string;
  vehicleType: VehicleType;
  status: VehicleStatus;
  checkInTime: string;
  checkOutTime: string | null;
  hostId: string;
  assignedValetId?: string;
  assignedValetName?: string;
  parkingSlotId?: string;
  parkingSlotNumber?: string;
  qrCodeData?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleFilterParams {
  hostId?: string;
  status?: VehicleStatus;
  valetId?: string;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}

export interface VehicleRequest {
  registrationNumber: string;
  customerName: string;
  customerPhone: string;
  vehicleType: VehicleType;
  hostId: string;
  qrCodeData?: string;
}

// ============================================================================
// User Types
// ============================================================================

export type UserRole = 'SUPERADMIN' | 'HOSTADMIN' | 'HOSTUSER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  hostId?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  hostId?: string;
}

// ============================================================================
// Host Types
// ============================================================================

export interface Host {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  subscriptionPlanId?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HostUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  hostId: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// Subscription Types
// ============================================================================

export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'SUSPENDED';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  baseScans: number;
  additionalScanPrice: number;
  features: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  id: string;
  hostId: string;
  subscriptionPlanId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  scansUsed: number;
  scansRemaining: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// Parking Slot Types
// ============================================================================

export type ParkingSlotStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  status: ParkingSlotStatus;
  hostId: string;
  vehicleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsData {
  totalVehicles: number;
  activeVehicles: number;
  deliveredVehicles: number;
  averageParkingTime: number;
  averageDeliveryTime: number;
  revenueToday: number;
  revenueThisMonth: number;
  revenueThisYear: number;
}

export interface PerformanceMetrics {
  valetId: string;
  valetName: string;
  totalVehiclesHandled: number;
  averageParkingTime: number;
  averageDeliveryTime: number;
  rating: number;
}

export interface DashboardStats {
  totalActiveVehicles: number;
  vehiclesParked: number;
  pendingRetrievals: number;
  totalRevenue: number;
  totalScansUsed: number;
  scansRemaining: number;
  unpaidInvoices: number;
  overdueInvoices: number;
}

// ============================================================================
// QR Code Types
// ============================================================================

export interface QRCode {
  id: string;
  qrCodeData: string;
  vehicleId?: string;
  hostId: string;
  isUsed: boolean;
  createdAt: string;
  usedAt?: string;
}

export interface QRCodeScanResult {
  success: boolean;
  message: string;
  vehicleId?: string;
  vehicle?: Vehicle;
}

// ============================================================================
// Schedule Types
// ============================================================================

export interface HostSchedule {
  id: string;
  hostId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// ============================================================================
// Common Response Types
// ============================================================================

export interface SuccessResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: any;
}
