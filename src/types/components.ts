/**
 * Component Prop Type Definitions
 * Shared prop types for React components
 */

import { ReactNode } from 'react';
import type { UserRole, VehicleStatus } from './api';

// ============================================================================
// Common Component Props
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
}

export interface InputProps {
  type?: string;
  name?: string;
  value?: string | number;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

export interface SelectProps {
  name?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

// ============================================================================
// Layout Component Props
// ============================================================================

export interface LayoutProps {
  children: ReactNode;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface HeaderProps {
  onMenuClick: () => void;
}

// ============================================================================
// Route Component Props
// ============================================================================

export interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  page?: string;
}

export interface PublicRouteProps {
  children: ReactNode;
}

// ============================================================================
// Badge Component Props
// ============================================================================

export interface BadgeProps extends BaseComponentProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// Modal Component Props
// ============================================================================

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

// ============================================================================
// Loading Component Props
// ============================================================================

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

// ============================================================================
// Toast Component Props
// ============================================================================

export interface ToastProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description: string;
  onClose: () => void;
  duration?: number;
}

// ============================================================================
// Form Component Props
// ============================================================================

export interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
}

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

// ============================================================================
// Vehicle Component Props
// ============================================================================

export interface VehicleCardProps {
  vehicle: {
    id: string;
    registrationNumber: string;
    customerName: string;
    status: VehicleStatus;
    checkInTime: string;
  };
  onClick?: (vehicleId: string) => void;
  onStatusChange?: (vehicleId: string, newStatus: VehicleStatus) => void;
}

export interface VehicleStatusBadgeProps {
  status: VehicleStatus;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// Payment Component Props
// ============================================================================

export interface RazorpayButtonProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
  };
  onSuccess?: (paymentId: string) => void;
  onError?: (error: any) => void;
  disabled?: boolean;
}

// ============================================================================
// Chart Component Props
// ============================================================================

export interface ChartProps {
  data: any[];
  width?: number | string;
  height?: number;
  className?: string;
}

export interface BarChartProps extends ChartProps {
  dataKey: string;
  xAxisKey: string;
  color?: string;
}

export interface LineChartProps extends ChartProps {
  dataKey: string;
  xAxisKey: string;
  color?: string;
}

export interface PieChartProps extends ChartProps {
  dataKey: string;
  nameKey: string;
}

// ============================================================================
// Filter Component Props
// ============================================================================

export interface FilterPanelProps {
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  onReset: () => void;
  children?: ReactNode;
}

// ============================================================================
// Pagination Component Props
// ============================================================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  className?: string;
}
