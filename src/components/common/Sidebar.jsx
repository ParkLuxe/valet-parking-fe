/**
 * Enhanced Sidebar Navigation Component
 * Features glassmorphism, smooth animations, and gradient highlights
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
  Car,
  FileText,
  DollarSign,
  Package,
  Calendar,
} from 'lucide-react';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import { cn } from '../../utils/cn';
import usePermissions from '../../hooks/usePermissions';

const drawerWidth = 260;

// Menu items configuration with permissions
const getAllMenuItems = () => [
  { path: '/dashboard', label: 'Dashboard', icon: Home, permission: null },
  { path: '/profile', label: 'Profile', icon: User, permission: null },
  { path: '/qr-scan', label: 'QR Scan & Entry', icon: QrCode, permission: 'canScanQR' },
  { path: '/qr-management', label: 'QR Management', icon: QrCode, permission: 'canManageQR' },
  { path: '/analytics', label: 'Analytics', icon: BarChart3, permission: 'canViewAnalytics' },
  { path: '/host-users', label: 'Host Users', icon: Users, permission: 'canManageUsers' },
  { path: '/parking-slots', label: 'Parking Slots', icon: ParkingSquare, permission: 'canManageParkingSlots' },
  { path: '/invoices', label: 'Invoices', icon: FileText, permission: 'canViewInvoices' },
  { path: '/payments', label: 'Payments', icon: DollarSign, permission: 'canViewPaymentHistory' },
  { path: '/subscription-plans', label: 'Subscription Plans', icon: Package, permission: 'canManageSubscription' },
  { path: '/subscription', label: 'Subscription', icon: CreditCard, permission: 'canManageSubscription' },
  { path: '/host-schedules', label: 'Operating Hours', icon: Calendar, permission: 'canManageSchedules' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { can } = usePermissions();
  
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  // Filter menu items based on permissions
  const menuItems = getAllMenuItems().filter(item => 
    !item.permission || can(item.permission)
  );

  const handleNavigate = (path) => {
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
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
          'w-64 glass-card border-r border-white/10',
          'flex flex-col',
          'lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-lg blur opacity-50" />
              <div className="relative bg-gradient-primary p-2 rounded-lg">
                <img 
                  src="/parkluxe-logo-192.png" 
                  alt="ParkLuxe Logo" 
                  className="w-6 h-6"
                />
              </div>
            </div>
            <span className="text-xl font-bold text-gradient-primary">
              Park-Luxe
            </span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-2 rounded-button hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-button',
                  'text-left font-medium transition-all duration-300',
                  'group relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-primary text-white shadow-glow-primary'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {/* Active indicator gradient */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-primary"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}

                {/* Icon with glow effect */}
                <div className="relative z-10">
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-transform duration-300',
                      isActive && 'drop-shadow-glow',
                      'group-hover:scale-110'
                    )}
                  />
                </div>

                {/* Label */}
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* User Profile Card at bottom */}
        <div className="p-4 border-t border-white/10">
          <div className="glass-card p-3 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
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
