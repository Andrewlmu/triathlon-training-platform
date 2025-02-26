/**
 * Defines the types of workouts available in the application
 * Each type represents a different triathlon discipline
 */
export type WorkoutType = 'Bike' | 'Run' | 'Swim';

/**
 * Workout interface representing the structure of a training session
 * Contains all necessary data to display and manage workouts in the calendar
 */
export interface Workout {
  /**
   * Unique identifier for the workout
   */
  id: string;

  /**
   * The type of workout (Swim, Bike, or Run)
   */
  type: WorkoutType;

  /**
   * Descriptive title of the workout
   * If not provided, will default to the workout type
   */
  title: string;

  /**
   * Optional detailed description of the workout plan
   * Can include specific intervals, intensities, and notes
   */
  description: string;

  /**
   * Duration of the workout in minutes
   * Stored as minutes internally but displayed in hours
   */
  duration: number;

  /**
   * ISO string representation of the workout date
   */
  date: string;
}