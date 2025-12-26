/**
 * SuperAdmin Analytics Page
 * System-wide analytics and metrics for SuperAdmin
 */

import React from 'react';
import { TrendingUp, Users, Building2, DollarSign } from 'lucide-react';
import Card from '../../components/common/Card';

const SuperAdminAnalytics = () => {
  // Mock data - would be fetched from API
  const stats = {
    totalHosts: 15,
    totalUsers: 127,
    totalRevenue: 125000,
    activeSubscriptions: 12,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">System Analytics</h1>
        <p className="text-white/60">System-wide metrics and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalHosts}</div>
          <div className="text-white/60 text-sm">Total Hosts</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</div>
          <div className="text-white/60 text-sm">Total Users</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            ₹{stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-white/60 text-sm">Total Revenue</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.activeSubscriptions}
          </div>
          <div className="text-white/60 text-sm">Active Subscriptions</div>
        </Card>
      </div>

      {/* Placeholder for charts */}
      <Card title="Revenue Trends" subtitle="Monthly revenue overview">
        <div className="h-64 flex items-center justify-center text-white/50">
          <p>Chart visualization would be implemented here</p>
        </div>
      </Card>

      <Card title="Top Performing Hosts" subtitle="Hosts by revenue">
        <div className="h-48 flex items-center justify-center text-white/50">
          <p>Host performance chart would be implemented here</p>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminAnalytics;
