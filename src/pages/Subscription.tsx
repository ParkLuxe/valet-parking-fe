/**
 * Subscription Management Page - Enhanced
 * Beautiful plan cards, usage tracking, and payment history
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type {  RootState  } from '../redux';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  AlertCircle,
  Zap,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, Button, Modal, Input, LoadingSpinner } from '../components';
import {  formatCurrency  } from '../utils';
import { cn } from '../utils';
import { useRazorpay } from '../hooks';
import { appendPaymentHistory } from '../redux';
import { useActiveSubscriptionPlans } from '../hooks/queries/useSubscriptionPlans';
import {
  useInitializeSubscription,
  useChangeSubscriptionPlan,
  useSubscription,
} from '../hooks/queries/useSubscriptions';
import { useTheme } from '../contexts/ThemeContext';

const Subscription = () => {
  const { colors, isDark } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const { status, usage, billing } = useSelector((state: RootState) => (state as any).subscription || {});
  const dispatch = useDispatch();
  const { data: activePlansData = [] } = useActiveSubscriptionPlans();
  const initializeSubscriptionMutation = useInitializeSubscription();
  const changePlanMutation = useChangeSubscriptionPlan();
  const hostId = (user as any)?.hostId || '';
  const { data: currentSubscription } = useSubscription(hostId);

  // Payment state management
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [manualSelectedPlanId, setManualSelectedPlanId] = useState<string>('');
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [planFormErrors, setPlanFormErrors] = useState<Record<string, string>>({});
  const [planFormData, setPlanFormData] = useState({
    planName: '',
    description: '',
    monthlyPrice: '',
    scanLimit: '',
    features: '',
  });

  const plansRaw = Array.isArray(activePlansData)
    ? activePlansData
    : activePlansData?.content || [];
  const plans = plansRaw.slice(0, 3);

  // TODO: Replace with actual invoice ID from backend or state
  const invoiceId = 1;

  // Razorpay payment hook
  const { initiatePayment, loading: paymentLoading } = useRazorpay({
    invoiceId,
    onSuccess: (verificationData: { paymentId?: string }) => {
      // Create payment history entry
      const paymentEntry = {
        id: verificationData?.paymentId || Date.now(),
        amount: billing.currentAmount,
        date: new Date().toISOString(),
        status: 'success',
      };

      // Update Redux store with payment history
      dispatch(appendPaymentHistory(paymentEntry));

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

  const usagePercentage = (usage?.usedScans / usage?.totalScans) * 100;

  const getPlanName = (plan: any) => plan?.planName || plan?.name || 'Subscription Plan';
  const getPlanId = (plan: any) => String(plan?.planId || plan?.id || '');
  const getPlanDescription = (plan: any) => plan?.planDescription || plan?.description || '';
  const getPlanPrice = (plan: any) => Number(plan?.monthlyPrice ?? plan?.basePrice ?? plan?.initialPackageAmount ?? 0);
  const getPlanScanLimit = (plan: any) => Number(plan?.scanLimit ?? plan?.baseScans ?? plan?.initialScansCount ?? 0);
  const getInitialScanPrice = (plan: any) => Number(plan?.initialScanPrice ?? 0);
  const getPerScanPrice = (plan: any) => Number(plan?.perScanPrice ?? plan?.additionalScanPrice ?? 0);
  const getInitialPackageAmount = (plan: any) => Number(plan?.initialPackageAmount ?? plan?.monthlyPrice ?? plan?.basePrice ?? 0);
  const getGracePeriodDays = (plan: any) => Number(plan?.gracePeriodDays ?? 0);
  const getAdminAccountLimit = (plan: any) => Number(plan?.adminAccountLimit ?? 0);
  const getValetAccountLimit = (plan: any) => Number(plan?.valetAccountLimit ?? 0);
  const getPlanFeatures = (plan: any): string[] => {
    if (Array.isArray(plan?.features)) return plan.features;
    if (typeof plan?.features === 'string' && plan.features.trim()) {
      return plan.features.split(',').map((item: string) => item.trim()).filter(Boolean);
    }
    if (Array.isArray(plan?.featureList)) return plan.featureList;
    return [];
  };

  const currentPlanIdFromSubscription = String(currentSubscription?.planId || '');
  const currentPlanId =
    currentPlanIdFromSubscription ||
    String(currentSubscription?.plan?.planId || currentSubscription?.plan?.id || '');

  const formatDateValue = (dateValue: string | null | undefined) =>
    dateValue
      ? new Date(dateValue).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'N/A';

  const subscriptionStatusValue = String(
    currentSubscription?.subscriptionStatus || status || 'PENDING'
  ).toUpperCase();
  const scansUsedValue = Number(currentSubscription?.scansUsed ?? usage?.usedScans ?? 0);
  const scansTotalValue = Number(currentSubscription?.initialScansCount ?? usage?.totalScans ?? 0);
  const scansRemainingValue = Number(currentSubscription?.scansRemaining ?? usage?.remainingScans ?? 0);
  const currentUsagePercentage = scansTotalValue > 0
    ? (scansUsedValue / scansTotalValue) * 100
    : usagePercentage || 0;

  const pageText = { color: colors.text };
  const mutedText = { color: colors.textMuted };
  const softText = { color: colors.textSoft };
  const insetPanel = { background: colors.surfaceCardRaised, border: `1px solid ${colors.border}` };
  const textareaStyle = {
    background: colors.surfaceCard,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    boxShadow: '0 1px 2px rgba(15,23,42,0.05)',
  } as React.CSSProperties;

  const currentPlanIndex = plans.findIndex(
    (plan) => String(getPlanId(plan)) === String(currentPlanId)
  );
  const selectedPlanId =
    manualSelectedPlanId ||
    currentPlanId ||
    (plans.length ? getPlanId(plans[0]) : '');

  // Check if any mutations are loading
  const isLoading = initializeSubscriptionMutation.isPending || changePlanMutation.isPending;

  const openCreatePlanModal = (plan: any) => {
    const features = getPlanFeatures(plan);
    setSelectedPlan(plan);
    setManualSelectedPlanId(getPlanId(plan));
    setPlanFormData({
      planName: getPlanName(plan),
      description: plan?.description || plan?.planDescription || '',
      monthlyPrice: String(getPlanPrice(plan)),
      scanLimit: String(getPlanScanLimit(plan)),
      features: features.join('\n'),
    });
    setPlanFormErrors({});
    setShowCreatePlanModal(true);
  };

  const handlePlanFormChange = (e: any) => {
    const { name, value } = e.currentTarget;
    setPlanFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (planFormErrors[name]) {
      setPlanFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validatePlanForm = () => {
    const errors: Record<string, string> = {};
    if (!planFormData.planName.trim()) {
      errors.planName = 'Plan name is required';
    }
    if (!planFormData.monthlyPrice || Number(planFormData.monthlyPrice) <= 0) {
      errors.monthlyPrice = 'Monthly price must be greater than 0';
    }
    if (!planFormData.scanLimit || Number(planFormData.scanLimit) <= 0) {
      errors.scanLimit = 'Scan limit must be greater than 0';
    }
    setPlanFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePlanForm() || !selectedPlan) {
      return;
    }

    try {
      const selectedPlanId = String(
        selectedPlan?.planId || selectedPlan?.id || ''
      );

      if (!hostId || !selectedPlanId) {
        setPaymentSuccess(null);
        setPaymentError('Host or selected plan information is missing.');
        return;
      }

      if (currentSubscription) {
        await changePlanMutation.mutateAsync({
          hostId,
          newPlanId: selectedPlanId,
        });
      } else {
        await initializeSubscriptionMutation.mutateAsync({
          hostId,
          planId: selectedPlanId,
        });
      }

      dispatch(appendPaymentHistory({
        id: Date.now(),
        amount: Number(planFormData.monthlyPrice),
        date: new Date().toISOString(),
        status: 'success',
        planName: planFormData.planName,
        scanLimit: Number(planFormData.scanLimit),
      }));

      setPaymentSuccess(`Subscription updated to "${planFormData.planName}" successfully.`);
      setPaymentError(null);
      setShowCreatePlanModal(false);
      setManualSelectedPlanId(selectedPlanId);
      setSelectedPlan(null);
    } catch (error) {
      setPaymentSuccess(null);
      setPaymentError('Failed to update subscription. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Updating subscription..." fullScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}>
          Subscription Management
        </h1>
        <p style={mutedText}>
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
      {subscriptionStatusValue === 'GRACE_PERIOD' && (
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
      {currentSubscription ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Usage Card */}
          <Card className="lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1" style={pageText}>
                    Current Plan: {currentSubscription?.planName || 'N/A'}
                  </h2>
                  <p className="text-sm mb-2" style={mutedText}>
                    Host: {currentSubscription?.hostName || 'N/A'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      subscriptionStatusValue === 'ACTIVE'
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    )}>
                      {subscriptionStatusValue === 'ACTIVE'
                        ? 'ACTIVE'
                        : subscriptionStatusValue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Usage Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span style={mutedText}>Scans Used</span>
                  <span className="font-bold" style={pageText}>
                    {scansUsedValue} / {scansTotalValue}
                  </span>
                </div>
                <div className="w-full rounded-full h-4 overflow-hidden" style={{ background: colors.divider }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(currentUsagePercentage, 100)}%` }}
                    transition={{ duration: 1 }}
                    className={cn(
                      'h-full',
                      subscriptionStatusValue === 'ACTIVE'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-400'
                    )}
                  />
                </div>
                <p className="text-sm mt-2" style={mutedText}>
                  {currentUsagePercentage.toFixed(1)}% of monthly quota used
                </p>
              </div>

              {/* Billing Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg" style={insetPanel}>
                <div>
                  <p className="text-sm mb-1" style={mutedText}>Billing Cycle Start</p>
                  <p className="font-medium" style={pageText}>{formatDateValue(currentSubscription?.currentBillingCycleStart)}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={mutedText}>Billing Cycle End</p>
                  <p className="font-medium" style={pageText}>{formatDateValue(currentSubscription?.currentBillingCycleEnd)}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={mutedText}>Next Billing Date</p>
                  <p className="font-medium" style={pageText}>{formatDateValue(currentSubscription?.nextBillingDate)}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={mutedText}>Scans Remaining</p>
                  <p className="font-medium" style={pageText}>{scansRemainingValue}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Card */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4" style={pageText}>Payment Due</h3>
              
              <div className="mb-6">
                <p className="text-sm mb-2" style={mutedText}>Amount</p>
                <p className="text-4xl font-bold" style={{ color: colors.text }}>
                  {formatCurrency(Number(currentSubscription?.pendingAmount ?? billing.currentAmount ?? 0))}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span style={mutedText}>Initial package amount</span>
                  <span className="font-medium" style={pageText}>{formatCurrency(Number(currentSubscription?.initialPackageAmount ?? 0))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={mutedText}>Current cycle charges</span>
                  <span className="font-medium" style={pageText}>{formatCurrency(Number(currentSubscription?.currentCycleCharges ?? 0))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={mutedText}>Amount paid</span>
                  <span className="font-medium" style={pageText}>{formatCurrency(Number(currentSubscription?.amountPaid ?? 0))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={mutedText}>Per scan price</span>
                  <span className="font-medium" style={pageText}>{formatCurrency(Number(currentSubscription?.perScanPrice ?? 0))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={mutedText}>Grace period</span>
                  <span className="font-medium" style={pageText}>{Number(currentSubscription?.gracePeriodDays ?? 0)} days</span>
                </div>
                <div className="h-px" style={{ background: colors.divider }} />
                <div className="flex justify-between">
                  <span className="font-semibold" style={pageText}>Pending amount</span>
                  <span className="font-bold" style={pageText}>{formatCurrency(Number(currentSubscription?.pendingAmount ?? 0))}</span>
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

              <button className="w-full mt-3 text-sm transition-colors" style={mutedText}>
                View Invoice
              </button>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Plans Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center" style={pageText}>
          Select Subscription Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const features = getPlanFeatures(plan);
            const planId = getPlanId(plan);
            const isCurrentPlan = currentPlanIndex > -1 && index === currentPlanIndex;
            const isSelectedPlan = selectedPlanId === planId;
            const actionLabel = isCurrentPlan
              ? 'Current Plan'
              : currentPlanIndex === -1
                ? 'Select Plan'
                : index < currentPlanIndex
                  ? 'Downgrade'
                  : 'Upgrade';

            return (
              <motion.div
                key={plan.id || plan.planId || `${getPlanName(plan)}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative"
              >
                {isSelectedPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-3 py-1 rounded-full text-white text-xs font-medium" style={{ background: colors.primaryBtn, boxShadow: isDark ? '0 0 18px rgba(139,92,246,0.24)' : '0 8px 18px rgba(139,92,246,0.18)' }}>
                      Selected
                    </span>
                  </div>
                )}

                <Card className={cn('relative overflow-hidden', isSelectedPlan && 'border-2 border-primary/60')}>
                  <div className="relative p-6">
                    <h3 className="text-2xl font-bold mb-2" style={pageText}>{getPlanName(plan)}</h3>
                    {!!getPlanDescription(plan) && (
                      <p className="text-sm mb-4" style={mutedText}>{getPlanDescription(plan)}</p>
                    )}

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gradient-primary">
                        {formatCurrency(getPlanPrice(plan))}
                      </span>
                      <span className="text-sm" style={mutedText}>/month</span>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <span className="font-semibold" style={pageText}>{getPlanScanLimit(plan)} QR scans</span>
                      </div>

                      <div className="space-y-1 text-sm" style={softText}>
                        <div className="flex justify-between gap-2">
                          <span>Initial scans</span>
                          <span style={pageText}>{getPlanScanLimit(plan)}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>Initial scan price</span>
                          <span style={pageText}>{formatCurrency(getInitialScanPrice(plan))}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>Per scan price</span>
                          <span style={pageText}>{formatCurrency(getPerScanPrice(plan))}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>Initial package amount</span>
                          <span style={pageText}>{formatCurrency(getInitialPackageAmount(plan))}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>Grace period</span>
                          <span style={pageText}>{getGracePeriodDays(plan)} days</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>Admin accounts</span>
                          <span style={pageText}>{getAdminAccountLimit(plan)}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span>Valet accounts</span>
                          <span style={pageText}>{getValetAccountLimit(plan)}</span>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {features.length > 0 ? (
                        features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm" style={softText}>{feature}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm" style={mutedText}>No additional features listed</li>
                      )}
                    </ul>

                    <Button
                      variant={isCurrentPlan ? 'outline' : 'gradient'}
                      className="w-full"
                      disabled={isCurrentPlan}
                      onClick={() => openCreatePlanModal(plan)}
                    >
                      {actionLabel}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Modal
        open={showCreatePlanModal}
        onClose={() => {
          setShowCreatePlanModal(false);
          setSelectedPlan(null);
        }}
        title="Create Plan"
      >
        <form onSubmit={handleCreatePlanSubmit} className="space-y-4">
          <Input
            label="Plan Name"
            name="planName"
            value={planFormData.planName}
            onChange={handlePlanFormChange}
            error={!!planFormErrors.planName}
            helperText={planFormErrors.planName}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Monthly Price"
              name="monthlyPrice"
              type="number"
              value={planFormData.monthlyPrice}
              onChange={handlePlanFormChange}
              error={!!planFormErrors.monthlyPrice}
              helperText={planFormErrors.monthlyPrice}
              required
            />
            <Input
              label="Scan Limit"
              name="scanLimit"
              type="number"
              value={planFormData.scanLimit}
              onChange={handlePlanFormChange}
              error={!!planFormErrors.scanLimit}
              helperText={planFormErrors.scanLimit}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={mutedText}>Description</label>
            <textarea
              name="description"
              value={planFormData.description}
              onChange={handlePlanFormChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg focus:outline-none"
              style={textareaStyle}
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={mutedText}>Features (one per line)</label>
            <textarea
              name="features"
              value={planFormData.features}
              onChange={handlePlanFormChange}
              rows={5}
              className="w-full px-4 py-2 rounded-lg focus:outline-none"
              style={textareaStyle}
            />
          </div>

          {selectedPlan && (
            <p className="text-xs" style={mutedText}>
              Auto-populated from selected plan template.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowCreatePlanModal(false);
                setSelectedPlan(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={initializeSubscriptionMutation.isPending || changePlanMutation.isPending}
            >
              Submit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Subscription;
