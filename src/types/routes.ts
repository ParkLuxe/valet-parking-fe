/**
 * Route Type Definitions
 * Types for route parameters and navigation
 */

// ============================================================================
// Route Parameter Types
// ============================================================================

export interface InvoiceParams {
  id: string;
}

export interface VehicleParams {
  id: string;
}

export interface PaymentParams {
  id: string;
}

export interface HostParams {
  id: string;
}

export interface UserParams {
  id: string;
}

// ============================================================================
// Route State Types
// ============================================================================

export interface LocationState {
  from?: string;
  message?: string;
  [key: string]: any;
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ComponentType<any>;
  roles?: string[];
  children?: NavigationItem[];
}
