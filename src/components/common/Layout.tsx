/**
 * Main Layout Component
 * Two-panel design: sidebar card + content card, both rounded and inline.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Menu, Sun, Moon, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTheme } from '../../contexts/ThemeContext';
import { toggleSidebar } from '../../redux';
import type { RootState } from '../../redux';

export interface LayoutProps {
  children?: any;
}

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { colors, isDark, toggle } = useTheme();

  const cardStyle = {
    background: colors.contentBg,
    border: `1px solid ${colors.border}`,
    borderRadius: '22px',
  };

  return (
    <div
      className="flex h-screen p-2 md:p-4 gap-2 md:gap-4 overflow-hidden relative"
      style={{ background: colors.bgPrimary }}
    >
      <Sidebar />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`flex flex-col overflow-hidden relative min-w-0 ${sidebarOpen ? 'hidden md:flex md:flex-1' : 'flex-1'}`}
        style={cardStyle}
      >
        <button
          onClick={toggle}
          className="absolute top-2 md:top-4 right-2 md:right-4 z-20 p-1.5 md:p-2 rounded-[10px] transition-colors"
          style={{ color: colors.textMuted, background: colors.surfaceInset, border: `1px solid ${colors.border}` }}
          onMouseEnter={e => {
            e.currentTarget.style.background = colors.hoverBg;
            e.currentTarget.style.color = colors.text;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = colors.surfaceInset;
            e.currentTarget.style.color = colors.textMuted;
          }}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 md:w-5 h-4 md:h-5" /> : <Moon className="w-4 md:w-5 h-4 md:h-5" />}
        </button>

        {!sidebarOpen && (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="absolute top-2 md:top-4 left-2 md:left-4 z-20 p-1.5 md:p-2 rounded-[10px] transition-colors"
            style={{ color: colors.textMuted, background: colors.surfaceInset, border: `1px solid ${colors.border}` }}
            onMouseEnter={e => {
              e.currentTarget.style.background = colors.hoverBg;
              e.currentTarget.style.color = colors.text;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = colors.surfaceInset;
              e.currentTarget.style.color = colors.textMuted;
            }}
            aria-label="Open sidebar"
          >
            <Menu className="w-4 md:w-5 h-4 md:h-5" />
          </button>
        )}

        <div className="relative z-0 flex-1 overflow-y-auto p-3 md:p-6 lg:p-8">
          {children}
        </div>

        <button
          onClick={() => navigate('/qr-scan')}
          className="absolute bottom-3 right-3 md:bottom-6 md:right-6 z-20 flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-full transition-all text-xs md:text-sm font-bold"
          style={{
            background: colors.primaryBtn,
            color: '#ffffff',
            boxShadow: '0 12px 28px rgba(124,58,237,0.32)',
            fontFamily: 'Outfit, sans-serif',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = colors.primaryBtnHover;
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = colors.primaryBtn;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          aria-label="Scan and assign"
        >
          <Zap className="w-3 md:w-4 h-3 md:h-4" />
          <span className="hidden md:inline">Scan & Assign</span>
        </button>
      </motion.div>
    </div>
  );
};

export default Layout;
