/**
<<<<<<< HEAD
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
=======
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
>>>>>>> master
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
<<<<<<< HEAD
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
  role: UserRole;
  hostId?: string;
  active?: boolean;
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
=======
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
>>>>>>> master
  username: string;
  password: string;
}

<<<<<<< HEAD
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  hostId?: string;
=======
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
>>>>>>> master
}

// Invoice Types
export type InvoiceStatus = 'PAID' | 'UNPAID' | 'OVERDUE' | 'PENDING';

export interface Invoice {
  id: string;
  invoiceNumber: string;
<<<<<<< HEAD
  totalAmount: number;
  paymentStatus: InvoiceStatus;
  invoiceDate: string;
  dueDate: string;
  hostId: string;
  hostName?: string;
  pdfUrl?: string;
  items?: InvoiceItem[];
=======
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
>>>>>>> master
  createdAt?: string;
  updatedAt?: string;
}

<<<<<<< HEAD
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
=======
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
>>>>>>> master

export interface Payment {
  id: string;
  invoiceId: string;
<<<<<<< HEAD
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
=======
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
>>>>>>> master
  createdAt?: string;
  updatedAt?: string;
}

// Host Types
export interface Host {
  id: string;
  name: string;
  email: string;
<<<<<<< HEAD
  phone?: string;
=======
  phoneNumber?: string;
>>>>>>> master
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  subscriptionPlanId?: string;
<<<<<<< HEAD
  subscriptionStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  totalSlots?: number;
  occupiedSlots?: number;
  active: boolean;
=======
  subscriptionPlanName?: string;
  subscriptionStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'EXPIRED';
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  totalScansAllowed?: number;
  scansUsed?: number;
  isActive: boolean;
>>>>>>> master
  createdAt?: string;
  updatedAt?: string;
}

<<<<<<< HEAD
// Subscription Types
=======
// Subscription Plan Types
>>>>>>> master
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
<<<<<<< HEAD
  billingCycle: 'MONTHLY' | 'YEARLY';
  maxSlots: number;
  maxUsers?: number;
  features?: string[];
  active: boolean;
=======
  scansIncluded: number;
  additionalScanPrice?: number;
  durationDays?: number;
  features?: string[];
  isActive: boolean;
>>>>>>> master
  createdAt?: string;
  updatedAt?: string;
}

<<<<<<< HEAD
export interface Subscription {
  id: string;
  hostId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CANCELLED';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
=======
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
>>>>>>> master
  createdAt?: string;
  updatedAt?: string;
}

// Analytics Types
export interface AnalyticsData {
<<<<<<< HEAD
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
=======
  totalVehicles?: number;
  activeVehicles?: number;
  totalRevenue?: number;
  totalScans?: number;
  averageParkingTime?: number;
  peakHours?: { hour: number; count: number }[];
  vehiclesByStatus?: { status: string; count: number }[];
  revenueByMonth?: { month: string; revenue: number }[];
  topValets?: { valetId: string; valetName: string; vehiclesHandled: number }[];
>>>>>>> master
}

// QR Code Types
export interface QRCode {
  id: string;
  code: string;
<<<<<<< HEAD
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
=======
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
>>>>>>> master
  createdAt?: string;
  updatedAt?: string;
}

<<<<<<< HEAD
// Country & State Types
=======
// Country and State Types
>>>>>>> master
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
<<<<<<< HEAD
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
=======
  countryCode?: string;
}

// Error Response
export interface ErrorResponse {
  message: string;
  status?: number;
  error?: string;
>>>>>>> master
  details?: any;
}
