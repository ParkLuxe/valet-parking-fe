/**
 * Component Props Type Definitions
 * Defines prop types for common components
 */

import type { ReactNode } from 'react';

// Button Component Props
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

// Input Component Props
export interface InputProps {
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

// Card Component Props
export interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}

// Modal Component Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Loading Spinner Props
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Badge Component Props
export interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  className?: string;
}

// Select Component Props
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

// Toast Component Props
export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose?: () => void;
}

// Layout Component Props
export interface LayoutProps {
  children: ReactNode;
}

// Protected Route Props
export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}
