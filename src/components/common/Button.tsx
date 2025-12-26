/**
 * Enhanced Button Component with Premium Styling
 * Features gradient backgrounds, hover effects, and animations
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

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
  ...props
}) => {
  const normalizedSize = normalizeSize(size);

  // Base button styles
  const baseStyles = cn(
    'relative inline-flex items-center justify-center',
    'font-semibold transition-all duration-300 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    fullWidth && 'w-full'
  );

  // Size variants
  const sizeStyles = {
    small: 'px-4 py-2 text-sm rounded-lg',
    medium: 'px-6 py-3 text-base rounded-button',
    large: 'px-8 py-4 text-lg rounded-button',
  };

  // Variant styles with gradients and effects
  const variantStyles: Record<ButtonVariant, string> = {
    primary: cn(
      'bg-gradient-to-r from-[#667eea] to-[#764ba2]',
      'text-white shadow-lg',
      'hover:shadow-glow-primary hover:-translate-y-0.5',
      'focus:ring-primary',
      'active:translate-y-0'
    ),
    secondary: cn(
      'bg-transparent border-2 border-white/20',
      'text-white hover:bg-white/10',
      'hover:border-white/30 hover:-translate-y-0.5',
      'focus:ring-white/50',
      'active:translate-y-0'
    ),
    success: cn(
      'bg-gradient-to-r from-[#00d2ff] to-[#3a47d5]',
      'text-white shadow-lg',
      'hover:shadow-glow-accent hover:-translate-y-0.5',
      'focus:ring-accent',
      'active:translate-y-0'
    ),
    danger: cn(
      'bg-gradient-to-r from-[#ef4444] to-[#dc2626]',
      'text-white shadow-lg',
      'hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:-translate-y-0.5',
      'focus:ring-error',
      'active:translate-y-0'
    ),
    ghost: cn(
      'bg-transparent text-white',
      'hover:bg-white/5',
      'focus:ring-white/30'
    ),
    outline: cn(
      'bg-transparent border-2 border-primary',
      'text-primary hover:bg-primary/10',
      'hover:border-primary hover:-translate-y-0.5',
      'focus:ring-primary',
      'active:translate-y-0'
    ),
    gradient: cn(
      'bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#00d2ff]',
      'text-white shadow-lg',
      'hover:shadow-glow-primary hover:-translate-y-0.5',
      'focus:ring-primary',
      'active:translate-y-0'
    ),
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        baseStyles,
        sizeStyles[normalizedSize],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {/* Ripple effect on click */}
      <span className="absolute inset-0 overflow-hidden rounded-button">
        <span className="absolute inset-0 bg-white/0 active:bg-white/10 transition-colors duration-300" />
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
