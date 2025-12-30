/**
 * Host Schedules Service - Lightweight wrapper around apiHelper
 * For new code, prefer using TanStack Query hooks from ../api/hostSchedules
 */

import { apiHelper } from './api';

const hostSchedulesService = {
  createSchedule: async (hostIdOrData: any, scheduleData?: any) => {
    // Handle both createSchedule(data) and createSchedule(hostId, data)
    const data = scheduleData ? { ...scheduleData, hostId: hostIdOrData } : hostIdOrData;
    const response = await apiHelper.post('/v1/host-schedule', data);
    return response;
  },

  getScheduleById: async (scheduleId: string) => {
    const response = await apiHelper.get(`/v1/host-schedule/${scheduleId}`);
    return response;
  },

  getHostSchedules: async (hostId: string) => {
    const response = await apiHelper.get(`/v1/host-schedule/host/${hostId}`);
    return response;
  },

  // Alias for backward compatibility
  getSchedulesByHost: async (hostId: string) => {
    const response = await apiHelper.get(`/v1/host-schedule/host/${hostId}`);
    return response;
  },

  updateSchedule: async (scheduleId: string, scheduleData: any) => {
    const response = await apiHelper.put(`/v1/host-schedule/${scheduleId}`, scheduleData);
    return response;
  },

  deleteSchedule: async (scheduleId: string) => {
    const response = await apiHelper.delete(`/v1/host-schedule/${scheduleId}`);
    return response;
  },
};

export default hostSchedulesService;
