/**
 * Subscription Management Page - Enhanced
 * Beautiful plan cards, usage tracking, and payment history
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../types';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Zap,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, Button } from '../components';
import { formatCurrency, SUBSCRIPTION, cn } from '../utils';
import { useRazorpay } from '../hooks';
// Note: Import subscription slice actions directly
import { addPayment } from '../redux/slices/subscriptionSlice';

const Subscription = () => {
  const { status, usage, billing, paymentHistory } = useSelector((state: RootState) => (state as any).subscription || {});
  const dispatch = useDispatch();

  // Payment state management
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  // TODO: Replace with actual invoice ID from backend or state
  const invoiceId = 1;

  // Razorpay payment hook
  const { initiatePayment, loading: paymentLoading } = useRazorpay({
    invoiceId,
    onSuccess: (verificationData) => {
      // Create payment history entry
      const paymentEntry = {
        id: verificationData.paymentId || Date.now(),
        amount: billing.currentAmount,
        date: new Date().toISOString(),
        status: 'success',
      };

      // Update Redux store with payment history
      dispatch(addPayment(paymentEntry));

      // Show success message
      setPaymentSuccess('Payment successful! Your subscription has been renewed.');
      setPaymentError(null);
    },
    onFailure: (errorMessage) => {
      // Show error message
      setPaymentError(errorMessage);
      setPaymentSuccess(null);
    },
  });

  // Auto-dismiss success/error messages after 5 seconds
  React.useEffect(() => {
    let successTimer;
    let errorTimer;

    if (paymentSuccess) {
      successTimer = setTimeout(() => {
        setPaymentSuccess(null);
      }, 5000);
    }

    if (paymentError) {
      errorTimer = setTimeout(() => {
        setPaymentError(null);
      }, 5000);
    }

    // Cleanup timers on unmount
    return () => {
      if (successTimer) clearTimeout(successTimer);
      if (errorTimer) clearTimeout(errorTimer);
    };
  }, [paymentSuccess, paymentError]);

  // Handle payment button click
  const handlePayment = () => {
    initiatePayment();
  };

  const usagePercentage = (usage.usedScans / usage.totalScans) * 100;

  // Available plans
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 1000,
      scans: 100,
      overagePrice: 10,
      features: [
        'Up to 100 QR scans',
        'Basic analytics',
        'Email support',
        '3-day grace period',
        'Standard features',
      ],
      recommended: false,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 5000,
      scans: 600,
      overagePrice: 8,
      features: [
        'Up to 600 QR scans',
        'Advanced analytics',
        'Priority support',
        '7-day grace period',
        'All features included',
        'Custom branding',
      ],
      recommended: true,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 15000,
      scans: 2000,
      overagePrice: 5,
      features: [
        'Up to 2000 QR scans',
        'Real-time analytics',
        '24/7 phone support',
        '14-day grace period',
        'Premium features',
        'Dedicated account manager',
        'API access',
      ],
      recommended: false,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient-primary mb-2">
          Subscription Management
        </h1>
        <p className="text-white/70">
          Manage your subscription plans and billing information
        </p>
      </div>

      {/* Payment Success Alert */}
      {paymentSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3"
        >
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-green-400 font-semibold mb-1">Payment Successful</h4>
            <p className="text-green-300 text-sm">{paymentSuccess}</p>
          </div>
        </motion.div>
      )}

      {/* Payment Error Alert */}
      {paymentError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
        >
          <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-400 font-semibold mb-1">Payment Failed</h4>
            <p className="text-red-300 text-sm">{paymentError}</p>
          </div>
        </motion.div>
      )}

      {/* Grace Period Warning */}
      {status === 'grace_period' && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-yellow-400 font-semibold mb-1">Grace Period Active</h4>
            <p className="text-yellow-300 text-sm">
              You have exceeded your scan limit. Please make a payment to continue service uninterrupted.
            </p>
          </div>
        </div>
      )}

      {/* Current Subscription Card */}
      {status === 'active' || status === 'grace_period' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Usage Card */}
          <Card className="lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Current Plan: Starter</h2>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    )}>
                      {status === 'active' ? '✅ Active' : '⚠️ Grace Period'}
                    </span>
                  </div>
                </div>
                <Button variant="outline">
                  View All Plans
                </Button>
              </div>

              {/* Usage Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Scans Used</span>
                  <span className="text-white font-bold">
                    {usage.usedScans} / {usage.totalScans}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    transition={{ duration: 1 }}
                    className={cn(
                      'h-full',
                      status === 'active'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-400'
                    )}
                  />
                </div>
                <p className="text-white/50 text-sm mt-2">
                  {usagePercentage.toFixed(1)}% of monthly quota used
                </p>
              </div>

              {/* Billing Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white/50 text-sm mb-1">Billing Cycle</p>
                  <p className="text-white font-medium">Dec 1 - Dec 31, 2025</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm mb-1">Next Bill</p>
                  <p className="text-white font-medium">{formatCurrency(billing.currentAmount)}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Card */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Payment Due</h3>
              
              <div className="mb-6">
                <p className="text-white/50 text-sm mb-2">Amount</p>
                <p className="text-4xl font-bold text-gradient-primary">
                  {formatCurrency(billing.currentAmount)}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Base Plan</span>
                  <span className="text-white font-medium">{formatCurrency(SUBSCRIPTION.BASE_PRICE)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Overage (0 scans)</span>
                  <span className="text-white font-medium">{formatCurrency(0)}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-white font-bold">{formatCurrency(billing.currentAmount)}</span>
                </div>
              </div>

              <Button
                variant="gradient"
                className="w-full flex items-center justify-center gap-2"
                onClick={handlePayment}
                disabled={paymentLoading}
              >
                <CreditCard className="w-5 h-5" />
                {paymentLoading ? 'Processing...' : 'Pay with Razorpay'}
              </Button>

              <button className="w-full mt-3 text-white/70 hover:text-white text-sm transition-colors">
                View Invoice
              </button>
            </div>
          </Card>
        </div>
      ) : (
        /* No Subscription - Show Plans */
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Choose Your Perfect Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1 bg-gradient-primary rounded-full text-white text-sm font-medium shadow-glow-primary">
                      Recommended
                    </span>
                  </div>
                )}
                
                <Card className={cn(
                  'relative overflow-hidden',
                  plan.recommended && 'border-2 border-purple-500/50'
                )}>
                  {/* Background gradient */}
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-5',
                    plan.color
                  )} />
                  
                  <div className="relative p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gradient-primary">
                        {formatCurrency(plan.price)}
                      </span>
                      <span className="text-white/50 text-sm">/month</span>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-semibold">{plan.scans} QR scans</span>
                      </div>
                      <p className="text-white/50 text-sm">
                        {formatCurrency(plan.overagePrice)} per extra scan
                      </p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/70 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={plan.recommended ? 'gradient' : 'outline'}
                      className="w-full"
                    >
                      Select Plan
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <Card title="Payment History">
        <div className="p-6">
          {paymentHistory.length > 0 ? (
            <div className="space-y-3">
              {paymentHistory.map((payment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Payment #{payment.id}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <Calendar className="w-4 h-4" />
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">
                      {formatCurrency(payment.amount)}
                    </p>
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                      ✓ Paid
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No payment history yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Subscription;
