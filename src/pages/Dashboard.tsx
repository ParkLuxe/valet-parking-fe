/**
 * Enhanced Dashboard Page with Premium Analytics
 * Features animated counters, glassmorphism cards, and real-time updates
 * Role-based rendering: Stats for Host/HostAdmin, minimal for SuperAdmin
 */

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux';
import { motion } from 'framer-motion';
import {
  Car,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  ParkingSquare,
} from 'lucide-react';
import { Card, LoadingSpinner } from '../components';
import { setMetrics } from '../redux';
import { formatDuration, cn, USER_ROLES } from '../utils';

// Animated Counter Component
export interface AnimatedCounterProps {
  end?: any;
  duration?: any;
  suffix?: any;
}

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

// Enhanced Metric Card Component
const MetricCard = ({ title, value, icon: Icon, trend, trendValue, delay = 0 }) => {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card hover glow className="group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-white/60 text-sm mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-white mb-2 animate-count-up">
              {typeof value === 'number' ? (
                <AnimatedCounter end={value} />
              ) : (
                value
              )}
            </h3>
            {trend && (
              <div className={cn(
                'flex items-center gap-1 text-sm',
                isPositive ? 'text-success' : 'text-error'
              )}>
                <TrendIcon className="w-4 h-4" />
                <span>{trendValue}%</span>
                <span className="text-white/50 ml-1">vs last month</span>
              </div>
            )}
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-lg blur opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-primary p-3 rounded-lg group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Activity status colors and icons
const getStatusStyle = (status) => {
  const styles = {
    'Being Assigned': { color: 'bg-warning/20 text-warning border-warning', dot: 'bg-warning' },
    'Parking In Progress': { color: 'bg-primary/20 text-primary border-primary', dot: 'bg-primary' },
    'Parked': { color: 'bg-success/20 text-success border-success', dot: 'bg-success' },
    'Out for Delivery': { color: 'bg-accent/20 text-accent border-accent', dot: 'bg-accent' },
    'Delivered': { color: 'bg-white/20 text-white border-white/30', dot: 'bg-white' },
  };
  return styles[status] || styles['Parked'];
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { metrics = {}, loading = false } = useSelector((state: RootState) => (state as any).analytics || {});
  const { activeVehicles = [] } = useSelector((state: RootState) => (state as any).vehicles || {});

  // Check if user is SuperAdmin
  const isSuperAdmin = user?.role === USER_ROLES.SUPERADMIN;
  // Check if user is Host/HostAdmin (should see stats)
  const isHostAdmin = user?.role === USER_ROLES.HOSTADMIN;

  useEffect(() => {
    // Fetch dashboard metrics only for Host/HostAdmin
    if (isHostAdmin) {
      // TODO: Replace with actual API call
      dispatch(setMetrics({
        activeValets: 5,
        carsParked: 12,
        avgParkingTime: 8,
        avgDeliveryTime: 5,
      }));
    }
  }, [dispatch, isHostAdmin]);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." fullScreen />;
  }

  // SuperAdmin Dashboard - Minimal
  if (isSuperAdmin) {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-white/60">
            SuperAdmin Dashboard - Manage hosts and system settings
          </p>
        </motion.div>

        {/* Quick Links for SuperAdmin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-primary rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Host Management</h3>
                <p className="text-white/60 text-sm">Manage all hosts</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-primary rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">All Invoices</h3>
                <p className="text-white/60 text-sm">View all invoices</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-primary rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">System Analytics</h3>
                <p className="text-white/60 text-sm">System-wide metrics</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Host/HostAdmin and HostUser Dashboard - With Stats
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-white/60">
          Here's what's happening with your valet parking today.
        </p>
      </motion.div>

      {/* Metrics Cards Grid - Only for Host/HostAdmin */}
      {isHostAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Valets"
            value={metrics.activeValets}
            icon={Users}
            trend="up"
            trendValue={12}
            delay={0}
          />
          <MetricCard
            title="Cars Parked"
            value={metrics.carsParked}
            icon={Car}
            trend="up"
            trendValue={8}
            delay={0.1}
          />
          <MetricCard
            title="Avg Parking Time"
            value={formatDuration(metrics.avgParkingTime)}
            icon={Clock}
            trend="down"
            trendValue={5}
            delay={0.2}
          />
          <MetricCard
            title="Revenue Today"
            value="₹2,400"
            icon={DollarSign}
            trend="up"
            trendValue={15}
            delay={0.3}
          />
        </div>
      )}

      {/* Activity and Stats Grid - Only for Host/HostAdmin */}
      {isHostAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card title="Recent Activity" className="h-full">
              {activeVehicles.length > 0 ? (
                <div className="space-y-3">
                  {activeVehicles.slice(0, 5).map((vehicle, index) => {
                    const statusStyle = getStatusStyle(vehicle.status);
                    return (
                      <motion.div
                        key={vehicle.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-button bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className={cn('w-2 h-2 rounded-full', statusStyle.dot)} />
                            <div className={cn('absolute inset-0 w-2 h-2 rounded-full animate-ping', statusStyle.dot)} />
                          </div>
                          <div>
                            <p className="text-white font-medium group-hover:text-primary transition-colors">
                              {vehicle.vehicleNumber}
                            </p>
                            <p className="text-white/50 text-sm">
                              {vehicle.valetName} • Slot {vehicle.parkingSlot}
                            </p>
                          </div>
                        </div>
                        <div className={cn(
                          'px-3 py-1 rounded-button text-sm font-medium border',
                          statusStyle.color
                        )}>
                          {vehicle.status}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="w-12 h-12 text-white/30 mb-3" />
                  <p className="text-white/60">No recent activity</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Quick Stats - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Today's Stats Card */}
            <Card title="Today's Overview" className="h-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-button bg-gradient-primary/10 border border-primary/20">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Total Vehicles</p>
                    <p className="text-2xl font-bold text-white">
                      <AnimatedCounter end={24} />
                    </p>
                  </div>
                  <Car className="w-8 h-8 text-primary" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-button bg-gradient-accent/10 border border-accent/20">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-white">
                      ₹<AnimatedCounter end={2400} />
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-accent" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-button bg-success/10 border border-success/20">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Available Slots</p>
                    <p className="text-2xl font-bold text-white">8 / 20</p>
                  </div>
                  <ParkingSquare className="w-8 h-8 text-success" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
