/**
 * Enhanced Loading Spinner Component
 * Neon transit animation aligned with the updated app theme
 */

import React from 'react';
import { CarFront, Sparkles } from 'lucide-react';
import { cn } from '../../utils';
import { useTheme } from '../../contexts/ThemeContext';

export interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner = ({ 
  message = 'Loading...', 
  fullScreen = false, 
  size = 'medium',
  className 
}: LoadingSpinnerProps) => {
  const { colors } = useTheme();
  // Use semi-transparent overlay instead of solid background
  const containerBackground = fullScreen ? `rgba(12, 11, 24, 0.75)` : 'transparent';

  const containerSize = {
    small: 'w-28 h-28',
    medium: 'w-36 h-36',
    large: 'w-44 h-44',
  };

  const iconSize = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-7 h-7',
  };

  const dotOffset = {
    small: 'top-2',
    medium: 'top-3',
    large: 'top-4',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen ? 'min-h-screen' : 'min-h-[300px]',
        className
      )}
      style={{ background: containerBackground }}
    >
      <div className={cn('relative', containerSize[size])}>
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: colors.activeItemBg, borderRadius: '100%', filter: 'blur(18px)' }}
        />

        <div
          className="absolute inset-1 rounded-full border"
          style={{ borderColor: colors.border }}
        />

        <div
          className="absolute inset-3 rounded-full border"
          style={{ borderColor: colors.activeItemBorder }}
        />

        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{ animationDuration: '3.2s' }}
        >
          <div
            className={cn('absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full blur-[1px]', dotOffset[size])}
            style={{ background: colors.primaryBtn, boxShadow: '0 0 14px rgba(139,92,246,0.55)' }}
          />
          <div
            className="absolute bottom-6 left-4 h-2.5 w-2.5 rounded-full"
            style={{ background: '#e879f9', boxShadow: '0 0 12px rgba(232,121,249,0.55)' }}
          />
        </div>

        <div
          className="absolute inset-[22%] rounded-full animate-pulse"
          style={{
            background: colors.surfaceCard,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 8px 24px rgba(15,23,42,0.14)',
          }}
        >


          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: colors.activeItemBg,
                border: `1px solid ${colors.activeItemBorder}`,
                boxShadow: '0 4px 14px rgba(0,0,0,0.30)',
              }}
            >
              <CarFront className={iconSize[size]} style={{ color: colors.text }} />
              <Sparkles
                className="absolute -right-1 -top-1 h-4 w-4 animate-pulse"
                style={{ color: colors.primaryLight }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {message && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium animate-pulse" style={{ color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
            {message}
          </p>
          <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}>
            Syncing valet flow
          </p>
        </div>
      )}
    </div>
  );
};

// Skeleton loader component for content placeholders
export const Skeleton = ({ className, ...props }: { className?: string; [key: string]: any }) => {
  const { colors } = useTheme();

  return (
    <div
      className={cn(
        'animate-pulse rounded',
        className
      )}
      style={{ background: colors.surfaceCardRaised }}
      {...props}
    />
  );
};

export default LoadingSpinner;
