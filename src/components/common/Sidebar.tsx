/**
 * Sidebar — PARK-LUXE Command Center
 * Inline card panel, same rounded design as content. Collapses via hamburger.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Car,
  CreditCard,
  ShieldCheck,
  QrCode,
  Users,
  Calendar,
  FileText,
  Activity,
  Bug,
  HelpCircle,
  User,
  LogOut,
  PanelLeftClose,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { toggleSidebar, logout } from '../../redux';

import { usePermissions } from '../../hooks';
import type { RootState } from '../../redux';

const desktopDrawerWidth = 240;

// ─── Menu items ─────────────────────────────────────────────────────────────
const getAllMenuItems = () => [
  { path: '/dashboard',      label: 'Dashboard',      icon: LayoutDashboard, permission: null },
  { path: '/subscription',   label: 'Subscription',   icon: CreditCard,      permission: 'canManageSubscription' },
  { path: '/qr-scan',        label: 'QR Scanner',     icon: QrCode,          permission: 'canScanQR' },
  { path: '/host-management',label: 'Admin Console',  icon: ShieldCheck,     permission: 'canManageHosts' },
  { path: '/host-users',     label: 'Host Users',     icon: Users,           permission: 'canManageUsers' },
  { path: '/host-schedules', label: 'Operating Hours',icon: Calendar,        permission: 'canManageSchedules' },
  { path: '/invoices',       label: 'Invoices',       icon: FileText,        permission: 'canViewInvoices' },
  { path: '/customers',      label: 'Customers',      icon: Users,           permission: null },
  { path: '/my-vehicles',    label: 'My Vehicles',    icon: Car,             permission: 'canViewAssignedVehicles' },
  { path: '/my-performance', label: 'My Performance', icon: Activity,        permission: 'canViewOwnPerformance' },
  ...(process.env.NODE_ENV === 'development'
    ? [{ path: '/debug-protected', label: 'Debug', icon: Bug, permission: null }]
    : []),
];

const Sidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const { can }   = usePermissions();
  const { user }  = useSelector((state: RootState) => state.auth);
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { colors } = useTheme();

  // Calculate drawer width based on screen size
  const [drawerWidth, setDrawerWidth] = useState(desktopDrawerWidth);

  useEffect(() => {
    const calculateDrawerWidth = () => {
      // Mobile: full width minus padding (2 * 8px padding = 16px)
      // Desktop: fixed 240px
      const isMobile = window.innerWidth < 768;
      setDrawerWidth(isMobile ? window.innerWidth - 16 : desktopDrawerWidth);
    };

    calculateDrawerWidth();
    window.addEventListener('resize', calculateDrawerWidth);
    return () => window.removeEventListener('resize', calculateDrawerWidth);
  }, []);

  const menuItems = getAllMenuItems().filter((item: any) => {
    const permOk = !item.permission || can(item.permission);
    const roleOk = !item.roles || item.roles.includes((user as any)?.roleName);
    return permOk && roleOk;
  });

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? drawerWidth : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex-shrink-0 flex flex-col overflow-hidden"
      style={{
        borderRadius: drawerWidth === desktopDrawerWidth ? '22px' : '0px',
        background: sidebarOpen ? colors.sidebarBg : 'transparent',
        border: sidebarOpen ? `1px solid ${colors.sidebarBorder}` : 'none',
      }}
    >
      {/* Fixed-width inner wrapper so content doesn't reflow during animation */}
      <div className="flex flex-col h-full" style={{ width: drawerWidth, minWidth: drawerWidth }}>

        {/* ── Logo + collapse button ──────────────────────────────────── */}
        <div className="px-4 md:px-5 pt-4 md:pt-6 pb-4 md:pb-5 flex items-center justify-between">
          <p
            className={`font-bold tracking-[0.18em] leading-none uppercase ${
              sidebarOpen && drawerWidth !== desktopDrawerWidth ? 'text-base' : 'text-sm md:text-lg'
            }`}
            style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}
          >
            PARK-LUXE
          </p>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 rounded-[8px] transition-colors"
            style={{ color: colors.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.background = colors.hoverBg; e.currentTarget.style.color = colors.text; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.textMuted; }}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* ── Nav ────────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-2 md:px-3 space-y-1 pb-4">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleNavigate(item.path)}
                className="w-full flex items-center gap-2 md:gap-3.5 px-2 md:px-3.5 py-2.5 md:py-3 rounded-[12px] text-left transition-all duration-150 group relative"
                style={{
                  background: isActive ? colors.activeItemBg : 'transparent',
                  color: isActive ? colors.primaryLight : colors.textMuted,
                  border: isActive ? `1px solid ${colors.activeItemBorder}` : '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = colors.hoverBg;
                    e.currentTarget.style.color = colors.text;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = colors.textMuted;
                  }
                }}
              >
                <div
                  className="w-7 md:w-8 h-7 md:h-8 flex items-center justify-center rounded-[10px] flex-shrink-0 transition-colors"
                  style={{ background: isActive ? colors.activeIconBg : colors.hoverBg }}
                >
                  <Icon className="w-3.5 md:w-4 h-3.5 md:h-4" />
                </div>
                <span
                  className={`font-medium tracking-[0.02em] truncate ${
                    sidebarOpen && drawerWidth !== desktopDrawerWidth ? 'text-base' : 'text-xs md:text-[14px]'
                  }`}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeStripe"
                    className="absolute inset-y-2 right-2 w-1 rounded-full"
                    style={{ background: colors.activeStripe }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* ── Bottom section ─────────────────────────────────────────── */}
        <div
          className="px-2 md:px-3 pb-4 md:pb-5 space-y-1 pt-4"
          style={{ borderTop: `1px solid ${colors.divider}` }}
        >
          {/* Profile */}
          <button
            onClick={() => handleNavigate('/profile')}
            className="w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-[8px] transition-colors text-left"
            style={{ color: colors.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.background = colors.hoverBg; e.currentTarget.style.color = colors.text; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.textMuted; }}
          >
            <div className="w-7 md:w-8 h-7 md:h-8 flex items-center justify-center rounded-[8px]" style={{ background: colors.hoverBg }}>
              <User className="w-3.5 md:w-4 h-3.5 md:h-4" />
            </div>
            <span className={`font-medium ${
              sidebarOpen && drawerWidth !== desktopDrawerWidth ? 'text-base' : 'text-xs md:text-[14px]'
            }`} style={{ fontFamily: 'Outfit, sans-serif' }}>Profile</span>
          </button>

          {/* Help */}
          <button
            onClick={() => {}}
            className="w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-[8px] transition-colors text-left"
            style={{ color: colors.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.background = colors.hoverBg; e.currentTarget.style.color = colors.text; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.textMuted; }}
          >
            <div className="w-7 md:w-8 h-7 md:h-8 flex items-center justify-center rounded-[8px]" style={{ background: colors.hoverBg }}>
              <HelpCircle className="w-3.5 md:w-4 h-3.5 md:h-4" />
            </div>
            <span className={`font-medium ${
              sidebarOpen && drawerWidth !== desktopDrawerWidth ? 'text-base' : 'text-xs md:text-[14px]'
            }`} style={{ fontFamily: 'Outfit, sans-serif' }}>Help</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-[8px] transition-colors text-left"
            style={{ color: colors.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.10)'; e.currentTarget.style.color = '#fca5a5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.textMuted; }}
          >
            <div className="w-7 md:w-8 h-7 md:h-8 flex items-center justify-center rounded-[8px]" style={{ background: colors.hoverBg }}>
              <LogOut className="w-3.5 md:w-4 h-3.5 md:h-4" />
            </div>
            <span className={`font-medium ${
              sidebarOpen && drawerWidth !== desktopDrawerWidth ? 'text-base' : 'text-xs md:text-[14px]'
            }`} style={{ fontFamily: 'Outfit, sans-serif' }}>Logout</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
