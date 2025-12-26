/**
 * Enhanced Header Component with Glassmorphism
 * Features backdrop blur, dropdown menus, and smooth animations
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import {  toggleSidebar  } from '../../redux';
import {  logout  } from '../../redux';
import {  getInitials  } from '../../utils';
import type {  RootState  } from '../../redux';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  
  const [showNotifications, setShowNotifications] = useState(false);

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-30 glass-card border-b border-white/10"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Menu button */}
        <button
          onClick={handleToggleSidebar}
          className="p-2 rounded-button hover:bg-white/10 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        {/* Center: Page title (can be dynamic) */}
        <div className="flex-1 lg:ml-64">
          {/* Empty for now, can add breadcrumbs or search */}
        </div>

        {/* Right: Notifications and User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications Dropdown */}
          <DropdownMenu.Root open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenu.Trigger asChild>
              <button className="relative p-2 rounded-button hover:bg-white/10 transition-colors">
                <Bell className="w-6 h-6 text-white" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>
            </DropdownMenu.Trigger>

            <AnimatePresence>
              {showNotifications && (
                <DropdownMenu.Portal forceMount>
                  <DropdownMenu.Content asChild>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card p-4 mt-2 w-80 rounded-card shadow-lg"
                    >
                      <h3 className="text-white font-semibold mb-3">Notifications</h3>
                      <div className="space-y-2">
                        {unreadCount === 0 ? (
                          <p className="text-white/50 text-sm text-center py-4">
                            No new notifications
                          </p>
                        ) : (
                          <p className="text-white/70 text-sm">
                            You have {unreadCount} unread notifications
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              )}
            </AnimatePresence>
          </DropdownMenu.Root>

          {/* User Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-3 p-2 rounded-button hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold ring-2 ring-primary/30">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-white/50 text-xs">
                    {user?.role || 'Role'}
                  </p>
                </div>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card p-2 mt-2 w-56 rounded-card shadow-lg"
                >
                  {/* User info */}
                  <div className="px-3 py-2 mb-2 border-b border-white/10">
                    <p className="text-white font-semibold">{user?.name}</p>
                    <p className="text-white/50 text-sm">{user?.email}</p>
                  </div>

                  {/* Menu items */}
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={handleProfile}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-button text-white hover:bg-white/10 transition-colors text-left"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-button text-white hover:bg-white/10 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-white/10 my-2" />

                  <DropdownMenu.Item asChild>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-button text-error hover:bg-error/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </DropdownMenu.Item>
                </motion.div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
