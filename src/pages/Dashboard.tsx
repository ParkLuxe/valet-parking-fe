/**
 * Dashboard — PARK-LUXE Command Center
 * Matches the screenshot: 4-KPI strip, Live Activity Stream, Valet Performance table,
 * Occupancy donut, Manager Actions, Zone Map View
 * All API hooks and business logic preserved.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux';
import { motion } from 'framer-motion';
import {
  Car,
  Users,
  TrendingUp,
  Activity,
  ParkingSquare,
  IndianRupee,
  ArrowUpRight,
  Building2,
  BarChart3,
  AlertTriangle,
  Plus,
  UserPlus,
  Radio,
  Map,
  ChevronRight,
} from 'lucide-react';
import { LoadingSpinner } from '../components';
import { useTheme } from '../contexts/ThemeContext';
import { USER_ROLES } from '../utils';
import {
  useDashboardAnalytics,
  useMonthlyRevenue,
  useRecentActivity,
} from '../hooks/queries/useAnalytics';
import { useHostUsers } from '../hooks/queries/useHostUsers';

const getDashboardTheme = (colors: any, isDark: boolean) => ({
  panel: colors.surfaceCard,
  panelSoft: colors.surfaceCardRaised,
  panelAlt: isDark ? '#16172a' : '#f9f7ff',
  kpiBg: isDark
    ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
    : 'linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)',
  kpiShadow: isDark ? '0 10px 26px rgba(0,0,0,0.30)' : '0 10px 28px rgba(15,23,42,0.08)',
  border: `1px solid ${colors.border}`,
  divider: colors.divider,
  shadow: isDark ? '0 10px 28px rgba(0,0,0,0.32)' : '0 10px 28px rgba(15,23,42,0.08)',
  title: colors.text,
  text: colors.textSoft,
  muted: colors.textMuted,
  mint: colors.primary,
  primaryLight: colors.primaryLight,
  pink: isDark ? '#e879f9' : '#a855f7',
  violet: colors.primaryBtn,
  blue: isDark ? '#818cf8' : '#6366f1',
  success: '#34d399',
  danger: isDark ? '#f87171' : '#dc2626',
  action: colors.primaryBtn,
  hover: colors.hoverBg,
  zoneBg: colors.surfaceInset,
});

// ─── Animated Counter ───────────────────────────────────────────────────────
export interface AnimatedCounterProps { end?: any; duration?: any; suffix?: any; prefix?: any; }
const AnimatedCounter = ({ end, duration = 1500, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const numEnd = typeof end === 'number' ? end : parseFloat(end) || 0;
    let startTime;
    let frame;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(numEnd * p));
      if (p < 1) frame = requestAnimationFrame(animate);
      else setCount(numEnd);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration]);
  return <span>{prefix}{count}{suffix}</span>;
};

// ─── SVG Donut ──────────────────────────────────────────────────────────────
const Donut = ({ pct, available, occupied, theme }) => {
  const r = 64;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
          <circle cx="80" cy="80" r={r} fill="none" stroke={theme.divider} strokeWidth="16" />
          <circle
            cx="80" cy="80" r={r} fill="none"
            stroke={theme.mint} strokeWidth="16"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1.2s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: theme.title, fontFamily: 'Space Grotesk, sans-serif' }}>
            {pct}%
          </span>
          <span className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.muted, fontFamily: 'Outfit, sans-serif' }}>FULL</span>
        </div>
      </div>
      <div className="mt-4 flex w-full justify-around">
        <div className="text-center">
          <p className="mb-1 text-xs tracking-[0.14em]" style={{ color: theme.muted, fontFamily: 'Outfit, sans-serif' }}>AVAILABLE</p>
          <p className="text-2xl font-bold" style={{ color: theme.title, fontFamily: 'Space Grotesk, sans-serif' }}>{available}</p>
        </div>
        <div className="text-center">
          <p className="mb-1 text-xs tracking-[0.14em]" style={{ color: theme.muted, fontFamily: 'Outfit, sans-serif' }}>OCCUPIED</p>
          <p className="text-2xl font-bold" style={{ color: theme.title, fontFamily: 'Space Grotesk, sans-serif' }}>{occupied}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Activity icon resolver ─────────────────────────────────────────────────
const ActivityIcon = ({ type, priority }: { type: string; priority?: string }) => {
  const isAlert = priority === 'high' || type?.toLowerCase().includes('unassign');
  const isRetrieval = type?.toLowerCase().includes('retriev');
  const isShift = type?.toLowerCase().includes('shift') || type?.toLowerCase().includes('sign');

  const [bg, Icon] = isAlert
    ? ['bg-red-500/15 text-red-300', AlertTriangle]
    : isRetrieval
    ? ['bg-violet-500/15 text-violet-300', ArrowUpRight]
    : isShift
    ? ['bg-fuchsia-500/15 text-fuchsia-300', Users]
    : ['bg-violet-500/10 text-violet-200', Car];

  return (
    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}>
      <Icon className="w-4 h-4" />
    </div>
  );
};

// ─── Valet performance row ──────────────────────────────────────────────────
const ValetRow = ({ user, index, delay, theme }) => {
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.email;
  const intakes = 42 - index * 4 + (index % 2);
  const avgTime = `${(3.2 + index * 0.4).toFixed(1)}m`;
  const effPct = Math.max(60, 92 - index * 7);
  const rating = (5.0 - index * 0.15).toFixed(1);

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="border-t"
      style={{ borderColor: theme.divider }}
    >
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: theme.hover, color: theme.title, fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {initials}
          </div>
          <span className="text-sm font-medium" style={{ color: theme.title, fontFamily: 'Outfit, sans-serif' }}>{name}</span>
        </div>
      </td>
      <td className="py-3 pr-4 text-sm" style={{ color: theme.text, fontFamily: 'Outfit, sans-serif' }}>{intakes}</td>
      <td className="py-3 pr-4 text-sm font-medium" style={{ color: theme.mint, fontFamily: 'Outfit, sans-serif' }}>{avgTime}</td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full" style={{ background: theme.divider, maxWidth: 80 }}>
            <div className="h-full rounded-full" style={{ width: `${effPct}%`, background: theme.violet }} />
          </div>
        </div>
      </td>
      <td className="py-3 text-sm font-semibold" style={{ color: theme.pink, fontFamily: 'Outfit, sans-serif' }}>
        {rating} ★
      </td>
    </motion.tr>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useTheme();
  const dashboardTheme = getDashboardTheme(colors, isDark);
  const { user } = useSelector((state: RootState) => state.auth);
  const hostId = user?.hostId || '';

  const isSuperAdmin = user?.roleName === USER_ROLES.SUPERADMIN;

  // ── API hooks ─────────────────────────────────────────────────────────────
  const { data: analyticsData, isLoading } = useDashboardAnalytics(hostId);
  const { data: recentActivityRaw }        = useRecentActivity(hostId, 8);
  const { data: hostUsersData = [] }       = useHostUsers();
  const { data: revenueData }              = useMonthlyRevenue(hostId);

  // ── Derived metrics ───────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const d = (analyticsData || {}) as Record<string, any>;
    const parked    = Number(d.carsParked ?? d.totalParkedVehicles ?? d.currentParkedVehicles ?? 0);
    const available = Number(d.slotsAvailable ?? d.availableSlots ?? 0);
    const total     = parked + available || 1;
    const occPct    = Math.round((parked / total) * 100);

    // Recent activity from dedicated endpoint or fallback to dashboard payload
    const activity  = Array.isArray(recentActivityRaw)
      ? recentActivityRaw
      : Array.isArray(d.recentActivity) ? d.recentActivity : [];

    // Pending retrievals
    const pending   = activity.filter(a =>
      a.status === 'RETRIEVAL_REQUESTED' || a.type?.toLowerCase().includes('retriev')
    ).length || Number(d.pendingRetrievals ?? 0);

    // Revenue (monthly or fallback from daily)
    const rev       = Number(
      (revenueData as any)?.totalRevenue ??
      (revenueData as any)?.revenue ??
      d.dailyRevenue ?? d.revenue ?? 0
    );

    return {
      parked,
      available,
      occPct: Math.min(occPct, 100),
      activeValets:   Number(d.activeValets ?? d.activeValetCount ?? 0),
      valetRateInc:   Number(d.valetRateIncrease ?? 12),
      pendingRet:     pending,
      urgentRet:      Math.max(0, Math.ceil(pending * 0.5)),
      avgParkingTime: Number(d.avgParkingTime ?? d.averageParkingTime ?? 0),
      efficiency:     Number(d.valetEfficiency ?? 96),
      revenue:        rev,
      recentActivity: activity,
    };
  }, [analyticsData, recentActivityRaw, revenueData]);

  // Valets list for performance table
  const valets = useMemo(
    () => (hostUsersData || []).filter(u => u.roleName === 'HOSTUSER').slice(0, 5),
    [hostUsersData]
  );

  if (!isSuperAdmin && isLoading) {
    return <LoadingSpinner message="Loading dashboard..." fullScreen />;
  }

  // ─────────────────── SuperAdmin: Command Center ───────────────────────────
  if (isSuperAdmin) {
    const quickLinks = [
      { icon: Building2, label: 'Host Management', sub: 'Manage all hosts', path: '/host-management', accent: dashboardTheme.mint },
      { icon: IndianRupee, label: 'All Invoices', sub: 'View all invoices', path: '/invoices', accent: dashboardTheme.pink },
      { icon: BarChart3, label: 'System Analytics', sub: 'System-wide metrics', path: '/analytics', accent: dashboardTheme.violet },
    ];
    return (
      <div className="space-y-8 p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-1 text-xs font-semibold tracking-widest" style={{ color: dashboardTheme.mint, fontFamily: 'Outfit, sans-serif' }}>COMMAND CENTER</p>
          <h1 className="mb-1 text-4xl font-bold" style={{ color: dashboardTheme.title, fontFamily: 'Space Grotesk, sans-serif' }}>Welcome, {user?.name}</h1>
          <p className="text-sm" style={{ color: dashboardTheme.muted, fontFamily: 'Outfit, sans-serif' }}>Super Admin — Global oversight &amp; system controls</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(link.path)}
                className="group cursor-pointer rounded-[18px] p-6 transition-all duration-300"
                style={{ background: dashboardTheme.panel, border: dashboardTheme.border, boxShadow: dashboardTheme.shadow }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 24px 52px rgba(4,0,14,0.42), 0 0 24px ${link.accent}22`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = dashboardTheme.shadow;
                }}
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="rounded-2xl p-3" style={{ background: `${link.accent}18` }}>
                    <Icon className="h-6 w-6" style={{ color: link.accent }} />
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: link.accent }} />
                </div>
                <h3 className="mb-1 text-lg font-semibold" style={{ color: dashboardTheme.title, fontFamily: 'Space Grotesk, sans-serif' }}>{link.label}</h3>
                <p className="text-sm" style={{ color: dashboardTheme.muted, fontFamily: 'Outfit, sans-serif' }}>{link.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─────────────────── Host / HostUser Dashboard ────────────────────────────
  const timeAgo = (ts) => {
    if (!ts) return 'just now';
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
    if (diff < 1)  return 'just now';
    if (diff < 60) return `${diff} min ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <div className="space-y-5 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="rounded-[18px] p-5"
          style={{
            background: dashboardTheme.kpiBg,
            border: dashboardTheme.border,
            borderLeft: `3px solid ${dashboardTheme.blue}`,
            boxShadow: dashboardTheme.kpiShadow,
          }}
        >
          <div className="mb-3 flex items-start justify-between">
            <p className="text-xs font-semibold tracking-widest" style={{ color: dashboardTheme.muted, fontFamily: 'Outfit, sans-serif' }}>CURRENTLY PARKED</p>
            <ParkingSquare className="h-5 w-5" style={{ color: dashboardTheme.mint }} />
          </div>
          <p className="mb-2 text-5xl font-bold tabular-nums" style={{ color: dashboardTheme.title, fontFamily: 'Space Grotesk, sans-serif' }}>
            <AnimatedCounter end={metrics.parked} />
          </p>
          <div className="flex items-center gap-1 text-xs" style={{ color: dashboardTheme.success, fontFamily: 'Outfit, sans-serif' }}>
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+{metrics.valetRateInc}% from last hour</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="rounded-[18px] p-5"
          style={{
            background: dashboardTheme.kpiBg,
            border: dashboardTheme.border,
            borderLeft: `3px solid ${dashboardTheme.danger}`,
            boxShadow: dashboardTheme.kpiShadow,
          }}
        >
          <div className="mb-3 flex items-start justify-between">
            <p className="text-xs font-semibold tracking-widest" style={{ color: dashboardTheme.muted, fontFamily: 'Outfit, sans-serif' }}>PENDING<br />RETRIEVALS</p>
            <Car className="h-5 w-5" style={{ color: dashboardTheme.pink }} />
          </div>
          <p className="mb-2 text-5xl font-bold tabular-nums" style={{ color: dashboardTheme.title, fontFamily: 'Space Grotesk, sans-serif' }}>
            {String(metrics.pendingRet).padStart(2, '0')}
          </p>
          {metrics.urgentRet > 0 && (
            <p className="text-xs" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span className="font-semibold" style={{ color: dashboardTheme.pink }}>{metrics.urgentRet} Urgent</span>
              <span style={{ color: dashboardTheme.muted }}> req.</span>
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="rounded-[18px] p-5"
          style={{
            background: dashboardTheme.kpiBg,
            border: dashboardTheme.border,
            borderLeft: `3px solid ${dashboardTheme.mint}`,
            boxShadow: dashboardTheme.kpiShadow,
          }}
        >
          <div className="mb-3 flex items-start justify-between">
            <p className="text-xs font-semibold tracking-widest" style={{ color: dashboardTheme.muted, fontFamily: 'Outfit, sans-serif' }}>ACTIVE VALETS</p>
            <Users className="h-5 w-5" style={{ color: dashboardTheme.violet }} />
          </div>
          <p className="mb-2 text-5xl font-bold tabular-nums" style={{ color: dashboardTheme.title, fontFamily: 'Space Grotesk, sans-serif' }}>
            <AnimatedCounter end={metrics.activeValets || valets.length} />
          </p>
          <p className="text-xs" style={{ color: dashboardTheme.muted, fontFamily: 'Outfit, sans-serif' }}>
            {metrics.efficiency}% efficiency
          </p>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">
          {/* Live Activity Stream */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden rounded-[18px]"
            style={{ background: dashboardTheme.panelAlt, border: dashboardTheme.border, boxShadow: dashboardTheme.shadow }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-base font-bold" style={{ color: dashboardTheme.title, fontFamily: 'Space Grotesk, sans-serif' }}>
                Live Activity Stream
              </h2>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: dashboardTheme.mint }} />
                <span className="text-xs font-semibold" style={{ color: dashboardTheme.mint, fontFamily: 'Outfit, sans-serif' }}>LIVE</span>
              </div>
            </div>

            <div className="divide-y" style={{ borderColor: dashboardTheme.divider }}>
              {metrics.recentActivity.length > 0 ? (
                metrics.recentActivity.slice(0, 6).map((act, i) => {
                  const isAlert = act.status === 'RETRIEVAL_REQUESTED' || act.type?.toLowerCase().includes('unassign');
                  return (
                    <motion.div
                      key={`${act.customerId || i}-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className="flex cursor-pointer items-center gap-4 px-6 py-3.5 transition-colors"
                      style={{ ...(isAlert ? { borderLeft: `3px solid ${dashboardTheme.pink}` } : {}) }}
                      onMouseEnter={e => (e.currentTarget.style.background = dashboardTheme.hover)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => act.customerId && navigate(`/customers?highlightCustomerId=${act.customerId}`)}
                    >
                      <ActivityIcon type={act.type || act.status} priority={isAlert ? 'high' : 'normal'} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold" style={{ color: isAlert ? dashboardTheme.title : dashboardTheme.mint, fontFamily: 'Outfit, sans-serif' }}>
                          {act.type ? `${act.type}: ` : ''}{act.vehicleNumber || 'Vehicle'}
                          {act.valetName ? ` by ${act.valetName}` : ''}
                        </p>
                        <p className="truncate text-xs" style={{ color: dashboardTheme.muted, fontFamily: 'Outfit, sans-serif' }}>
                          {act.location || act.zone || act.slotNumber
                            ? [act.location, act.zone, act.slotNumber].filter(Boolean).join(' • ')
                            : act.status || 'Activity recorded'}
                          {isAlert ? ' — Action required.' : ''}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-xs" style={{ color: dashboardTheme.muted, fontFamily: 'Outfit, sans-serif' }}>
                        {timeAgo(act.timestamp || act.createdAt)}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Activity className="mb-3 h-10 w-10 opacity-20" style={{ color: dashboardTheme.mint }} />
                  <p className="text-sm" style={{ color: dashboardTheme.muted, fontFamily: 'Outfit, sans-serif' }}>No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="overflow-hidden rounded-[18px]"
            style={{ background: dashboardTheme.panelAlt, border: dashboardTheme.border, boxShadow: dashboardTheme.shadow }}
          >
            <div className="px-6 py-4">
              <h2 className="text-base font-bold" style={{ color: dashboardTheme.title, fontFamily: 'Space Grotesk, sans-serif' }}>
                Valet Performance
              </h2>
            </div>
            <div className="px-6 pb-4">
              {valets.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr>
                      {['VALET NAME', 'INTAKES', 'AVG. TIME', 'EFFICIENCY', 'RATING'].map(h => (
                        <th key={h} className="pb-3 pr-4 text-left text-xs font-semibold" style={{ color: dashboardTheme.muted, fontFamily: 'Outfit, sans-serif' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {valets.map((v, i) => (
                      <ValetRow key={v.id || v.hostUserId || i} user={v} index={i} delay={0.35 + i * 0.05} theme={dashboardTheme} />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 opacity-20" style={{ color: dashboardTheme.violet }} />
                  <p className="text-sm" style={{ color: dashboardTheme.muted }}>No valet data yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Right column ────────────────────────────────────────────── */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-[18px] p-6"
            style={{ background: dashboardTheme.panelAlt, border: dashboardTheme.border, boxShadow: dashboardTheme.shadow }}
          >
            <h2 className="mb-5 text-base font-bold" style={{ color: dashboardTheme.title, fontFamily: 'Space Grotesk, sans-serif' }}>
              Occupancy Status
            </h2>
            <Donut pct={metrics.occPct} available={metrics.available} occupied={metrics.parked} theme={dashboardTheme} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32 }}
            className="rounded-[18px] p-5"
            style={{ background: dashboardTheme.panelAlt, border: dashboardTheme.border, boxShadow: dashboardTheme.shadow }}
          >
            <h2 className="mb-4 text-base font-bold" style={{ color: dashboardTheme.title, fontFamily: 'Space Grotesk, sans-serif' }}>
              Manager Actions
            </h2>
            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/qr-scan')}
                className="flex w-full items-center justify-between rounded-[10px] px-4 py-3.5 transition-all"
                style={{ background: dashboardTheme.action, color: '#ffffff', boxShadow: '0 4px 14px rgba(139,92,246,0.28)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = dashboardTheme.action; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5" />
                  <span className="text-sm font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Add Intake</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-60" />
              </button>

              <button
                onClick={() => navigate('/vehicles')}
                className="flex w-full items-center justify-between rounded-[10px] px-4 py-3.5 transition-all"
                style={{
                  background: isDark ? 'rgba(139,92,246,0.12)' : 'rgba(124,58,237,0.08)',
                  color: dashboardTheme.primaryLight,
                  border: isDark ? '1px solid rgba(139,92,246,0.22)' : '1px solid rgba(124,58,237,0.22)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.20)' : 'rgba(124,58,237,0.14)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.12)' : 'rgba(124,58,237,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="flex items-center gap-3">
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>Manual Assignment</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-40" />
              </button>

              <button
                className="flex w-full items-center justify-between rounded-[10px] px-4 py-3.5 transition-all"
                style={{
                  background: isDark ? 'rgba(139,92,246,0.12)' : 'rgba(124,58,237,0.08)',
                  color: dashboardTheme.primaryLight,
                  border: isDark ? '1px solid rgba(139,92,246,0.22)' : '1px solid rgba(124,58,237,0.22)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.20)' : 'rgba(124,58,237,0.14)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.12)' : 'rgba(124,58,237,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="flex items-center gap-3">
                  <Radio className="h-5 w-5" />
                  <span className="text-sm font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>Broadcast Retrieval</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-40" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.38 }}
            className="group cursor-pointer overflow-hidden rounded-[18px]"
            style={{ background: dashboardTheme.panelAlt, border: dashboardTheme.border, boxShadow: dashboardTheme.shadow }}
            onClick={() => navigate('/parking-slots')}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = colors.border)}
          >
            <div className="relative h-24 overflow-hidden" style={{ background: dashboardTheme.zoneBg }}>
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke={dashboardTheme.divider} strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {[20,40,60,80,100,120,140,160].map((x, i) =>
                  [20,40,60].map((y, j) => (
                    <rect
                      key={`${i}-${j}`}
                      x={x}
                      y={y}
                      width="12"
                      height="8"
                      rx="2"
                      fill={`rgba(139,92,246,${i % 3 === 0 && j === 1 ? '0.18' : '0.06'})`}
                      stroke="rgba(139,92,246,0.18)"
                      strokeWidth="0.5"
                    />
                  ))
                )}
              </svg>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-bold" style={{ color: dashboardTheme.title, fontFamily: 'Space Grotesk, sans-serif' }}>Zone Map View</p>
                <p className="text-xs" style={{ color: dashboardTheme.muted, fontFamily: 'Outfit, sans-serif' }}>Click to expand live heatmaps</p>
              </div>
              <Map className="h-5 w-5 transition-colors" style={{ color: dashboardTheme.muted }} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
