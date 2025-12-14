/**
 * Helper utility functions used throughout the application
 * Contains formatting, calculation, and general utility functions
 */

import { PERFORMANCE_THRESHOLDS } from './constants';

/**
 * Format date to display format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return d.toLocaleDateString('en-US', options);
};

/**
 * Format currency to Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Calculate time difference in minutes
 * @param {string|Date} startTime - Start time
 * @param {string|Date} endTime - End time (defaults to now)
 * @returns {number} Time difference in minutes
 */
export const getTimeDifferenceInMinutes = (startTime, endTime = new Date()) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;
  return Math.floor(diffMs / 60000); // Convert milliseconds to minutes
};

/**
 * Format duration from minutes to human readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

/**
 * Get performance rating based on time taken
 * @param {number} minutes - Time taken in minutes
 * @param {string} type - Type of operation ('parking' or 'delivery')
 * @returns {object} Rating object with color and text
 */
export const getPerformanceRating = (minutes, type = 'parking') => {
  const thresholds = type === 'parking' 
    ? {
        excellent: PERFORMANCE_THRESHOLDS.PARKING_TIME_EXCELLENT,
        good: PERFORMANCE_THRESHOLDS.PARKING_TIME_GOOD,
        poor: PERFORMANCE_THRESHOLDS.PARKING_TIME_POOR,
      }
    : {
        excellent: PERFORMANCE_THRESHOLDS.DELIVERY_TIME_EXCELLENT,
        good: PERFORMANCE_THRESHOLDS.DELIVERY_TIME_GOOD,
        poor: PERFORMANCE_THRESHOLDS.DELIVERY_TIME_POOR,
      };

  if (minutes <= thresholds.excellent) {
    return { color: 'success', text: 'Excellent' };
  } else if (minutes <= thresholds.good) {
    return { color: 'primary', text: 'Good' };
  } else if (minutes <= thresholds.poor) {
    return { color: 'warning', text: 'Average' };
  } else {
    return { color: 'error', text: 'Poor' };
  }
};

/**
 * Calculate subscription cost based on scan count
 * @param {number} scanCount - Number of scans
 * @returns {number} Total cost
 */
export const calculateSubscriptionCost = (scanCount) => {
  const BASE_PRICE = 1000;
  const BASE_SCANS = 100;
  const ADDITIONAL_SCAN_PRICE = 10;

  if (scanCount <= BASE_SCANS) {
    return BASE_PRICE;
  }
  
  const additionalScans = scanCount - BASE_SCANS;
  return BASE_PRICE + (additionalScans * ADDITIONAL_SCAN_PRICE);
};

/**
 * Check if subscription is in grace period
 * @param {number} usedScans - Number of scans used
 * @param {number} totalScans - Total scans allowed
 * @param {string} lastPaymentDate - Date of last payment
 * @returns {boolean} True if in grace period
 */
export const isInGracePeriod = (usedScans, totalScans, lastPaymentDate) => {
  if (usedScans <= totalScans) return false;
  
  const lastPayment = new Date(lastPaymentDate);
  const now = new Date();
  const daysDifference = Math.floor((now - lastPayment) / (1000 * 60 * 60 * 24));
  
  return daysDifference <= 3; // 3-day grace period
};

/**
 * Generate a unique ID (simple version)
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Debounce function to limit rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Get user initials from name
 * @param {string} name - User's full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Check if user has required role
 * @param {string} userRole - User's role
 * @param {Array|string} requiredRoles - Required role(s)
 * @returns {boolean} True if user has required role
 */
export const hasRole = (userRole, requiredRoles) => {
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  return userRole === requiredRoles;
};

/**
 * Sort array of objects by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
};

/**
 * Download data as JSON file
 * @param {object} data - Data to download
 * @param {string} filename - Name of file
 */
export const downloadJSON = (data, filename = 'data.json') => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise} Promise that resolves when text is copied
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
};
