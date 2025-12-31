/**
 * Razorpay Payment Button Component
 * Handles payment flow with Razorpay integration
 */

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button, { ButtonVariant } from '../common/Button';
import { useCreatePaymentOrder, useVerifyPayment } from '../../hooks/queries/usePayments';
import {  addToast  } from '../../redux';
import {  updateInvoice  } from '../../redux';
import {  addPayment  } from '../../redux';
import {  RAZORPAY_KEY  } from '../../utils';

interface PaymentVerificationResponse {
  success: boolean;
  payment: {
    id: string;
    amount: number;
    status: string;
    [key: string]: unknown;
  };
}

interface RazorpayError {
  code?: string;
  description?: string;
  source?: string;
  step?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

interface RazorpayButtonProps {
  invoiceId: string;
  amount: number;
  invoiceNumber: string;
  onSuccess: (response?: RazorpayResponse) => void;
  onFailure?: (error: RazorpayError | Error) => void;
  buttonText?: string;
  buttonVariant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({ 
  invoiceId, 
  amount, 
  invoiceNumber,
  onSuccess,
  onFailure,
  buttonText = 'Pay Now',
  buttonVariant = 'primary',
  disabled = false,
  className = '',
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  const createOrderMutation = useCreatePaymentOrder();
  const verifyPaymentMutation = useVerifyPayment();

  const handlePayment = async () => {
    if (!invoiceId) {
      dispatch(addToast({
        type: 'error',
        message: 'Invoice ID is required for payment',
      }));
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Razorpay order
      const orderResponse = await createOrderMutation.mutateAsync(invoiceId);
      
      if (!orderResponse || !orderResponse.razorpayOrderId) {
        throw new Error('Failed to create payment order');
      }

      const { razorpayOrderId, amount: orderAmount, currency } = orderResponse;

      // Step 2: Configure Razorpay options
      const options = {
        key: RAZORPAY_KEY,
        amount: orderAmount, // Amount in paise (already from backend)
        currency: currency || 'INR',
        name: 'Park-Luxe',
        description: `Payment for Invoice ${invoiceNumber || invoiceId}`,
        order_id: razorpayOrderId,
        handler: async function (response: RazorpayResponse) {
          try {
            // Step 3: Verify payment on backend
            const verificationData = {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            const verifyResponse = await verifyPaymentMutation.mutateAsync(verificationData) as PaymentVerificationResponse;

            if (verifyResponse && verifyResponse.success) {
              // Update invoice status in Redux
              dispatch(updateInvoice({
                id: invoiceId,
                paymentStatus: 'PAID',
                paidDate: new Date().toISOString(),
              }));

              // Add payment to Redux
              dispatch(addPayment(verifyResponse.payment));

              // Success toast already shown by mutation

              // Call success callback
              if (onSuccess) {
                onSuccess(verifyResponse);
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
            dispatch(addToast({
              type: 'error',
              message: errorMessage,
            }));
            
            if (onFailure) {
              onFailure(error instanceof Error ? error : new Error(errorMessage));
            }
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        notes: {
          invoice_id: invoiceId,
          invoice_number: invoiceNumber,
        },
        theme: {
          color: '#1976d2',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            dispatch(addToast({
              type: 'info',
              message: 'Payment cancelled',
            }));
          }
        }
      };

      // Step 4: Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response: { error: RazorpayError }) {
        const errorMessage = response.error?.description || 'Payment failed';
        dispatch(addToast({
          type: 'error',
          message: `Payment failed: ${errorMessage}`,
        }));
        
        if (onFailure) {
          onFailure(response.error);
        }
        
        setLoading(false);
      });

      razorpay.open();

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment';
      dispatch(addToast({
        type: 'error',
        message: errorMessage,
      }));
      
      if (onFailure) {
        onFailure(error instanceof Error ? error : new Error(errorMessage));
      }
      
      setLoading(false);
    }
  };

  return (
    <Button
      variant={buttonVariant}
      onClick={handlePayment}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? 'Processing...' : buttonText}
    </Button>
  );
};

export default RazorpayButton;
