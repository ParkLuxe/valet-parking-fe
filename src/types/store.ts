/**
 * Redux Store Type Definitions
 * Types for Redux state slices
 */

import type { User } from './api';

// ============================================================================
// Auth State
// ============================================================================

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// UI State
// ============================================================================

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  isMobile: boolean;
}

// ============================================================================
// Notification State
// ============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface NotificationState {
  toastQueue: ToastNotification[];
}

// ============================================================================
// Root State (Simplified - only client state)
// ============================================================================

export interface RootState {
  auth: AuthState;
  ui: UIState;
  notifications: NotificationState;
}

// ============================================================================
// Redux Action Types
// ============================================================================

export interface SetUserAction {
  type: string;
  payload: User | null;
}

export interface SetTokenAction {
  type: string;
  payload: string | null;
}

export interface SetLoadingAction {
  type: string;
  payload: boolean;
}

export interface SetErrorAction {
  type: string;
  payload: string | null;
}
