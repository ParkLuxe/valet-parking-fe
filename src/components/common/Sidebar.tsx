/**
 * Enhanced Sidebar Navigation Component
 * Clean UI with minimal borders, better spacing and visual hierarchy
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  QrCode,
  BarChart3,
  Users,
  ParkingSquare,
  CreditCard,
  User,
  ChevronLeft,
  FileText,
  DollarSign,
  Package,
  Calendar,
  Building2,
  Settings,
  TrendingUp,
  Car,
  Activity,
  FileLineChart,
  Bug,
} from 'lucide-react';
import { toggleSidebar } from '../../redux';
import { cn } from '../../utils';
import { usePermissions } from '../../hooks';
import type { RootState } from '../../redux';

const drawerWidth = 260;

// Menu items configuration with permissions
const getAllMenuItems = () => [
  // Common
  { path: '/dashboard', label: 'Dashboard', icon: Home, permission: null },
  { path: '/profile', label: 'Profile', icon: User, permission: null },
  
  // SuperAdmin Only
  { path: '/host-management', label: 'Hosts Management', icon: Building2, permission: 'canManageHosts' },
  { path: '/subscription-plans-crud', label: 'Subscription Plans', icon: Package, permission: 'canManageSubscriptionPlans' },
  { path: '/all-payments', label: 'All Payments', icon: DollarSign, permission: 'canViewAllPayments' },
  { path: '/super-admin-analytics', label: 'System Analytics', icon: TrendingUp, permission: 'canViewSystemAnalytics' },
  { path: '/system-settings', label: 'System Settings', icon: Settings, permission: 'canManageSystemSettings' },
  
  // Host Admin
  { path: '/vehicle-management', label: 'Vehicles', icon: Car, permission: 'canManageVehicles' },
  { path: '/parking-slots', label: 'Parking Slots', icon: ParkingSquare, permission: 'canManageParkingSlots' },
  { path: '/qr-management', label: 'QR Codes', icon: QrCode, permission: 'canManageQR' },
  { path: '/host-users', label: 'Host Users', icon: Users, permission: 'canManageUsers' },
  { path: '/host-schedules', label: 'Operating Hours', icon: Calendar, permission: 'canManageSchedules' },
  { path: '/analytics', label: 'Analytics', icon: BarChart3, permission: 'canViewAnalytics' },
  { path: '/reports', label: 'Reports', icon: FileLineChart, permission: 'canViewReports' },
  { path: '/invoices', label: 'Invoices', icon: FileText, permission: 'canViewInvoices' },
  { path: '/payments', label: 'Payments', icon: DollarSign, permission: 'canViewPaymentHistory' },
  { path: '/subscription', label: 'Subscription', icon: CreditCard, permission: 'canManageSubscription' },
  
  // Valet/Host User
  { path: '/my-vehicles', label: 'My Vehicles', icon: Car, permission: 'canViewAssignedVehicles' },
  { path: '/qr-scan', label: 'QR Scanner', icon: QrCode, permission: 'canScanQR' },
  { path: '/my-performance', label: 'My Performance', icon: Activity, permission: 'canViewOwnPerformance' },
  
  // Debug (dev environment only)
  ...(process.env.NODE_ENV === 'development' ? [
    { path: '/debug-protected', label: 'Debug Dashboard', icon: Bug, permission: null },
  ] : []),
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { can } = usePermissions();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  // Filter menu items based on permissions
  const menuItems = getAllMenuItems().filter(item => 
    !item.permission || can(item.permission)
  );

  const handleNavigate = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 900) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleSidebar())}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -drawerWidth,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          'fixed left-0 top-0 h-screen z-50',
          'w-64 bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]',
          'flex flex-col shadow-2xl',
          'lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-lg opacity-60" />
              <div className="relative bg-gradient-primary p-2.5 rounded-xl shadow-lg">
                <img 
                  src="/parkluxe-logo-192.png" 
                  alt="ParkLuxe Logo" 
                  className="w-6 h-6"
                />
              </div>
            </div>
            <span className="text-xl font-bold text-white">
              Park-Luxe
            </span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl',
                  'text-left font-medium transition-all duration-200',
                  'group relative',
                  isActive
                    ? 'bg-gradient-primary text-white shadow-lg shadow-primary/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-primary rounded-xl"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}

                {/* Icon */}
                <div className={cn(
                  'relative z-10 transition-transform duration-200',
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                )}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Label */}
                <span className="relative z-10 text-sm">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* User Profile Card at bottom */}
        <div className="p-4 pt-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-semibold shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-white/50 text-xs truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
