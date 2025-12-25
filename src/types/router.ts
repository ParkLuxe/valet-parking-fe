/**
 * Router Types
 * Type definitions for TanStack Router
 */

import type { User } from './api';

// Router context
export interface RouterContext {
  auth: {
    isAuthenticated: boolean;
    user: User | null;
  };
}

// Route params
export interface RouteParams {
  id?: string;
  [key: string]: string | undefined;
}

// Search params
export interface SearchParams {
  page?: number;
  size?: number;
  sort?: string;
  filter?: string;
  [key: string]: any;
}

// Route meta
export interface RouteMeta {
  title?: string;
  requiresAuth?: boolean;
  roles?: string[];
  breadcrumb?: string;
}
