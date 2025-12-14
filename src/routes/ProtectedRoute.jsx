/**
 * Protected Route Component
 * Redirects to login if not authenticated
 * Checks role-based access
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasRole } from '../utils/helpers';

const ProtectedRoute = ({ children, requiredRoles = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRoles && !hasRole(user?.role, requiredRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
