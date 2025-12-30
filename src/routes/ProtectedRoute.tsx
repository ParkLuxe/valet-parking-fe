/**
 * Protected Route Component
 * Redirects to login if not authenticated
 * Checks role-based access with permissions
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {  hasRole  } from '../utils';
import {  canAccessPage  } from '../utils';
import type {  RootState  } from '../redux';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[] | null;
  page?: string | null;
}

const ProtectedRoute = ({ 
  children, 
  requiredRoles = null, 
  page = null 
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !hasRole((user as any)?.roleName, requiredRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (page && (user as any)?.roleName && !canAccessPage((user as any).roleName, page)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
