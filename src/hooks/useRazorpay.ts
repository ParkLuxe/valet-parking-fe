/**
 * Custom hook for Razorpay payment integration
 * Handles payment order creation, checkout initialization, and payment verification
 * Uses TanStack Query mutations for API calls.
 */

import { useState } from 'react';
import { useCreateRazorpayOrder, useVerifyRazorpayPayment } from './queries/usePayments';

interface UseRazorpayOptions {
  invoiceId: string | number;
  onSuccess?: (data: unknown) => void;
  onFailure?: (message: string) => void;
}

const useRazorpay = ({ invoiceId, onSuccess, onFailure }: UseRazorpayOptions) => {
  const [error, setError] = useState<string | null>(null);

  const createOrderMutation = useCreateRazorpayOrder();
  const verifyPaymentMutation = useVerifyRazorpayPayment();

  const loading = createOrderMutation.isPending || verifyPaymentMutation.isPending;

  const initiatePayment = async () => {
    setError(null);

    try {
      const orderData = await createOrderMutation.mutateAsync(String(invoiceId));

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'ParkLuxe Valet Parking',
        description: 'Subscription Payment',
        image: '/parkluxe-logo.png',
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone,
        },
        theme: {
          color: '#8B5CF6',
        },
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            const verificationData = await verifyPaymentMutation.mutateAsync({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            if (onSuccess) {
              onSuccess(verificationData);
            }
          } catch (verifyErr) {
            const errorMessage = (verifyErr as Error)?.message || 'Payment verification failed';
            setError(errorMessage);
            onFailure?.(errorMessage);
          }
        },
        modal: {
          ondismiss: function () {
            const dismissMessage = 'Payment cancelled by user';
            setError(dismissMessage);
            onFailure?.(dismissMessage);
          },
        },
      };

      if (typeof window === 'undefined' || !(window as unknown as { Razorpay?: unknown }).Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
      }

      const razorpay = new (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay(options);
      razorpay.open();
    } catch (err) {
      const errorMessage = (err as Error)?.message || 'Failed to create payment order';
      setError(errorMessage);
      onFailure?.(errorMessage);
    }
  };

  return {
    initiatePayment,
    loading,
    error,
  };
};

export default useRazorpay;
