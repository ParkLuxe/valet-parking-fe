/**
 * Toast Notification Component using Radix UI
 * Features slide-in animations and auto-dismiss
 */

import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

const Toast = React.forwardRef(({ className, variant = 'info', ...props }, ref) => {
  const variantStyles = {
    success: 'bg-gradient-to-r from-success/90 to-success/70 border-success',
    error: 'bg-gradient-to-r from-error/90 to-error/70 border-error',
    warning: 'bg-gradient-to-r from-warning/90 to-warning/70 border-warning',
    info: 'bg-gradient-to-r from-primary/90 to-primary/70 border-primary',
  };

  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        'glass-card p-4 shadow-lg',
        'border-l-4',
        'data-[state=open]:animate-slide-in',
        'data-[state=closed]:animate-fade-out',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
});

Toast.displayName = 'Toast';

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center',
      'px-3 py-2 text-sm font-medium',
      'rounded-button bg-white/20 hover:bg-white/30',
      'transition-colors',
      className
    )}
    {...props}
  />
));

ToastAction.displayName = 'ToastAction';

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute top-2 right-2',
      'rounded-button p-1',
      'text-white/70 hover:text-white',
      'hover:bg-white/10',
      'transition-colors',
      className
    )}
    {...props}
  >
    <X className="w-4 h-4" />
  </ToastPrimitive.Close>
));

ToastClose.displayName = 'ToastClose';

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold text-white', className)}
    {...props}
  />
));

ToastTitle.displayName = 'ToastTitle';

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm text-white/90 mt-1', className)}
    {...props}
  />
));

ToastDescription.displayName = 'ToastDescription';

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-[100]',
      'flex flex-col gap-2 p-4',
      'w-full max-w-md',
      className
    )}
    {...props}
  />
));

ToastViewport.displayName = 'ToastViewport';

// Icon mapping
const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

// Helper component to render toast with icon
export const ToastWithIcon = ({ variant = 'info', title, description, onClose }) => {
  const Icon = toastIcons[variant];

  return (
    <Toast variant={variant}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <ToastTitle>{title}</ToastTitle>
          {description && <ToastDescription>{description}</ToastDescription>}
        </div>
      </div>
      <ToastClose />
    </Toast>
  );
};

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
};
