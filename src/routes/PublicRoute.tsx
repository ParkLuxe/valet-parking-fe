/**
 * Public Route Component
 * Redirects to dashboard if already authenticated
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type {  RootState  } from '../redux';

export interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
