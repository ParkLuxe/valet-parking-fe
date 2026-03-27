/**
 * Enhanced Input Component — Neon Afterhours Design System
 * Glass inputs, pastel focus states, and softer label transitions
 */

import React, { useMemo, useState } from 'react';
import { cn } from '../../utils';
import { useTheme } from '../../contexts/ThemeContext';

export interface InputSuggestion {
  label: string;
  value: string;
  meta?: string;
  payload?: Record<string, any>;
}

interface InputProps {
  label?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: boolean;
  helperText?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  select?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  showPlaceholder?: boolean;
  suggestions?: Array<InputSuggestion | string>;
  onSuggestionSelect?: (suggestion: InputSuggestion) => void;
  loadingSuggestions?: boolean;
  noSuggestionsText?: string;
  [key: string]: any;
}

const errorInputStyle: React.CSSProperties = {
  borderColor: 'rgba(239,68,68,0.6)',
};

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
    showPlaceholder = false,
    suggestions = [],
    onSuggestionSelect,
    loadingSuggestions = false,
    noSuggestionsText = 'No suggestions found',
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const { colors } = useTheme();

    const normalizedSuggestions = useMemo(
      () =>
        suggestions.map((suggestion) =>
          typeof suggestion === 'string'
            ? { label: suggestion, value: suggestion }
            : suggestion
        ),
      [suggestions]
    );

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    const handleSuggestionPick = (suggestion: InputSuggestion) => {
      onSuggestionSelect?.(suggestion);
      setIsFocused(false);
    };

    const hasValue = value && String(value).length > 0;
    const showSuggestionPanel = !select && isFocused && (loadingSuggestions || normalizedSuggestions.length > 0);

    const baseFocusStyle: React.CSSProperties = {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.activeItemBg}`,
      outline: 'none',
      background: colors.surfaceCard,
    };

    const baseInputStyle: React.CSSProperties = {
      background: colors.surfaceCard,
      border: `1px solid ${colors.border}`,
      borderRadius: '14px',
      color: colors.text,
      fontFamily: 'Outfit, sans-serif',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 2px rgba(15,23,42,0.05)',
    };

    const computedInputStyle: React.CSSProperties = {
      ...baseInputStyle,
      ...(error ? errorInputStyle : {}),
      ...(isFocused ? baseFocusStyle : {}),
      ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
      paddingLeft: icon ? '3rem' : '1rem',
      paddingRight: '1rem',
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      width: '100%',
    };

    // Render select
    if (select) {
      return (
        <div className={cn('relative', fullWidth && 'w-full', className)}>
          <div className="relative">
            {icon && (
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                style={{ color: colors.textMuted }}
              >
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
              style={{
                ...computedInputStyle,
                appearance: 'none',
                cursor: 'pointer',
              }}
              {...props}
            >
              {children}
            </select>
            {/* Dropdown arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke={colors.textMuted} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {label && (
            <label
              className="absolute left-4 top-0 -translate-y-1/2 text-xs px-2"
              style={{
                background: colors.contentBg,
                color: error ? '#fca5a5' : colors.primary,
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              {label}
              {required && <span style={{ color: '#ffb2cf' }} className="ml-1">*</span>}
            </label>
          )}
          {helperText && (
            <p
              className="mt-1 text-sm px-1"
              style={{
                color: error ? '#fca5a5' : colors.textMuted,
                fontFamily: 'Outfit, sans-serif',
              }}
            >
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
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
              style={{ color: isFocused ? colors.primary : colors.textMuted, transition: 'color 0.2s' }}
            >
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
              placeholder={showPlaceholder ? placeholder : ' '}
              required={required}
              disabled={disabled}
              rows={rows}
              style={{
                ...baseInputStyle,
                ...(error ? errorInputStyle : {}),
                ...(isFocused ? baseFocusStyle : {}),
                ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                paddingLeft: icon ? '3rem' : '1rem',
                paddingRight: '1rem',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                width: '100%',
                resize: 'none',
              } as React.CSSProperties}
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
              placeholder={showPlaceholder ? placeholder : ' '}
              required={required}
              disabled={disabled}
              ref={ref}
              style={computedInputStyle}
              {...props}
            />
          )}

          {/* Floating label */}
          {label && !showPlaceholder && (
            <label
              htmlFor={name}
              style={{
                position: 'absolute',
                left: icon && !isFocused && !hasValue ? '3rem' : '1rem',
                top: isFocused || hasValue ? '0' : '50%',
                transform: isFocused || hasValue ? 'translateY(-50%)' : 'translateY(-50%)',
                fontSize: isFocused || hasValue ? '0.75rem' : '1rem',
                color: isFocused
                  ? (error ? '#fca5a5' : colors.primary)
                  : colors.textMuted,
                pointerEvents: 'none',
                transition: 'all 0.2s ease',
                background: isFocused || hasValue ? colors.contentBg : 'transparent',
                padding: isFocused || hasValue ? '0 0.4rem' : '0',
                fontFamily: 'Outfit, sans-serif',
                zIndex: 1,
              }}
            >
              {label}
              {required && <span style={{ color: '#ffb2cf' }} className="ml-1">*</span>}
            </label>
          )}

          {showSuggestionPanel && (
            <div
              className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-30 overflow-hidden rounded-[18px] border border-white/10"
              style={{
                background: colors.dropdownBg,
                boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
                border: `1px solid ${colors.border}`,
              }}
            >
              {loadingSuggestions ? (
                <div className="px-4 py-3 text-sm" style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}>
                  Loading suggestions...
                </div>
              ) : (
                <div className="max-h-56 overflow-y-auto py-2">
                  {normalizedSuggestions.length > 0 ? (
                    normalizedSuggestions.map((suggestion) => (
                      <button
                        key={`${suggestion.value}-${suggestion.meta || ''}`}
                        type="button"
                        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/6"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          handleSuggestionPick(suggestion);
                        }}
                      >
                        <span className="text-sm" style={{ color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
                          {suggestion.label}
                        </span>
                        {suggestion.meta ? (
                          <span className="text-xs" style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}>
                            {suggestion.meta}
                          </span>
                        ) : null}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm" style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}>
                      {noSuggestionsText}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Helper text */}
        {(helperText || error) && (
          <p
            className="mt-1 text-sm px-1"
            style={{
              color: error ? '#fca5a5' : colors.textMuted,
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
