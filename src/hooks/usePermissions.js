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
} from '../utils/rolePermissions';

/**
 * Hook to check user permissions
 * @returns {object} Permission checking functions
 */
const usePermissions = () => {
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role;

  return {
    /**
     * Check if user has a specific permission
     * @param {string} permission - Permission name
     * @returns {boolean}
     */
    can: (permission) => {
      if (!userRole) return false;
      return hasPermission(userRole, permission);
    },

    /**
     * Check if user has any of the specified permissions
     * @param {Array<string>} permissions - Array of permission names
     * @returns {boolean}
     */
    canAny: (permissions) => {
      if (!userRole) return false;
      return hasAnyPermission(userRole, permissions);
    },

    /**
     * Check if user has all of the specified permissions
     * @param {Array<string>} permissions - Array of permission names
     * @returns {boolean}
     */
    canAll: (permissions) => {
      if (!userRole) return false;
      return hasAllPermissions(userRole, permissions);
    },

    /**
     * Get all permissions for current user's role
     * @returns {object}
     */
    permissions: getRolePermissions(userRole),

    /**
     * Check if user can access a specific page
     * @param {string} page - Page identifier
     * @returns {boolean}
     */
    canAccessPage: (page) => {
      if (!userRole) return false;
      return canAccessPage(userRole, page);
    },

    /**
     * Get current user's role
     * @returns {string}
     */
    role: userRole,

    /**
     * Check if user is a specific role
     * @param {string} role - Role to check
     * @returns {boolean}
     */
    isRole: (role) => {
      return userRole?.toUpperCase() === role?.toUpperCase();
    },

    /**
     * Check if user is any of the specified roles
     * @param {Array<string>} roles - Array of roles
     * @returns {boolean}
     */
    isAnyRole: (roles) => {
      if (!userRole) return false;
      return roles.some(role => userRole?.toUpperCase() === role?.toUpperCase());
    },
  };
};

export default usePermissions;
