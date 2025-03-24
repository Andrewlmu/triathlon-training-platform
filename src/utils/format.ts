/**
 * Format utilities for workout duration display
 * 
 * Collection of helper functions for formatting duration values
 * in consistent and user-friendly ways throughout the application.
 */

/**
 * Format minutes into hours display format
 * 
 * Converts minutes to hours with one decimal place.
 * Used for summary displays and statistics.
 * 
 * @param minutes - The minutes to format
 * @returns A string representation of hours (e.g., "1.5")
 */
export const formatHours = (minutes: number): string => {
  const hours = minutes / 60;
  return hours.toFixed(1);
};

/**
 * Format minutes into a more readable duration format (Xh Ym)
 * 
 * Creates a human-friendly duration string with hours and minutes.
 * Used for detailed workout displays.
 * 
 * Examples:
 * - 90 minutes → "1h 30m"
 * - 60 minutes → "1h "
 * - 45 minutes → "45m"
 * 
 * @param minutes - The minutes to format
 * @returns A human-readable duration string
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 
    ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    : `${mins}m`;
};

/**
 * Calculate total duration from an array of workouts
 * 
 * Sums the duration property from multiple workout objects.
 * Used for aggregating total training time.
 * 
 * @param workouts - Array of workouts with duration property
 * @returns Total duration in minutes
 */
export const calculateTotalDuration = (workouts: { duration: number }[]): number => {
  return workouts.reduce((total, workout) => total + workout.duration, 0);
};