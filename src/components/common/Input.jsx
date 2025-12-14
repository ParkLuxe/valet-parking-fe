/**
 * Reusable Input Component
 * Wraps Material-UI TextField with consistent styling and validation
 */

import React from 'react';
import { TextField } from '@mui/material';

const Input = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error = false,
  helperText = '',
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  fullWidth = true,
  multiline = false,
  rows = 4,
  variant = 'outlined',
  size = 'medium',
  InputProps,
  ...props
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      type={type}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      variant={variant}
      size={size}
      InputProps={InputProps}
      {...props}
    />
  );
};

export default Input;
