/**
 * My Performance Page (Valet)
 * View personal performance metrics and statistics
 */

import React from 'react';
import { Activity, Car, CheckCircle, Clock } from 'lucide-react';
import Card from '../../components/common/Card';

const MyPerformance = () => {
  // Mock data - would be fetched from API
  const stats = {
    totalParked: 45,
    totalDelivered: 42,
    avgParkingTime: 8,
    avgDeliveryTime: 5,
    todayTasks: 12,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Performance</h1>
        <p className="text-white/60">Your performance metrics and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Car className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalParked}</div>
          <div className="text-white/60 text-sm">Total Parked</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.totalDelivered}
          </div>
          <div className="text-white/60 text-sm">Total Delivered</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.avgParkingTime}m
          </div>
          <div className="text-white/60 text-sm">Avg Parking Time</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.avgDeliveryTime}m
          </div>
          <div className="text-white/60 text-sm">Avg Delivery Time</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.todayTasks}</div>
          <div className="text-white/60 text-sm">Today's Tasks</div>
        </Card>
      </div>

      {/* Performance Charts */}
      <Card title="Weekly Performance" subtitle="Tasks completed this week">
        <div className="h-64 flex items-center justify-center text-white/50">
          <p>Performance chart would be implemented here</p>
        </div>
      </Card>

      <Card title="Daily Tasks" subtitle="Tasks breakdown by day">
        <div className="h-48 flex items-center justify-center text-white/50">
          <p>Daily tasks chart would be implemented here</p>
        </div>
      </Card>
    </div>
  );
};

export default MyPerformance;
