/**
 * Payment Service - Lightweight wrapper around apiHelper
 * For new code, prefer using TanStack Query hooks from ../api/payments
 */

import { apiHelper } from './api';

const paymentService = {
  createOrder: async (invoiceId: string) => {
    const response = await apiHelper.post(`/v1/payments/create-order?invoiceId=${invoiceId}`);
    return response;
  },

  verifyPayment: async (paymentData: {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySignature?: string;
  }) => {
    // Handle both snake_case (from Razorpay) and camelCase formats
    const normalizedData = {
      razorpayPaymentId: paymentData.razorpayPaymentId || paymentData.razorpay_payment_id,
      razorpayOrderId: paymentData.razorpayOrderId || paymentData.razorpay_order_id,
      razorpaySignature: paymentData.razorpaySignature || paymentData.razorpay_signature,
    };
    const response = await apiHelper.post('/v1/payments/verify', normalizedData);
    return response;
  },

  getPaymentHistory: async (hostId: string, page: number = 0, size: number = 10) => {
    const response = await apiHelper.get(`/v1/payments/host/${hostId}?page=${page}&size=${size}`);
    return response;
  },

  getPaymentStats: async (hostId: string, startDate?: string, endDate?: string) => {
    let url = `/v1/payments/stats/${hostId}`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const queryString = params.toString();
    const response = await apiHelper.get(queryString ? `${url}?${queryString}` : url);
    return response;
  },
};

export default paymentService;
