/**
 * Authentication Service
 * Handles login, register, logout, and profile operations
 */

import { apiHelper } from './api';

const authService = {
  /**
   * Login user
   * @param {object} credentials - Login credentials (username, password, role)
   * @returns {Promise} User data and token
   */
  login: async (credentials) => {
    try {
      const response = await apiHelper.post('/v1/auth/login', {
        userName: credentials.email || credentials.username,
        password: credentials.password,
        role: credentials.role,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register new host
   * @param {object} userData - Registration data
   * @returns {Promise} User data and token
   */
  register: async (userData) => {
    try {
      const response = await apiHelper.post('/v1/admin/host/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise}
   */
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('park_luxe_refresh_token');
      await apiHelper.post('/v1/auth/logout', { refreshToken });
      
      // Clear local storage
      localStorage.clear();
      return { success: true };
    } catch (error) {
      // Clear local storage even if API call fails
      localStorage.clear();
      throw error;
    }
  },

  /**
   * Validate token
   * @returns {Promise} Token validation result
   */
  validateToken: async () => {
    try {
      const response = await apiHelper.get('/v1/auth/validate-token');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} New tokens
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiHelper.post('/v1/auth/refresh-token', {
        refreshToken,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  getProfile: async () => {
    try {
      const response = await apiHelper.get('/v1/host-users/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {object} profileData - Updated profile data
   * @returns {Promise} Updated user data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiHelper.put('/v1/auth/profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change password
   * @param {object} passwordData - Old and new password
   * @returns {Promise}
   */
  changePassword: async (passwordData) => {
    try {
      const response = await apiHelper.post('/v1/auth/change-password', passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload profile picture
   * @param {File} file - Profile picture file
   * @returns {Promise} Uploaded file URL
   */
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await apiHelper.post('/v1/auth/upload-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify email
   * @param {string} token - Verification token
   * @returns {Promise}
   */
  verifyEmail: async (token) => {
    try {
      const response = await apiHelper.post('/v1/auth/verify-email', { token });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise}
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await apiHelper.post('/v1/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise}
   */
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiHelper.post('/v1/auth/reset-password', { 
        token, 
        newPassword 
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
