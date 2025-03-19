"use client";

import { useState, useEffect } from 'react';
import { Workout } from '@/types/workout';

/**
 * Helper function to create consistent date keys for storage
 * Formats a Date object into a string like 'YYYY-MM-DD'
 * @param date The date to convert to a storage key
 * @return A string key for the date
 */
export const getDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

/**
 * Interface defining the workout store operations
 */
interface WorkoutStore {
  workouts: Record<string, Workout[]>;
  addWorkout: (date: Date, workout: Workout) => void;
  updateWorkout: (date: Date, workoutId: string, updatedWorkout: Workout) => void;
  deleteWorkout: (date: Date, workoutId: string) => void;
  moveWorkout: (fromDate: Date, toDate: Date, workoutId: string) => void;
  version: number; // Added version property to track changes
}

/**
 * Custom hook for managing workout data with localStorage persistence
 * Implements CRUD operations for workout management
 * @returns Object with workout data and methods to manipulate it
 */
export function useWorkoutStore(): WorkoutStore {
  // State to store workouts organized by date
  const [workouts, setWorkouts] = useState<Record<string, Workout[]>>({});
  // Flag to track if initial data has been loaded from localStorage
  const [isInitialized, setIsInitialized] = useState(false);
  // Version counter to force updates when workouts change
  const [version, setVersion] = useState(0);

  // Load workouts from localStorage on component mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWorkouts = localStorage.getItem('workouts');
      if (savedWorkouts) {
        try {
          setWorkouts(JSON.parse(savedWorkouts));
        } catch (error) {
          console.error('Error parsing workouts from localStorage:', error);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('workouts', JSON.stringify(workouts));
      // Increment version to notify subscribers of a change
      setVersion(v => v + 1);
    }
  }, [workouts, isInitialized]);

  /**
   * Add a new workout to a specific date
   * @param date The date to add the workout to
   * @param workout The workout to add
   */
  const addWorkout = (date: Date, workout: Workout) => {
    const dateKey = getDateKey(date);
    setWorkouts(prev => {
      const existingWorkouts = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: [...existingWorkouts, workout]
      };
    });
  };

  /**
   * Update an existing workout
   * @param date The date the workout is on
   * @param workoutId The ID of the workout to update
   * @param updatedWorkout The updated workout data
   */
  const updateWorkout = (date: Date, workoutId: string, updatedWorkout: Workout) => {
    const dateKey = getDateKey(date);
    setWorkouts(prev => {
      const existingWorkouts = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: existingWorkouts.map(workout => 
          workout.id === workoutId ? updatedWorkout : workout
        )
      };
    });
  };

  /**
   * Delete a workout
   * @param date The date the workout is on
   * @param workoutId The ID of the workout to delete
   */
  const deleteWorkout = (date: Date, workoutId: string) => {
    const dateKey = getDateKey(date);
    setWorkouts(prev => {
      const existingWorkouts = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: existingWorkouts.filter(workout => workout.id !== workoutId)
      };
    });
  };

  /**
   * Move a workout from one date to another
   * @param fromDate The original date of the workout
   * @param toDate The destination date to move the workout to
   * @param workoutId The ID of the workout to move
   */
  const moveWorkout = (fromDate: Date, toDate: Date, workoutId: string) => {
    const fromDateKey = getDateKey(fromDate);
    const toDateKey = getDateKey(toDate);
    
    setWorkouts(prev => {
      const fromWorkouts = prev[fromDateKey] || [];
      const toWorkouts = prev[toDateKey] || [];
      
      // Find the workout to move
      const workoutToMove = fromWorkouts.find(w => w.id === workoutId);
      if (!workoutToMove) return prev;
      
      // Return updated state with workout moved to new date
      return {
        ...prev,
        [fromDateKey]: fromWorkouts.filter(w => w.id !== workoutId),
        [toDateKey]: [...toWorkouts, { ...workoutToMove, date: toDate.toISOString() }]
      };
    });
  };

  return { workouts, addWorkout, updateWorkout, deleteWorkout, moveWorkout, version };
}