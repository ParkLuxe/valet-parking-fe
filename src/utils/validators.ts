/**
 * Validation utility functions for form inputs
 * Contains validators for email, phone, password, vehicle number, etc.
 */

interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validate email address
 * @param email - Email to validate
 * @returns Validation result with isValid and error message
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate phone number (Indian format)
 * @param phone - Phone number to validate
 * @returns Validation result with isValid and error message
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove spaces, dashes, and brackets
  // eslint-disable-next-line no-useless-escape
  const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's a valid Indian phone number (10 digits)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(cleanedPhone)) {
    return { isValid: false, error: 'Invalid phone number format (10 digits starting with 6-9)' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Validation result with isValid and error message
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  // eslint-disable-next-line no-useless-escape
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate if passwords match
 * @param password - Password
 * @param confirmPassword - Confirm password
 * @returns Validation result with isValid and error message
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate vehicle number (Indian format)
 * @param vehicleNumber - Vehicle number to validate
 * @returns Validation result with isValid and error message
 */
export const validateVehicleNumber = (vehicleNumber: string): ValidationResult => {
  if (!vehicleNumber) {
    return { isValid: false, error: 'Vehicle number is required' };
  }
  
  // Indian vehicle number format: XX00XX0000 or XX-00-XX-0000
  // eslint-disable-next-line no-useless-escape
  const cleanedNumber = vehicleNumber.replace(/[\s\-]/g, '').toUpperCase();
  const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
  
  if (!vehicleRegex.test(cleanedNumber)) {
    return { isValid: false, error: 'Invalid vehicle number format (e.g., MH12AB1234)' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate name
 * @param name - Name to validate
 * @param fieldName - Field name for error message
 * @returns Validation result with isValid and error message
 */
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters and spaces` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate required field
 * @param value - Value to validate
 * @param fieldName - Field name for error message
 * @returns Validation result with isValid and error message
 */
export const validateRequired = (value: any, fieldName: string = 'This field'): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate number within range
 * @param value - Value to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @param fieldName - Field name for error message
 * @returns Validation result with isValid and error message
 */
export const validateNumber = (
  value: any,
  min: number | null = null,
  max: number | null = null,
  fieldName: string = 'Value'
): ValidationResult => {
  if (isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }
  
  const numValue = Number(value);
  
  if (min !== null && numValue < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== null && numValue > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }
  
  return { isValid: true, error: null };
};

type ValidatorFn = (value: any) => ValidationResult;

interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate form data with multiple fields
 * @param formData - Form data object
 * @param validationRules - Validation rules for each field
 * @returns Validation result with errors object
 */
export const validateForm = (
  formData: Record<string, any>,
  validationRules: Record<string, ValidatorFn[]>
): FormValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach((fieldName) => {
    const value = formData[fieldName];
    const rules = validationRules[fieldName];
    
    // Check each validation rule for the field
    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        errors[fieldName] = result.error || 'Validation failed';
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });
  
  return { isValid, errors };
};

/**
 * Validate URL
 * @param url - URL to validate
 * @returns Validation result with isValid and error message
 */
export const validateURL = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }
  
  try {
    new URL(url);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB
 * @returns Validation result with isValid and error message
 */
export const validateFileSize = (file: File, maxSizeMB: number = 5): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate file type
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns Validation result with isValid and error message
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg']
): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` };
  }
  
  return { isValid: true, error: null };
};
