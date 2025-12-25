/**
 * Utility for combining Tailwind CSS classes
 * Uses clsx and tailwind-merge for proper class merging
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names and merges Tailwind classes properly
<<<<<<< HEAD
=======
 * @param inputs - Class names to combine
 * @returns Merged class names
>>>>>>> master
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
