/**
 * Format minutes into hours display format
 * @param minutes - The minutes to format
 * @returns A string representation of hours
 */
export const formatHours = (minutes: number): string => {
  const hours = minutes / 60;
  return hours.toFixed(1);
};

/**
 * Format minutes into a more readable duration format (Xh Ym)
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
 * @param workouts - Array of workouts with duration property
 * @returns Total duration in minutes
 */
export const calculateTotalDuration = (workouts: { duration: number }[]): number => {
  return workouts.reduce((total, workout) => total + workout.duration, 0);
};