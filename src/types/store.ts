/**
 * Redux Store Type Definitions
 * Defines types for Redux state management (UI and Auth state only)
 */

import type { User } from './api';

// Auth State (Keep in Redux)
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// UI State (Keep in Redux)
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
}

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
}
