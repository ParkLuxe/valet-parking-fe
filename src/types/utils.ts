/**
 * Utility Types
 * General utility type definitions
 */

// Generic form data type
export type FormData<T = Record<string, any>> = T;

// Generic filter type
export interface FilterParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
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
}
