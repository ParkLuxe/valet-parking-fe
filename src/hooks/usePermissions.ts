/**
 * usePermissions Hook
 * Custom hook to check role-based permissions in components
 */

import { useSelector } from 'react-redux';
import { 
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canAccessPage,
 } from '../utils';
import type {  RootState  } from '../redux';
import type { UserRole } from '../types/api';

interface UsePermissionsReturn {
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  canAll: (permissions: string[]) => boolean;
  permissions: ReturnType<typeof getRolePermissions>;
  canAccessPage: (page: string) => boolean;
  role: UserRole | undefined;
  isRole: (role: string) => boolean;
  isAnyRole: (roles: string[]) => boolean;
}

const usePermissions = (): UsePermissionsReturn => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role;

  return {
    can: (permission: string): boolean => {
      if (!userRole) return false;
      return hasPermission(userRole, permission);
    },

    canAny: (permissions: string[]): boolean => {
      if (!userRole) return false;
      return hasAnyPermission(userRole, permissions);
    },

    canAll: (permissions: string[]): boolean => {
      if (!userRole) return false;
      return hasAllPermissions(userRole, permissions);
    },

    permissions: getRolePermissions(userRole),

    canAccessPage: (page: string): boolean => {
      if (!userRole) return false;
      return canAccessPage(userRole, page);
    },

    role: userRole,

    isRole: (role: string): boolean => {
      return userRole?.toUpperCase() === role?.toUpperCase();
    },

    isAnyRole: (roles: string[]): boolean => {
      if (!userRole) return false;
      return roles.some(role => userRole?.toUpperCase() === role?.toUpperCase());
    },
  };
};

export default usePermissions;
