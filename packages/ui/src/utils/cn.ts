/**
 * Utility for conditional classnames
 */

import clsx, { ClassValue } from 'clsx';

/**
 * Combines multiple class names and filters out falsy values
 * Wrapper around clsx for convenience
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
