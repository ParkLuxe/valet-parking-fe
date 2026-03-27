/**
 * Button Component — Obsidian + Violet Design System
 * Flat solid colors, no gradients
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils';
import { useTheme } from '../../contexts/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'gradient';
export type ButtonSize = 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

// Normalize size aliases
const normalizeSize = (size?: ButtonSize): 'small' | 'medium' | 'large' => {
  if (size === 'sm') return 'small';
  if (size === 'md') return 'medium';
  if (size === 'lg') return 'large';
  return size || 'medium';
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  className,
  style,
  ...props
}) => {
  const normalizedSize = normalizeSize(size);
  const { colors } = useTheme();

  const variantInlineStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: colors.primaryBtn,
      color: '#ffffff',
      border: '1px solid transparent',
      boxShadow: '0 6px 18px rgba(139,92,246,0.26)',
    },
    secondary: {
      background: colors.activeItemBg,
      color: colors.primary,
      border: `1px solid ${colors.activeItemBorder}`,
    },
    success: {
      background: colors.primaryBtn,
      color: '#ffffff',
      border: '1px solid transparent',
      boxShadow: '0 6px 18px rgba(139,92,246,0.26)',
    },
    danger: {
      background: '#dc2626',
      color: '#ffffff',
      border: '1px solid transparent',
      boxShadow: '0 6px 18px rgba(220,38,38,0.24)',
    },
    ghost: {
      background: 'transparent',
      color: colors.textMuted,
      border: 'none',
    },
    outline: {
      background: colors.surfaceCard,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
    },
    gradient: {
      background: colors.primaryBtn,
      color: '#ffffff',
      border: '1px solid transparent',
      boxShadow: '0 6px 18px rgba(139,92,246,0.26)',
    },
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-5 py-2.5 text-sm',
    large: 'px-6 py-3 text-base',
  };

  const baseStyles = cn(
    'relative inline-flex items-center justify-center',
    'font-semibold transition-all duration-150 ease-in-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'rounded-[14px]',
    sizeStyles[normalizedSize],
    fullWidth && 'w-full',
    className
  );

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={baseStyles}
      style={{
        fontFamily: 'Outfit, sans-serif',
        letterSpacing: '0.01em',
        borderWidth: variantInlineStyles[variant].border ? '1px' : undefined,
        borderStyle: variantInlineStyles[variant].border ? 'solid' : undefined,
        outline: 'none',
        ...variantInlineStyles[variant],
        boxShadow: variantInlineStyles[variant].boxShadow,
        ...(disabled || loading ? { opacity: 0.5 } : {}),
        ...style,
      }}
      onMouseEnter={e => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant === 'primary' || variant === 'success' || variant === 'gradient') {
            e.currentTarget.style.background = colors.primaryBtnHover;
          }
          if (variant === 'ghost') {
            e.currentTarget.style.background = colors.hoverBg;
            e.currentTarget.style.color = colors.text;
          }
          if (variant === 'outline') {
            e.currentTarget.style.background = colors.surfaceCardRaised;
            e.currentTarget.style.borderColor = colors.borderPrimary;
          }
          if (variant === 'secondary') {
            e.currentTarget.style.background = colors.activeIconBg;
          }
          if (variant === 'danger') {
            e.currentTarget.style.background = '#b91c1c';
          }
        }
      }}
      onMouseLeave={e => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(0)';
          if (variant === 'primary' || variant === 'success' || variant === 'gradient') {
            e.currentTarget.style.background = colors.primaryBtn;
          }
          if (variant === 'ghost') {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = colors.textMuted;
          }
          if (variant === 'outline') {
            e.currentTarget.style.background = colors.surfaceCard;
            e.currentTarget.style.borderColor = colors.border;
          }
          if (variant === 'secondary') {
            e.currentTarget.style.background = colors.activeItemBg;
          }
          if (variant === 'danger') {
            e.currentTarget.style.background = '#dc2626';
          }
        }
      }}
      onMouseDown={e => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={e => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      {...props}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 14,
          boxShadow: `0 0 0 0 transparent`,
        }}
      />
      {/* Ripple overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-[14px]">
        <span className="absolute inset-0 bg-white/0 active:bg-white/10 transition-colors duration-200" />
      </span>

      {/* Button content */}
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          startIcon && <span className="flex items-center">{startIcon}</span>
        )}
        {children}
        {!loading && endIcon && <span className="flex items-center">{endIcon}</span>}
      </span>
    </button>
  );
};

export default Button;
