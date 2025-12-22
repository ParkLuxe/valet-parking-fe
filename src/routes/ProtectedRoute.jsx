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

const ProtectedRoute = ({ children, requiredRoles = null, page = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role (legacy support)
  if (requiredRoles && !hasRole(user?.role, requiredRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check page-level permissions (new permission system)
  if (page && user?.role && !canAccessPage(user.role, page)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
