/**
 * Analytics Dashboard — Valet Mobile Operations Design
 * Super Admin Valet Performance screen pattern
 * Elite Circle leaderboard, KPI tiles, charts
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, Car, DollarSign, CreditCard, Star, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils';

// ─── Mock data generators (unchanged) ─────────────────────────────────
const generateVehicleData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => ({
    month,
    vehicles: 60 + index * 15 + (index % 2) * 8,
    revenue: 35000 + index * 6000 + (index % 3) * 2000,
  }));
};

const generateVehicleTypeData = () => [
  { name: 'Sedan',    value: 450, color: '#8b5cf6' },
  { name: 'SUV',      value: 320, color: '#e9c349' },
  { name: 'Hatchback',value: 280, color: '#a78bfa' },
  { name: 'Luxury',   value: 150, color: '#4ade80' },
  { name: 'Bike',     value: 200, color: '#fb923c' },
];

const generateUserRegistrationData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({ day, users: 15 + index * 3 + (index % 3) * 5 }));
};

const generateValetPerformance = () => [
  { name: 'Julian Thorne',   venue: 'Grand Hotel Indigo',  rating: 4.99, sessions: 142 },
  { name: 'Elena Rossi',     venue: 'The Obsidian Club',   rating: 4.97, sessions: 201 },
  { name: 'Marcus Sterling', venue: 'Ritz-Carlton Sky',    rating: 4.94, sessions: 88  },
  { name: 'Alex Mercer',     venue: 'Park-Luxe Terminal A',rating: 4.91, sessions: 174 },
  { name: 'Sarah Taylor',    venue: 'Marina Bay Valet',    rating: 4.88, sessions: 130 },
];

// ─── Custom tooltip ────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-4 py-3 rounded-[0.375rem]" style={{ background: '#222a3d', border: '1px solid rgba(139,92,246,0.1)', fontFamily: 'Inter, sans-serif' }}>
        <p className="text-sm font-semibold mb-2" style={{ color: '#dae2fd' }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.name.includes('Revenue') || entry.name.includes('revenue') ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── KPI tile ─────────────────────────────────────────────────────────
const KPITile = ({ icon: Icon, label, value, change, accent, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-6 rounded-[12px] relative overflow-hidden group"
    style={{ background: '#171f33', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-[0.375rem]" style={{ background: `${accent}18` }}>
        <Icon className="w-6 h-6" style={{ color: accent }} />
      </div>
      <span className="text-sm font-semibold" style={{ color: '#4ade80', fontFamily: 'Inter, sans-serif' }}>
        <TrendingUp className="w-3.5 h-3.5 inline mr-1" />{change}
      </span>
    </div>
    <div className="text-3xl font-bold mb-1" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>
      {value}
    </div>
    <div className="text-sm" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>{label}</div>
  </motion.div>
);

// ─── Analytics page ────────────────────────────────────────────────────
const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState('month');

  const vehicleData        = useMemo(() => generateVehicleData(), []);
  const vehicleTypeData    = useMemo(() => generateVehicleTypeData(), []);
  const userRegistration   = useMemo(() => generateUserRegistrationData(), []);
  const valetPerformance   = useMemo(() => generateValetPerformance(), []);

  const totalVehicles      = vehicleData.reduce((s, d) => s + d.vehicles, 0);
  const totalRevenue       = vehicleData.reduce((s, d) => s + d.revenue, 0);
  const totalUsers         = userRegistration.reduce((s, d) => s + d.users, 0);

  const timeFilters = [
    { id: 'day',    label: 'Today'       },
    { id: 'week',   label: 'This Week'   },
    { id: 'month',  label: 'This Month'  },
    { id: 'custom', label: 'Custom Range'},
  ];

  const chartGrid = 'rgba(255,255,255,0.06)';
  const chartAxis = '#909097';

  return (
    <div className="space-y-7 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: '#8b5cf6', fontFamily: 'Inter, sans-serif' }}>PERFORMANCE CENTER</p>
          <h1 className="text-4xl font-bold mb-1" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>Analytics</h1>
          <p className="text-sm" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>
            Comprehensive insights into valet operations
          </p>
        </div>
        <div className="flex gap-2">
          {timeFilters.map(f => (
            <button
              key={f.id}
              onClick={() => setTimeFilter(f.id)}
              className="px-3 py-1.5 rounded-[0.375rem] text-xs font-semibold transition-all"
              style={{
                background: timeFilter === f.id ? '#8b5cf6' : 'rgba(139,92,246,0.07)',
                color: timeFilter === f.id ? '#0b1326' : '#909097',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* KPI tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPITile icon={Users}      label="Total Users"          value={totalUsers}                                      change="+12%"  accent="#8b5cf6" delay={0}    />
        <KPITile icon={Car}        label="Vehicles Parked"       value={totalVehicles}                                   change="+18%"  accent="#e9c349" delay={0.07} />
        <KPITile icon={DollarSign} label="Revenue This Month"    value={formatCurrency(totalRevenue / vehicleData.length)} change="+24%" accent="#4ade80" delay={0.14} />
        <KPITile icon={CreditCard} label="Active Subscriptions"  value={42}                                              change="+8%"   accent="#a78bfa" delay={0.21} />
      </div>

      {/* Charts 2×2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Vehicles over time */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="p-6 rounded-[12px]" style={{ background: '#171f33', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <h3 className="text-base font-bold mb-5" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>Vehicles Parked Over Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={vehicleData}>
              <defs>
                <linearGradient id="vLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
              <XAxis dataKey="month" stroke={chartAxis} tick={{ fill: chartAxis, fontSize: 11 }} />
              <YAxis stroke={chartAxis} tick={{ fill: chartAxis, fontSize: 11 }} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="vehicles" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="p-6 rounded-[12px]" style={{ background: '#171f33', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <h3 className="text-base font-bold mb-5" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={vehicleData}>
              <defs>
                <linearGradient id="revBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#e9c349" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#af8d11" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
              <XAxis dataKey="month" stroke={chartAxis} tick={{ fill: chartAxis, fontSize: 11 }} />
              <YAxis stroke={chartAxis} tick={{ fill: chartAxis, fontSize: 11 }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="revenue" fill="url(#revBar)" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User registrations */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="p-6 rounded-[12px]" style={{ background: '#171f33', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <h3 className="text-base font-bold mb-5" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>User Registrations (This Week)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={userRegistration}>
              <defs>
                <linearGradient id="regArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
              <XAxis dataKey="day" stroke={chartAxis} tick={{ fill: chartAxis, fontSize: 11 }} />
              <YAxis stroke={chartAxis} tick={{ fill: chartAxis, fontSize: 11 }} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="users" stroke="#a78bfa" strokeWidth={2} fill="url(#regArea)" name="New Users" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Vehicle type breakdown */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="p-6 rounded-[12px]" style={{ background: '#171f33', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <h3 className="text-base font-bold mb-5" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>Vehicle Type Breakdown</h3>
          <div className="space-y-3">
            {vehicleTypeData.map((type, i) => {
              const max = vehicleTypeData[0].value;
              const pct = Math.round((type.value / max) * 100);
              return (
                <div key={type.name}>
                  <div className="flex justify-between text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span style={{ color: '#c6c6cd' }}>{type.name}</span>
                    <span style={{ color: type.color }}>{type.value} vehicles</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.4 + i * 0.08 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${type.color}aa, ${type.color})` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Elite Circle — Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-[12px]" style={{ background: '#171f33', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Star className="w-5 h-5" style={{ color: '#e9c349' }} />
          <h3 className="text-base font-bold" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>Elite Circle</h3>
          <span className="text-xs px-2 py-0.5 rounded-full ml-1" style={{ background: 'rgba(233,195,73,0.12)', color: '#e9c349', fontFamily: 'Inter, sans-serif' }}>
            Top performing valets
          </span>
        </div>

        <div className="space-y-2">
          {valetPerformance.map((valet, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const initials = valet.name.split(' ').map(n => n[0]).join('').toUpperCase();
            const accent = i === 0 ? '#e9c349' : i === 1 ? '#c6c6cd' : i === 2 ? '#fb923c' : '#8b5cf6';
            return (
              <motion.div
                key={valet.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.07 }}
                className="flex items-center gap-4 px-4 py-3 rounded-[0.375rem] transition-all"
                style={{ background: 'rgba(139,92,246,0.03)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.03)')}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: `${accent}22`, color: accent, fontFamily: 'Manrope, sans-serif' }}>
                  {initials}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>{valet.name}</span>
                    {i < 3 && <span className="text-xs">{medals[i]}</span>}
                  </div>
                  <p className="text-xs" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>{valet.venue}</p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-0.5">
                    <Star className="w-3.5 h-3.5" style={{ color: '#e9c349' }} />
                    <span className="text-sm font-bold" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>{valet.rating}</span>
                  </div>
                  <p className="text-xs" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>{valet.sessions} sessions</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
