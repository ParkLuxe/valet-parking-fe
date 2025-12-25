/**
 * API Response Types
 * Type definitions for all API responses and entities
 */

// Generic API Response Wrapper
export interface ApiResponse<T = any> {
  data: T;
  success?: boolean;
  message?: string;
  status?: string;
}

// Paginated Response
export interface PaginatedResponse<T = any> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

// User Types
export type UserRole = 'SUPERADMIN' | 'HOSTADMIN' | 'HOSTUSER';

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: UserRole;
  hostId?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

// Authentication Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  token?: string; // Legacy support
  refreshToken?: string;
  username?: string;
  email?: string;
  name?: string;
  role?: UserRole;
  hostId?: string;
  id?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
  role?: UserRole;
}

// Invoice Types
export type InvoiceStatus = 'PAID' | 'UNPAID' | 'OVERDUE' | 'PENDING';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  hostId: string;
  hostName?: string;
  invoiceDate: string;
  dueDate: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  totalAmount: number;
  baseAmount?: number;
  additionalAmount?: number;
  taxAmount?: number;
  paymentStatus: InvoiceStatus;
  paidAt?: string;
  paymentMethod?: string;
  scansIncluded?: number;
  additionalScans?: number;
  subscriptionPlanName?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  hostId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Payment Types
export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'CASH' | 'OTHER';

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber?: string;
  hostId: string;
  hostName?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentDate: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  hostId?: string;
  startDate?: string;
  endDate?: string;
  method?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
}

// Vehicle Types
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
  licensePlate: string;
  vehicleType: VehicleType;
  make?: string;
  model?: string;
  color?: string;
  status: VehicleStatus;
  hostId: string;
  ownerId?: string;
  ownerName?: string;
  ownerPhone?: string;
  assignedValetId?: string;
  assignedValetName?: string;
  parkingSlotId?: string;
  parkingSlotNumber?: string;
  qrCode?: string;
  checkInTime?: string;
  checkOutTime?: string;
  parkingDuration?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Host Types
export interface Host {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  subscriptionPlanId?: string;
  subscriptionPlanName?: string;
  subscriptionStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'EXPIRED';
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  totalScansAllowed?: number;
  scansUsed?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Subscription Plan Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  scansIncluded: number;
  additionalScanPrice?: number;
  durationDays?: number;
  features?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Parking Slot Types
export type SlotStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  hostId: string;
  status: SlotStatus;
  floor?: string;
  section?: string;
  vehicleType?: VehicleType;
  currentVehicleId?: string;
  currentVehiclePlate?: string;
  assignedValetId?: string;
  assignedValetName?: string;
  qrCode?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Analytics Types
export interface AnalyticsData {
  totalVehicles?: number;
  activeVehicles?: number;
  totalRevenue?: number;
  totalScans?: number;
  averageParkingTime?: number;
  peakHours?: { hour: number; count: number }[];
  vehiclesByStatus?: { status: string; count: number }[];
  revenueByMonth?: { month: string; revenue: number }[];
  topValets?: { valetId: string; valetName: string; vehiclesHandled: number }[];
}

// QR Code Types
export interface QRCode {
  id: string;
  code: string;
  type: 'VEHICLE' | 'SLOT' | 'HOST';
  entityId: string;
  hostId?: string;
  isActive: boolean;
  generatedAt: string;
  lastScannedAt?: string;
  scanCount?: number;
}

// Vehicle Request Types
export type RequestStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type RequestType = 'PARK' | 'RETRIEVE';

export interface VehicleRequest {
  id: string;
  type: RequestType;
  status: RequestStatus;
  vehicleId: string;
  vehiclePlate?: string;
  hostId: string;
  requestedBy?: string;
  assignedValetId?: string;
  assignedValetName?: string;
  requestTime: string;
  assignedTime?: string;
  completedTime?: string;
  estimatedTime?: number;
  actualTime?: number;
  notes?: string;
}

// Host User Types
export interface HostUser extends User {
  hostId: string;
  permissions?: string[];
  isActive: boolean;
}

// Schedule Types
export interface Schedule {
  id: string;
  hostId: string;
  userId: string;
  userName?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Country and State Types
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
  countryCode?: string;
}

// Error Response
export interface ErrorResponse {
  message: string;
  status?: number;
  error?: string;
  details?: any;
}
