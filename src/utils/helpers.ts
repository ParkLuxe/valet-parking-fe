/**
 * Helper utility functions used throughout the application
 * Contains formatting, calculation, and general utility functions
 */

import { PERFORMANCE_THRESHOLDS } from './constants';

/**
 * Format date to display format
<<<<<<< HEAD
=======
 * @param date - Date to format
 * @returns Formatted date string
>>>>>>> master
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
<<<<<<< HEAD
=======
 * @param amount - Amount to format
 * @returns Formatted currency string
>>>>>>> master
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Calculate time difference in minutes
<<<<<<< HEAD
 */
export const getTimeDifferenceInMinutes = (
  startTime: string | Date, 
=======
 * @param startTime - Start time
 * @param endTime - End time (defaults to now)
 * @returns Time difference in minutes
 */
export const getTimeDifferenceInMinutes = (
  startTime: string | Date,
>>>>>>> master
  endTime: string | Date = new Date()
): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / 60000); // Convert milliseconds to minutes
};

/**
 * Format duration from minutes to human readable format
<<<<<<< HEAD
=======
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
>>>>>>> master
 */
export const formatDuration = (minutes: number | null | undefined): string => {
  if (!minutes || minutes < 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

<<<<<<< HEAD
/**
 * Get performance rating based on time taken
 */
export const getPerformanceRating = (
  minutes: number, 
  type: 'parking' | 'delivery' = 'parking'
): { color: string; text: string } => {
=======
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
>>>>>>> master
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
<<<<<<< HEAD
=======
 * @param scanCount - Number of scans
 * @returns Total cost
>>>>>>> master
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
<<<<<<< HEAD
 */
export const isInGracePeriod = (
  usedScans: number, 
  totalScans: number, 
=======
 * @param usedScans - Number of scans used
 * @param totalScans - Total scans allowed
 * @param lastPaymentDate - Date of last payment
 * @returns True if in grace period
 */
export const isInGracePeriod = (
  usedScans: number,
  totalScans: number,
>>>>>>> master
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
<<<<<<< HEAD
=======
 * @returns Unique ID
>>>>>>> master
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Debounce function to limit rate of function execution
<<<<<<< HEAD
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T, 
=======
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
>>>>>>> master
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
<<<<<<< HEAD
=======
 * @param name - User's full name
 * @returns Initials
>>>>>>> master
 */
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return '?';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Truncate text to specified length
<<<<<<< HEAD
=======
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
>>>>>>> master
 */
export const truncateText = (text: string | null | undefined, maxLength: number = 50): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
};

/**
 * Check if user has required role
<<<<<<< HEAD
 */
export const hasRole = (userRole: string, requiredRoles: string | string[]): boolean => {
=======
 * @param userRole - User's role
 * @param requiredRoles - Required role(s)
 * @returns True if user has required role
 */
export const hasRole = (
  userRole: string | null | undefined,
  requiredRoles: string | string[]
): boolean => {
  if (!userRole) return false;
>>>>>>> master
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  return userRole === requiredRoles;
};

/**
 * Sort array of objects by key
<<<<<<< HEAD
 */
export const sortByKey = <T extends Record<string, any>>(
  array: T[], 
  key: keyof T, 
=======
 * @param array - Array to sort
 * @param key - Key to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export const sortByKey = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
>>>>>>> master
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
<<<<<<< HEAD
=======
 * @param data - Data to download
 * @param filename - Name of file
>>>>>>> master
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
<<<<<<< HEAD
=======
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
>>>>>>> master
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
