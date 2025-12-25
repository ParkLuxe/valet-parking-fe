/**
<<<<<<< HEAD
 * Utility Type Definitions
 * Common utility types used across the application
 */

// Nullable type helper
export type Nullable<T> = T | null;

// Optional type helper
export type Optional<T> = T | undefined;

// Make all properties optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make all properties required
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Extract promise type
export type Awaited<T> = T extends Promise<infer U> ? U : T;

// Filter options type
export interface FilterOptions {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
=======
 * Utility Types
 * General utility type definitions
 */

// Generic form data type
export type FormData<T = Record<string, any>> = T;

// Generic filter type
export interface FilterParams {
>>>>>>> master
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
<<<<<<< HEAD
}

// Pagination type
export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

// Generic action result
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// Permission type
export type Permission = 
  | 'create_invoice'
  | 'view_invoice'
  | 'download_invoice'
  | 'make_payment'
  | 'view_payment'
  | 'manage_vehicles'
  | 'view_vehicles'
  | 'manage_users'
  | 'view_users'
  | 'manage_hosts'
  | 'view_analytics'
  | 'manage_subscriptions'
  | 'manage_parking_slots'
  | 'scan_qr_code';

// Route params
export interface RouteParams {
  id?: string;
  invoiceId?: string;
  paymentId?: string;
  vehicleId?: string;
  hostId?: string;
  [key: string]: string | undefined;
=======
  search?: string;
  [key: string]: any;
}

// Generic callback types
export type VoidCallback = () => void;
export type AsyncVoidCallback = () => Promise<void>;
export type Callback<T = any> = (value: T) => void;
export type AsyncCallback<T = any> = (value: T) => Promise<void>;

// Generic event handlers
export type ChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
export type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;

// Status badge types
export type StatusBadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

// Validator function type
export type ValidatorFn<T = any> = (value: T) => boolean | string;

// Generic API service type
export interface ApiService<T = any> {
  getAll: (params?: FilterParams) => Promise<T[]>;
  getById: (id: string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

// Route permission type
export type RoutePermission = {
  path: string;
  roles: string[];
  requiresAuth: boolean;
};

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

// Storage utility types
export type StorageKey = 'AUTH_TOKEN' | 'USER_DATA' | 'REFRESH_TOKEN';

// WebSocket event types
export interface WebSocketEvent<T = any> {
  type: string;
  data: T;
  timestamp: string;
}

// Notification types
export interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  closable?: boolean;
>>>>>>> master
}
