/**
 * Enhanced Loading Spinner Component
 * Features animated car going in and out horizontally (valet system animation)
 */

import React from 'react';
import { cn } from '../../utils';

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
  const containerSize = {
    small: 'w-32 h-16',
    medium: 'w-48 h-24',
    large: 'w-64 h-32',
  };

  const carSize = {
    small: 'w-12 h-8',
    medium: 'w-16 h-10',
    large: 'w-20 h-12',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen ? 'min-h-screen bg-background-secondary' : 'min-h-[300px]',
        className
      )}
    >
      <div className={cn('relative overflow-hidden', containerSize[size])}>
        {/* Horizontal track line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/30 transform -translate-y-1/2" />
        
        {/* Animated car */}
        <div className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'animate-car-horizontal',
          carSize[size]
        )}>
          <svg
            viewBox="0 0 100 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-primary drop-shadow-lg"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Car body - main rectangle */}
            <rect
              x="15"
              y="25"
              width="70"
              height="20"
              rx="3"
              fill="currentColor"
              opacity="0.9"
            />
            
            {/* Car roof/windshield */}
            <path
              d="M 25 25 L 35 15 L 65 15 L 75 25 Z"
              fill="currentColor"
              opacity="0.8"
            />
            
            {/* Windshield divider */}
            <line
              x1="50"
              y1="15"
              x2="50"
              y2="25"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
            
            {/* Front wheel */}
            <circle
              cx="30"
              cy="45"
              r="6"
              fill="rgba(0,0,0,0.6)"
            />
            <circle
              cx="30"
              cy="45"
              r="4"
              fill="rgba(255,255,255,0.3)"
            />
            <circle
              cx="30"
              cy="45"
              r="2"
              fill="rgba(0,0,0,0.4)"
            />
            
            {/* Rear wheel */}
            <circle
              cx="70"
              cy="45"
              r="6"
              fill="rgba(0,0,0,0.6)"
            />
            <circle
              cx="70"
              cy="45"
              r="4"
              fill="rgba(255,255,255,0.3)"
            />
            <circle
              cx="70"
              cy="45"
              r="2"
              fill="rgba(0,0,0,0.4)"
            />
            
            {/* Car details - headlights */}
            <circle
              cx="20"
              cy="30"
              r="2"
              fill="rgba(255,255,200,0.8)"
            />
            
            {/* Car details - taillights */}
            <circle
              cx="80"
              cy="30"
              r="2"
              fill="rgba(255,100,100,0.8)"
            />
            
            {/* Side windows */}
            <rect
              x="30"
              y="18"
              width="15"
              height="8"
              rx="1"
              fill="rgba(100,150,255,0.4)"
            />
            <rect
              x="55"
              y="18"
              width="15"
              height="8"
              rx="1"
              fill="rgba(100,150,255,0.4)"
            />
          </svg>
        </div>
      </div>
      
      {message && (
        <p className="text-white/60 text-sm animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

// Skeleton loader component for content placeholders
export const Skeleton = ({ className, ...props }: { className?: string; [key: string]: any }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/10 rounded',
        className
      )}
      {...props}
    />
  );
};

export default LoadingSpinner;
