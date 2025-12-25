/**
 * Component Prop Types
 * Type definitions for component props
 */

import type { ReactNode, CSSProperties } from 'react';
import type { User, Vehicle, Invoice, Payment, ParkingSlot } from './api';

// Button Component
export interface ButtonProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
}

// Input Component
export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time';
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
}

// Card Component
export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
}

// Modal Component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  className?: string;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
  footer?: ReactNode;
}

// Toast Component
export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description?: string;
}

// Layout Component
export interface LayoutProps {
  children: ReactNode;
}

// Header Component
export interface HeaderProps {
  title?: string;
  user?: User | null;
  onLogout?: () => void;
}

// Sidebar Component
export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: User | null;
}

// Confirm Dialog Component
export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

// Loading Spinner Component
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  fullScreen?: boolean;
}

// Date Range Picker Component
export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  label?: string;
  className?: string;
}

// Export Button Component
export interface ExportButtonProps {
  data: any[];
  filename?: string;
  format?: 'csv' | 'excel' | 'pdf';
  className?: string;
}
