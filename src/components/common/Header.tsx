/**
 * Enhanced Header Component
 * Valet Mobile Operations — Operational Elegance Design System
 * Midnight dark background, cyan avatar highlight, Manrope/Inter typography
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
  Sun,
  Moon,
} from 'lucide-react';
import { toggleSidebar } from '../../redux';
import { logout } from '../../redux';
import { getInitials } from '../../utils';
import type { RootState } from '../../redux';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  const { isDark, toggle, colors } = useTheme();
  
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
    <motion.div
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative z-40"
      style={{
        background: colors.contentBg,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-center justify-between px-6 py-4 lg:px-8">
        {/* Left: Menu button */}
        <button
          onClick={handleToggleSidebar}
          className="p-2 rounded-[0.375rem] transition-colors"
          style={{ color: colors.text }}
          onMouseEnter={e => (e.currentTarget.style.background = colors.hoverBg)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="p-2.5 rounded-[0.375rem] transition-all duration-200"
              style={{ color: colors.textMuted }}
              onMouseEnter={e => {
                e.currentTarget.style.background = colors.hoverBg;
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = colors.textMuted;
              }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          {/* Notifications Dropdown */}
          <DropdownMenu.Root open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenu.Trigger asChild>
              <button
                className="relative p-2.5 rounded-[0.375rem] transition-all duration-200 group"
                style={{ color: colors.textMuted }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = colors.hoverBg;
                  e.currentTarget.style.color = colors.text;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colors.textMuted;
                }}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    style={{
                      background: colors.notifBadge,
                      color: '#ffffff',
                      fontFamily: 'Outfit, sans-serif',
                    }}
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
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="p-5 mt-2 w-80 rounded-[12px] shadow-2xl"
                      style={{
                        background: colors.dropdownBg,
                        border: `1px solid ${colors.dropdownBorder}`,
                        boxShadow: colors.shadowCard,
                        zIndex: 12000,
                      }}
                    >
                      <h3
                        className="font-semibold text-base mb-4"
                        style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        Notifications
                      </h3>
                      <div className="space-y-2">
                        {unreadCount === 0 ? (
                          <div className="text-center py-8">
                            <p
                              className="text-sm"
                              style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}
                            >
                              No new notifications
                            </p>
                          </div>
                        ) : (
                          <p
                            className="text-sm"
                            style={{ color: colors.primaryLight, fontFamily: 'Outfit, sans-serif' }}
                          >
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
              <button
                className="flex items-center gap-3 p-2 rounded-[0.375rem] transition-all duration-200 group"
                onMouseEnter={e => (e.currentTarget.style.background = colors.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center font-semibold transition-transform group-hover:scale-105"
                  style={{
                    background: colors.avatarBg,
                    color: '#ffffff',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-full h-full rounded-[0.375rem] object-cover"
                    />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p
                    className="text-sm font-medium"
                    style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {user?.name || 'User'}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}
                  >
                    {(user as any)?.roleName || 'Role'}
                  </p>
                </div>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 mt-2 w-64 rounded-[12px] shadow-2xl"
                  style={{
                    background: colors.dropdownBg,
                    border: `1px solid ${colors.dropdownBorder}`,
                    boxShadow: colors.shadowCard,
                    zIndex: 12000,
                  }}
                >
                  {/* User info */}
                  <div
                    className="px-4 py-3 mb-2 rounded-[8px]"
                    style={{ background: colors.activeItemBg }}
                  >
                    <p
                      className="font-semibold text-sm"
                      style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {user?.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}
                    >
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="space-y-0.5">
                    <DropdownMenu.Item asChild>
                      <button
                        onClick={handleProfile}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[0.375rem] transition-all duration-200 text-left text-sm"
                        style={{ color: colors.text, fontFamily: 'Outfit, sans-serif' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = colors.hoverBg;
                          e.currentTarget.style.color = colors.text;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = colors.text;
                        }}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item asChild>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[0.375rem] transition-all duration-200 text-left text-sm"
                        style={{ color: colors.text, fontFamily: 'Outfit, sans-serif' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = colors.hoverBg;
                          e.currentTarget.style.color = colors.text;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = colors.text;
                        }}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                    </DropdownMenu.Item>
                  </div>

                  <div
                    className="my-2"
                    style={{ height: '1px', background: colors.divider }}
                  />

                  <DropdownMenu.Item asChild>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[0.375rem] transition-all duration-200 text-left text-sm"
                      style={{ color: colors.text, fontFamily: 'Outfit, sans-serif' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(220,38,38,0.12)';
                        e.currentTarget.style.color = '#fca5a5';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = colors.text;
                      }}
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
    </motion.div>
  );
};

export default Header;
