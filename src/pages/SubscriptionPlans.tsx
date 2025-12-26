/**
 * Subscription Plans Page
 * View and manage subscription plans
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type {  RootState  } from '../redux';
import { Card } from '../components';
import { Button } from '../components';
import { LoadingSpinner } from '../components';
import { subscriptionPlanService } from '../services';
import { subscriptionService } from '../services';
import {  addToast  } from '../redux';
import {  formatCurrency  } from '../utils';
import { usePermissions } from '../hooks';

const SubscriptionPlans = () => {
  const dispatch = useDispatch();
  const { can, isRole } = usePermissions();
  const { user } = useSelector((state: RootState) => state.auth);

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  useEffect(() => {
    fetchPlans();
    if (user?.hostId && can('canManageSubscription')) {
      fetchCurrentSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = isRole('SUPERADMIN')
        ? await subscriptionPlanService.getAllPlans()
        : await subscriptionPlanService.getActivePlans();
      setPlans(response || []);
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to load subscription plans',
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const response = await subscriptionService.getSubscription(user.hostId);
      setCurrentSubscription(response);
    } catch (err) {
      console.error('Failed to fetch current subscription:', err);
    }
  };

  const handleSelectPlan = async (planId) => {
    if (!user?.hostId) return;

    if (!window.confirm('Are you sure you want to change your subscription plan?')) {
      return;
    }

    try {
      setLoading(true);
      if (currentSubscription) {
        await subscriptionService.updatePlan(user.hostId, planId);
        dispatch(addToast({
          type: 'success',
          message: 'Subscription plan updated successfully',
        }));
      } else {
        await subscriptionService.initialize({
          hostId: user.hostId,
          planId: planId,
        });
        dispatch(addToast({
          type: 'success',
          message: 'Subscription initialized successfully',
        }));
      }
      fetchCurrentSubscription();
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to update subscription plan',
      }));
    } finally {
      setLoading(false);
    }
  };

  const getPlanBadgeClass = (planType) => {
    const typeMap = {
      STANDARD: 'bg-blue-100 text-blue-800',
      PREMIUM: 'bg-purple-100 text-purple-800',
      CUSTOM: 'bg-green-100 text-green-800',
    };
    return typeMap[planType] || 'bg-gray-100 text-gray-800';
  };

  if (!can('canManageSubscription') && !can('canManageSubscriptionPlans')) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          You don't have permission to view subscription plans.
        </div>
      </div>
    );
  }

  if (loading && plans.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
        <p className="text-gray-600 mt-1">Choose the plan that fits your business needs</p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Current Plan</h3>
              <p className="text-blue-700 mt-1">
                {currentSubscription.planName || 'Active Subscription'}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Status: <span className="font-semibold">{currentSubscription.status}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Monthly Cost</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(currentSubscription.monthlyCost || 0)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.planId === plan.id;
          
          return (
            <Card
              key={plan.id}
              className={`relative ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}
            >
              {isCurrentPlan && (
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">{plan.planName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanBadgeClass(plan.planType)}`}>
                    {plan.planType}
                  </span>
                </div>
                {plan.description && (
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{formatCurrency(plan.basePrice || 0)}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                {plan.includeScans && (
                  <p className="text-sm text-gray-600 mt-2">
                    Includes {plan.includeScans} scans
                  </p>
                )}
                {plan.perScanCost && (
                  <p className="text-sm text-gray-600">
                    Additional scans: {formatCurrency(plan.perScanCost)} each
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-sm text-gray-700">Features:</h4>
                {plan.features?.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                )) || (
                  <>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">QR Code Management</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Vehicle Tracking</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Analytics Dashboard</span>
                    </div>
                  </>
                )}
              </div>

              {can('canChangeSubscriptionPlan') && !isCurrentPlan && (
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className="w-full"
                  disabled={loading}
                >
                  {currentSubscription ? 'Switch to Plan' : 'Select Plan'}
                </Button>
              )}

              {isCurrentPlan && (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {plans.length === 0 && !loading && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No subscription plans available</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionPlans;
