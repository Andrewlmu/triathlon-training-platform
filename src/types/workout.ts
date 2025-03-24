/**
 * Type definitions for workouts and related entities
 * Used throughout the application for consistent typing
 */

/**
 * WorkoutType
 *
 * Represents the type of triathlon workout activity
 */
export type WorkoutType = 'Bike' | 'Run' | 'Swim';

/**
 * WorkoutLabel Interface
 *
 * Represents a label for categorizing workouts by training intensity
 * Each label has a name, color, and associated user
 */
export interface WorkoutLabel {
  id: string;
  name: string; // Label name (e.g., "Recovery", "Tempo", "Threshold")
  color: string; // Hex color code for visual distinction
  userId: string; // Owner of the label
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Workout Interface
 *
 * Represents a training session in the athlete's schedule
 * Contains all information about a specific workout
 */
export interface Workout {
  id: string;
  type: WorkoutType; // Sport type (Swim, Bike, Run)
  title: string; // Short descriptive title
  description: string; // Detailed workout instructions
  duration: number; // Duration in minutes
  date: string; // ISO date string
  order: number; // Sorting order for the day
  labelId?: string; // Optional reference to intensity label
  label?: WorkoutLabel; // Optional label object (when included)
  userId: string; // Owner of the workout
  createdAt?: string;
  updatedAt?: string;
}

/**
 * WorkoutMove Interface
 *
 * Used for drag-and-drop operations to track workout movements
 */
export interface WorkoutMove {
  id: string; // ID of the workout being moved
  sourceDate: string; // Original date
  sourceIndex: number; // Original position
  destinationDate: string; // New date
  destinationIndex: number; // New position
}
