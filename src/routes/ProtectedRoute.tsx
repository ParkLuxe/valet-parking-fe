/**
 * Protected Route Component
 * Redirects to login if not authenticated
 * Checks role-based access with permissions
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasRole } from '../utils/helpers';
import { canAccessPage } from '../utils/rolePermissions';
import type { RootState } from '../redux/store';

interface ProtectedRouteProps {
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

  if (requiredRoles && !hasRole(user?.role, requiredRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (page && user?.role && !canAccessPage(user.role, page)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
