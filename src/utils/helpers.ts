/**
 * Helper utility functions used throughout the application
 * Contains formatting, calculation, and general utility functions
 */

import { PERFORMANCE_THRESHOLDS } from './constants';

/**
 * Format date to display format
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
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
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Calculate time difference in minutes
 * @param startTime - Start time
 * @param endTime - End time (defaults to now)
 * @returns Time difference in minutes
 */
export const getTimeDifferenceInMinutes = (
  startTime: string | Date,
  endTime: string | Date = new Date()
): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / 60000); // Convert milliseconds to minutes
};

/**
 * Format duration from minutes to human readable format
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (minutes: number | null | undefined): string => {
  if (!minutes || minutes < 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

interface PerformanceRating {
  color: string;
  text: string;
}

/**
 * Get performance rating based on time taken
 * @param minutes - Time taken in minutes
 * @param type - Type of operation ('parking' or 'delivery')
 * @returns Rating object with color and text
 */
export const getPerformanceRating = (
  minutes: number,
  type: 'parking' | 'delivery' = 'parking'
): PerformanceRating => {
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
 * @param scanCount - Number of scans
 * @returns Total cost
 */
export const calculateSubscriptionCost = (scanCount: number): number => {
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
 * @param usedScans - Number of scans used
 * @param totalScans - Total scans allowed
 * @param lastPaymentDate - Date of last payment
 * @returns True if in grace period
 */
export const isInGracePeriod = (
  usedScans: number,
  totalScans: number,
  lastPaymentDate: string | Date
): boolean => {
  if (usedScans <= totalScans) return false;
  
  const lastPayment = new Date(lastPaymentDate);
  const now = new Date();
  const daysDifference = Math.floor((now.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysDifference <= 3; // 3-day grace period
};

/**
 * Generate a unique ID (simple version)
 * @returns Unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Debounce function to limit rate of function execution
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Get user initials from name
 * @param name - User's full name
 * @returns Initials
 */
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return '?';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string | null | undefined, maxLength: number = 50): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
};

/**
 * Check if user has required role
 * @param userRole - User's role
 * @param requiredRoles - Required role(s)
 * @returns True if user has required role
 */
export const hasRole = (
  userRole: string | null | undefined,
  requiredRoles: string | string[]
): boolean => {
  if (!userRole) return false;
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  return userRole === requiredRoles;
};

/**
 * Sort array of objects by key
 * @param array - Array to sort
 * @param key - Key to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export const sortByKey = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
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
 * @param data - Data to download
 * @param filename - Name of file
 */
export const downloadJSON = (data: any, filename: string = 'data.json'): void => {
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
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
};
