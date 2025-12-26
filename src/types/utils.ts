/**
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
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
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
