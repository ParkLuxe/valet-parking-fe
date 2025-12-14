/**
 * Analytics Dashboard Page
 * Displays comprehensive metrics, charts, and performance data
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Car,
  DollarSign,
  CreditCard,
} from 'lucide-react';
import Card from '../components/common/Card';
import { cn } from '../utils/cn';
import { formatCurrency } from '../utils/helpers';

// Mock data generators
const generateVehicleData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => ({
    month,
    vehicles: Math.floor(Math.random() * 100) + 50 + index * 10,
    revenue: Math.floor(Math.random() * 50000) + 30000 + index * 5000,
  }));
};

const generateVehicleTypeData = () => [
  { name: 'Sedan', value: 450, color: '#667eea' },
  { name: 'SUV', value: 320, color: '#764ba2' },
  { name: 'Hatchback', value: 280, color: '#f093fb' },
  { name: 'Luxury', value: 150, color: '#4facfe' },
  { name: 'Bike', value: 200, color: '#00f2fe' },
];

const generateUserRegistrationData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    users: Math.floor(Math.random() * 30) + 10 + index * 2,
  }));
};

const generateValetPerformance = () => [
  { name: 'John Smith', vehicles: 245, rating: 4.8, efficiency: 92 },
  { name: 'Sarah Johnson', vehicles: 230, rating: 4.9, efficiency: 95 },
  { name: 'Mike Davis', vehicles: 215, rating: 4.7, efficiency: 88 },
  { name: 'Emily Brown', vehicles: 198, rating: 4.6, efficiency: 85 },
  { name: 'David Wilson', vehicles: 182, rating: 4.5, efficiency: 82 },
];

const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState('month');

  // Generate data
  const vehicleData = useMemo(() => generateVehicleData(), []);
  const vehicleTypeData = useMemo(() => generateVehicleTypeData(), []);
  const userRegistrationData = useMemo(() => generateUserRegistrationData(), []);
  const valetPerformance = useMemo(() => generateValetPerformance(), []);

  // Calculate metrics
  const totalVehicles = vehicleData.reduce((sum, item) => sum + item.vehicles, 0);
  const totalRevenue = vehicleData.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = userRegistrationData.reduce((sum, item) => sum + item.users, 0);
  const activeSubscriptions = 42;

  const metrics = [
    {
      icon: Users,
      label: 'Total Users',
      value: totalUsers.toString(),
      change: '+12%',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Car,
      label: 'Vehicles Parked',
      value: totalVehicles.toString(),
      change: '+18%',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: DollarSign,
      label: 'Revenue This Month',
      value: formatCurrency(totalRevenue / vehicleData.length),
      change: '+24%',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: CreditCard,
      label: 'Active Subscriptions',
      value: activeSubscriptions.toString(),
      change: '+8%',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const timeFilters = [
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  // Custom tooltip styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Revenue') ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-white/70">
            Comprehensive insights into your parking operations
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex gap-2">
          {timeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setTimeFilter(filter.id)}
              className={cn(
                'px-4 py-2 rounded-button font-medium transition-all',
                timeFilter === filter.id
                  ? 'bg-gradient-primary text-white shadow-glow-primary'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden group hover:scale-105 transition-transform">
                {/* Background gradient */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity',
                  metric.color
                )} />
                
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      'p-3 rounded-lg bg-gradient-to-br',
                      metric.color
                    )}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-400 text-sm font-medium">
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-white/60 text-sm">
                    {metric.label}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Vehicles Parked Over Time - Line Chart */}
        <Card title="Vehicles Parked Over Time" className="col-span-1">
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vehicleData}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#fff" opacity={0.7} />
                <YAxis stroke="#fff" opacity={0.7} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Line
                  type="monotone"
                  dataKey="vehicles"
                  stroke="#667eea"
                  strokeWidth={3}
                  fill="url(#lineGradient)"
                  dot={{ fill: '#667eea', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue Over Time - Bar Chart */}
        <Card title="Revenue Over Time" className="col-span-1">
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#fff" opacity={0.7} />
                <YAxis stroke="#fff" opacity={0.7} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar
                  dataKey="revenue"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Revenue (₹)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Vehicle Type Distribution - Pie Chart */}
        <Card title="Vehicle Type Distribution" className="col-span-1">
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {vehicleTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white/70 text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* User Registrations - Area Chart */}
        <Card title="User Registrations (This Week)" className="col-span-1">
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userRegistrationData}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#fff" opacity={0.7} />
                <YAxis stroke="#fff" opacity={0.7} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#4facfe"
                  strokeWidth={2}
                  fill="url(#areaGradient)"
                  name="New Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Valet Performance Table */}
      <Card title="Valet Performance Rankings">
        <div className="p-6">
          <div className="space-y-4">
            {valetPerformance.map((valet, index) => (
              <motion.div
                key={valet.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                {/* Rank Badge */}
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold text-white',
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                  'bg-white/10'
                )}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>

                {/* Valet Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{valet.name}</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white/70">
                        {valet.vehicles} vehicles
                      </span>
                      <span className="text-yellow-400">
                        ⭐ {valet.rating}
                      </span>
                    </div>
                  </div>
                  
                  {/* Efficiency Progress Bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-white/50 text-xs w-20">Efficiency</span>
                    <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${valet.efficiency}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                      />
                    </div>
                    <span className="text-white text-sm font-medium w-12">
                      {valet.efficiency}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
