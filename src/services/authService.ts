/**
 * Auth Service - Lightweight wrapper around apiHelper
 * For new code, prefer using TanStack Query hooks from ../api/auth
 */

import { apiHelper } from './api';

const authService = {
  login: async (credentials: { username: string; password: string; role?: string }) => {
    const response = await apiHelper.post('/v1/auth/login', {
      userName: credentials.username,
      password: credentials.password,
      role: credentials.role,
    });
    return response;
  },

  getProfile: async () => {
    const response = await apiHelper.get('/v1/host-users/me');
    return response;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('park_luxe_refresh_token');
    const response = await apiHelper.post('/v1/auth/logout', { refreshToken });
    return response;
  },

  validateToken: async () => {
    const response = await apiHelper.get('/v1/auth/validate-token');
    return response;
  },

  updateProfile: async (userData: any) => {
    const response = await apiHelper.put('/v1/host-users/me', userData);
    return response;
  },

  changePassword: async (data: { oldPassword?: string; currentPassword?: string; newPassword: string; confirmPassword?: string }) => {
    const requestData = {
      currentPassword: data.currentPassword || data.oldPassword,
      newPassword: data.newPassword,
    };
    const response = await apiHelper.post('/v1/users/change-password', requestData);
    return response;
  },

  register: async (userData: any) => {
    const response = await apiHelper.post('/v1/admin/host/register', userData);
    return response;
  },
};

export default authService;
