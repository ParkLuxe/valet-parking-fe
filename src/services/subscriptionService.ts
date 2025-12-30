/**
 * Subscription Service - Lightweight wrapper around apiHelper
 * For new code, prefer using TanStack Query hooks from ../api/subscriptions
 */

import { apiHelper } from './api';

const subscriptionService = {
  initializeSubscription: async (data: any) => {
    const response = await apiHelper.post('/v1/subscriptions/initialize', data);
    return response;
  },

  // Alias for backward compatibility
  initialize: async (data: any) => {
    const response = await apiHelper.post('/v1/subscriptions/initialize', data);
    return response;
  },

  getSubscription: async (hostId: string) => {
    const response = await apiHelper.get(`/v1/subscriptions/${hostId}`);
    return response;
  },

  renewSubscription: async (hostId: string) => {
    const response = await apiHelper.post(`/v1/subscriptions/${hostId}/renew`);
    return response;
  },

  updatePlan: async (hostId: string, planId: string) => {
    const response = await apiHelper.put(`/v1/subscriptions/${hostId}/plan`, { planId });
    return response;
  },
};

export default subscriptionService;
