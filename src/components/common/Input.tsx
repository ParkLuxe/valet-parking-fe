/**
 * Enhanced Input Component with Floating Labels
 * Features glassmorphism, gradient focus rings, and smooth animations
 */

import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  select?: boolean;
  children?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    name,
    value,
    onChange,
    onBlur,
    error = false,
    helperText = '',
    type = 'text',
    placeholder = ' ',
    required = false,
    disabled = false,
    fullWidth = true,
    multiline = false,
    rows = 4,
    select = false,
    children,
    icon,
    className,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e as any);
    };

    const hasValue = value && String(value).length > 0;

  // Render select if select prop is true
  if (select) {
    return (
      <div className={cn('relative', fullWidth && 'w-full', className)}>
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none z-10">
              {icon}
            </div>
          )}
          <select
            name={name}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required={required}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-3 bg-white/5 backdrop-blur-sm',
              'border border-white/10 rounded-input',
              'text-white appearance-none cursor-pointer',
              'transition-all duration-300 ease-in-out',
              'focus:outline-none focus:border-primary',
              'focus:ring-2 focus:ring-primary/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-error focus:border-error focus:ring-error/30',
              icon && 'pl-12'
            )}
            {...props}
          >
            {children}
          </select>
          {/* Dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {label && (
          <label className={cn(
            'absolute left-4 top-0 -translate-y-1/2 text-xs px-2',
            'bg-background-secondary',
            error ? 'text-error' : 'text-primary'
          )}>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        {helperText && (
          <p className={cn('mt-1 text-sm px-1', error ? 'text-error' : 'text-white/50')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', fullWidth && 'w-full', className)}>
      {/* Input container */}
      <div className="relative">
        {/* Icon prefix */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none z-10">
            {icon}
          </div>
        )}

        {/* Input field */}
        {multiline ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={cn(
              'w-full px-4 py-3 bg-white/5 backdrop-blur-sm',
              'border border-white/10 rounded-input',
              'text-white placeholder-transparent',
              'transition-all duration-300 ease-in-out',
              'focus:outline-none focus:border-primary',
              'focus:ring-2 focus:ring-primary/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-error focus:border-error focus:ring-error/30',
              icon && 'pl-12',
              'resize-none'
            )}
            {...props}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-3 bg-white/5 backdrop-blur-sm',
              'border border-white/10 rounded-input',
              'text-white placeholder-transparent',
              'transition-all duration-300 ease-in-out',
              'focus:outline-none focus:border-primary',
              'focus:ring-2 focus:ring-primary/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-error focus:border-error focus:ring-error/30',
              icon && 'pl-12'
            )}
            {...props}
          />
        )}

        {/* Floating label */}
        {label && (
          <label
            htmlFor={name}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2',
              'text-white/50 pointer-events-none',
              'transition-all duration-300 ease-in-out',
              'bg-background-secondary px-2',
              (isFocused || hasValue) && [
                'top-0 text-xs',
                error ? 'text-error' : 'text-primary',
              ],
              icon && !isFocused && !hasValue && 'left-12'
            )}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
      </div>

      {/* Helper text or error message */}
      {(helperText || error) && (
        <p
          className={cn(
            'mt-1 text-sm px-1',
            error ? 'text-error' : 'text-white/50'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
