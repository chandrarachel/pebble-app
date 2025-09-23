import { format, isValid } from 'date-fns';

/**
 * Formats a date/time string or Date object to a readable local time string.
 * Example output: Monday, August 1st, 2025 08:00 PM
 * @param {string|Date} value - The date/time value to format
 * @returns {string} Formatted date string or original value if invalid
 */
export function formatLocalDateTime(value) {
  let localString = value;
  if (typeof localString === 'string' && localString.endsWith('Z')) {
    localString = localString.replace(/Z$/, '');
  }
  let dateObj = typeof localString === 'string' && localString.includes('T')
    ? new Date(localString)
    : new Date(localString);
  if (!isValid(dateObj)) return String(value);
  const now = new Date();
  const isThisYear = dateObj.getFullYear() === now.getFullYear();
  // Example: Sep 21 · Sun · 5:00 PM (if this year), else Sep 21, 2025 · Sun · 5:00 PM
  return isThisYear
    ? format(dateObj, 'MMM d · EEE · h:mm a')
    : format(dateObj, 'MMM d, yyyy · EEE · h:mm a');
}
