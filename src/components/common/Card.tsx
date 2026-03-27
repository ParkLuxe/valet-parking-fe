/**
 * Enhanced Card Component — Neon Afterhours Design System
 * Frosted panels, soft gradients, and elevated hover motion
 */

import React from 'react';
import { cn } from '../../utils';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  actions,
  headerAction,
  className,
  hover = false,
  glow = false,
  gradient = false,
  onClick,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <div
      className={cn(
        'p-6 rounded-[20px]',
        'transition-all duration-300 ease-in-out',
        hover && 'cursor-pointer',
        'flex flex-col',
        className
      )}
      style={{
        background: gradient
          ? colors.activeItemBg
          : colors.surfaceCard,
        boxShadow: '0 10px 30px rgba(15,23,42,0.10)',
        border: `1px solid ${colors.border}`,
      }}
      onClick={onClick}
      onMouseEnter={e => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = glow
            ? '0 14px 34px rgba(15,23,42,0.14), 0 0 0 1px rgba(139,92,246,0.10)'
            : '0 14px 34px rgba(15,23,42,0.14)';
        }
      }}
      onMouseLeave={e => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(15,23,42,0.10)';
        }
      }}
      {...props}
    >
      {/* Card Header */}
      {(title || subtitle || headerAction) && (
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            {title && (
              <h3
                className="text-xl font-bold mb-1"
                style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                className="text-sm"
                style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="ml-4">
              {headerAction}
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Card Actions — separator uses ghost border rule */}
      {actions && (
        <div
          className="mt-4 pt-4 flex items-center gap-2"
          style={{ borderTop: `1px solid ${colors.divider}` }}
        >
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;
