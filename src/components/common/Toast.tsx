/**
 * Toast Notification Component using Radix UI
 * Theme-aware via inline styles — works correctly in both light and dark mode.
 */

import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

const variantColor: Record<ToastVariant, string> = {
  success: '#34d399',
  error:   '#f87171',
  warning: '#fbbf24',
  info:    '#a78bfa',
};

const variantIcon: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle,
  error:   AlertCircle,
  warning: AlertTriangle,
  info:    Info,
};

interface ToastWithIconProps {
  variant?: ToastVariant;
  title: string;
  description?: string;
  onClose?: () => void;
}

const ToastWithIcon: React.FC<ToastWithIconProps> = ({ variant = 'info', title, description, onClose }) => {
  const { colors } = useTheme();
  const Icon = variantIcon[variant];
  const color = variantColor[variant];

  return (
    <ToastPrimitive.Root
      duration={5000}
      onOpenChange={(open) => { if (!open) onClose?.(); }}
      style={{
        background: colors.surfaceCard,
        border: `1px solid ${colors.border}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        position: 'relative',
        minWidth: '280px',
        maxWidth: '380px',
      }}
    >
      <Icon style={{ color, width: 18, height: 18, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <ToastPrimitive.Title
          style={{
            color: colors.text,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'Outfit, sans-serif',
            lineHeight: 1.4,
          }}
        >
          {title}
        </ToastPrimitive.Title>
        {description && (
          <ToastPrimitive.Description
            style={{
              color: colors.textMuted,
              fontSize: 13,
              marginTop: 4,
              fontFamily: 'Outfit, sans-serif',
              lineHeight: 1.5,
            }}
          >
            {description}
          </ToastPrimitive.Description>
        )}
      </div>
      <ToastPrimitive.Close
        aria-label="Close"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: colors.textMuted,
          padding: 2,
          flexShrink: 0,
          marginTop: -2,
          marginRight: -4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
        }}
      >
        <X style={{ width: 14, height: 14 }} />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
};

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport: React.FC = () => (
  <ToastPrimitive.Viewport
    style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 400,
      listStyle: 'none',
      padding: 0,
      margin: 0,
      outline: 'none',
    }}
  />
);

export { ToastProvider, ToastViewport, ToastWithIcon };
