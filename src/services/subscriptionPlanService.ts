/**
 * Subscription Plan Service - Lightweight wrapper around apiHelper
 * For new code, prefer using TanStack Query hooks from ../api/subscriptionPlans
 */

import { apiHelper } from './api';

const subscriptionPlanService = {
  createPlan: async (planData: any) => {
    const response = await apiHelper.post('/v1/subscription-plans', planData);
    return response;
  },

  updatePlan: async (planId: string, planData: any) => {
    const response = await apiHelper.put(`/v1/subscription-plans/${planId}`, planData);
    return response;
  },

  getPlanById: async (planId: string) => {
    const response = await apiHelper.get(`/v1/subscription-plans/${planId}`);
    return response;
  },

  getAllPlans: async (page: number = 0, size: number = 20) => {
    const response = await apiHelper.get(`/v1/subscription-plans?page=${page}&size=${size}`);
    return response;
  },

  getActivePlans: async () => {
    const response = await apiHelper.get('/v1/subscription-plans/active');
    return response;
  },

  getStandardPlans: async () => {
    const response = await apiHelper.get('/v1/subscription-plans/standard');
    return response;
  },

  filterPlans: async (filters: any) => {
    const response = await apiHelper.post('/v1/subscription-plans/filter', filters);
    return response;
  },
};

export default subscriptionPlanService;
