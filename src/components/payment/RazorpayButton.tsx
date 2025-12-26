/**
 * Razorpay Payment Button Component
 * Handles payment flow with Razorpay integration
 */

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../common/Button';
import paymentService from '../../services/paymentService';
import { addToast } from '../../redux/slices/notificationSlice';
import { updateInvoice } from '../../redux/slices/invoiceSlice';
import { addPayment } from '../../redux/slices/paymentSlice';
import { RAZORPAY_KEY } from '../../utils/constants';



const RazorpayButton = ({ 
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
      const orderResponse = await paymentService.createOrder(invoiceId);
      
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
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyResponse = await paymentService.verifyPayment(verificationData);

            if (verifyResponse && verifyResponse.success) {
              // Update invoice status in Redux
              dispatch(updateInvoice({
                id: invoiceId,
                paymentStatus: 'PAID',
                paidDate: new Date().toISOString(),
              }));

              // Add payment to Redux
              dispatch(addPayment(verifyResponse.payment));

              // Show success message
              dispatch(addToast({
                type: 'success',
                message: 'Payment successful! Invoice has been paid.',
              }));

              // Call success callback
              if (onSuccess) {
                onSuccess(verifyResponse);
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            dispatch(addToast({
              type: 'error',
              message: error.message || 'Payment verification failed. Please contact support.',
            }));

            if (onFailure) {
              onFailure(error);
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
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        dispatch(addToast({
          type: 'error',
          message: `Payment failed: ${response.error.description || 'Unknown error'}`,
        }));
        
        if (onFailure) {
          onFailure(response.error);
        }
        
        setLoading(false);
      });

      razorpay.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      dispatch(addToast({
        type: 'error',
        message: error.message || 'Failed to initialize payment. Please try again.',
      }));
      
      if (onFailure) {
        onFailure(error);
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
