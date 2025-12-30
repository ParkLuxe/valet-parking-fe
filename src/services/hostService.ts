/**
 * Host Service - Lightweight wrapper around apiHelper
 * For new code, prefer using TanStack Query hooks from ../api/hosts
 */

import { apiHelper } from './api';

const hostService = {
  registerHost: async (hostData: any) => {
    const response = await apiHelper.post('/v1/admin/host/register', hostData);
    return response;
  },

  // Alias for backward compatibility
  register: async (hostData: any) => {
    const response = await apiHelper.post('/v1/admin/host/register', hostData);
    return response;
  },

  updateHost: async (hostId: string, hostData: any) => {
    const response = await apiHelper.put(`/v1/admin/host/update/${hostId}`, hostData);
    return response;
  },

  getHostById: async (hostId: string) => {
    const response = await apiHelper.get(`/v1/admin/host/${hostId}`);
    return response;
  },

  getAllHosts: async (page: number = 0, size: number = 10) => {
    const response = await apiHelper.get(`/v1/admin/host?page=${page}&size=${size}`);
    return response;
  },

  filterHosts: async (filters: any) => {
    const response = await apiHelper.post('/v1/admin/host/filter', filters);
    return response;
  },
};

export default hostService;
