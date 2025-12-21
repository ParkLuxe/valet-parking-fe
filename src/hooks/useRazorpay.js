/**
 * Custom hook for Razorpay payment integration
 * Handles payment order creation, checkout initialization, and payment verification
 */

import { useState } from 'react';
import { apiHelper } from '../services/api';
import { RAZORPAY_KEY } from '../utils/constants';

const useRazorpay = ({ invoiceId, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Initiates the Razorpay payment process
   */
  const initiatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create order with backend
      const orderData = await apiHelper.post(
        `/v1/payment/create-order?invoiceId=${invoiceId}`
      );

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'ParkLuxe Valet Parking',
        description: 'Subscription Payment',
        image: '/logo192.png',
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone,
        },
        theme: {
          color: '#8B5CF6', // Purple brand color
        },
        handler: async function (response) {
          // Step 3: Verify payment with backend
          try {
            const verificationData = await apiHelper.post('/v1/payment/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            setLoading(false);
            
            // Call success callback with verification data
            if (onSuccess) {
              onSuccess(verificationData);
            }
          } catch (verifyError) {
            setLoading(false);
            const errorMessage = verifyError?.message || 'Payment verification failed';
            setError(errorMessage);
            
            if (onFailure) {
              onFailure(errorMessage);
            }
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            const dismissMessage = 'Payment cancelled by user';
            setError(dismissMessage);
            
            if (onFailure) {
              onFailure(dismissMessage);
            }
          },
        },
      };

      // Create Razorpay instance and open checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      setLoading(false);
      const errorMessage = err?.message || 'Failed to create payment order';
      setError(errorMessage);
      
      if (onFailure) {
        onFailure(errorMessage);
      }
    }
  };

  return {
    initiatePayment,
    loading,
    error,
  };
};

export default useRazorpay;
