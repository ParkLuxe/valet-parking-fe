/**
 * Enhanced Loading Spinner Component
 * Features animated gradient spinner
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false, size = 'medium' }) => {
  const sizeStyles = {
    small: 'w-5 h-5',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen ? 'min-h-screen' : 'min-h-[300px]'
      )}
    >
      <Loader2 
        className={cn(
          'animate-spin text-primary',
          sizeStyles[size]
        )} 
      />
      {message && (
        <p className="text-white/60 text-sm animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

// Skeleton loader component for content placeholders
export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'skeleton h-4 w-full',
        className
      )}
      {...props}
    />
  );
};

export default LoadingSpinner;
