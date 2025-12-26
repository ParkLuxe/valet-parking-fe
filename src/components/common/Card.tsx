/**
 * Enhanced Card Component with Glassmorphism
 * Features backdrop blur, gradient backgrounds, and hover effects
 */

import React from 'react';
import { cn } from '../../utils';

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
  return (
    <div
      className={cn(
        'glass-card p-6',
        'transition-all duration-300 ease-in-out',
        hover && 'hover:-translate-y-1 hover:shadow-2xl cursor-pointer',
        glow && 'hover:shadow-glow-primary',
        gradient && 'bg-gradient-card',
        'flex flex-col',
        className
      )}
      {...props}
    >
      {/* Card Header */}
      {(title || subtitle || headerAction) && (
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            {title && (
              <h3 className="text-xl font-bold text-white mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-white/60">
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

      {/* Card Actions */}
      {actions && (
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;
