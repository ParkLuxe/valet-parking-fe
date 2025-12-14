/**
 * Utility for combining Tailwind CSS classes
 * Uses clsx and tailwind-merge for proper class merging
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names and merges Tailwind classes properly
 * @param {...any} inputs - Class names to combine
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
