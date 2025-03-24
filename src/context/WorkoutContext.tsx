"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workout } from '@/types/workout';
import { useSession } from 'next-auth/react';
import { startOfWeek, endOfWeek, eachDayOfInterval, addDays, differenceInDays } from 'date-fns';

/**
 * WorkoutContextType Interface
 * 
 * Defines the shape of the workout context including state and methods
 * for manipulating workouts throughout the application.
 */
interface WorkoutContextType {
  workouts: Workout[];
  isLoading: boolean;
  addWorkout: (workout: Workout) => Promise<Workout>;
  updateWorkout: (id: string, updatedWorkout: Workout) => Promise<Workout>;
  deleteWorkout: (id: string) => Promise<boolean>;
  reorderWorkouts: (workoutsToUpdate: { id: string; order: number; date?: string }[]) => Promise<boolean>;
  moveWorkout: (id: string, newDate: Date, newOrder: number) => Promise<boolean>;
  copyWorkoutsToWeek: (sourceWeekStart: Date, targetWeekStart: Date) => Promise<boolean>;
}

// Create context with default values
const WorkoutContext = createContext<WorkoutContextType>({
  workouts: [],
  isLoading: true,
  addWorkout: async () => ({ id: '', type: 'Bike', title: '', date: '', duration: 0, order: 0, description: '', userId: '' } as Workout),
  updateWorkout: async () => ({ id: '', type: 'Bike', title: '', date: '', duration: 0, order: 0, description: '', userId: '' } as Workout),
  deleteWorkout: async () => false,
  reorderWorkouts: async () => false,
  moveWorkout: async () => false,
  copyWorkoutsToWeek: async () => false
});

/**
 * Custom hook to access the WorkoutContext
 * 
 * @returns WorkoutContextType object with workout state and functions
 */
export const useWorkouts = () => useContext(WorkoutContext);

/**
 * WorkoutProvider Component
 * 
 * Provides workout state and CRUD operations to the application.
 * Manages API interactions, loading states, and optimistic updates.
 * 
 * @param children - Child components that will have access to the workout context
 * @returns Provider component wrapping children with workout context
 */
export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  /**
   * Fetch workouts from API when session changes
   * Loads all user workouts with their associated labels
   */
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!session) {
        setWorkouts([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/workouts?include=label');
        
        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }
        
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setWorkouts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [session]);

  /**
   * Add a new workout to the database
   * 
   * @param workout - The workout data to add
   * @returns The newly created workout with server-generated ID
   * @throws Error if not logged in or if creation fails
   */
  const addWorkout = async (workout: Workout): Promise<Workout> => {
    if (!session?.user?.id) {
      throw new Error('You must be logged in to add a workout');
    }
    
    try {
      const workoutWithUserId = {
        ...workout,
        userId: session.user.id
      };
      
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutWithUserId),
      });

      if (!response.ok) {
        throw new Error('Failed to create workout');
      }

      const newWorkout = await response.json();
      
      // Optimistically update state with the new workout
      setWorkouts(prev => [...prev, newWorkout]);
      return newWorkout;
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  };

  /**
   * Update an existing workout in the database
   * 
   * @param id - The ID of the workout to update
   * @param updatedWorkout - The updated workout data
   * @returns The updated workout from the server
   * @throws Error if not logged in or if update fails
   */
  const updateWorkout = async (id: string, updatedWorkout: Workout): Promise<Workout> => {
    if (!session?.user?.id) {
      throw new Error('You must be logged in to update a workout');
    }
    
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWorkout),
      });

      if (!response.ok) {
        throw new Error('Failed to update workout');
      }

      const updated = await response.json();
      
      // Optimistically update the workout in state
      setWorkouts(prev => 
        prev.map(workout => workout.id === id ? updated : workout)
      );
      return updated;
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  };

  /**
   * Delete a workout from the database
   * 
   * @param id - The ID of the workout to delete
   * @returns Boolean indicating success
   * @throws Error if not logged in or if deletion fails
   */
  const deleteWorkout = async (id: string): Promise<boolean> => {
    if (!session?.user?.id) {
      throw new Error('You must be logged in to delete a workout');
    }
    
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }

      // Optimistically remove the workout from state
      setWorkouts(prev => prev.filter(workout => workout.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting workout:', error);
      return false;
    }
  };

  /**
   * Reorder multiple workouts at once
   * Used for drag-and-drop operations to update multiple workout positions
   * 
   * @param workoutsToUpdate - Array of workouts with new order values and optional dates
   * @returns Boolean indicating success
   * @throws Error if not logged in or if reordering fails
   */
  const reorderWorkouts = async (workoutsToUpdate: { id: string; order: number; date?: string }[]): Promise<boolean> => {
    if (!session?.user?.id) {
      throw new Error('You must be logged in to reorder workouts');
    }
    
    try {
      const response = await fetch('/api/workouts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workouts: workoutsToUpdate }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder workouts');
      }

      // After reordering, refetch all workouts to get the updated order
      // This ensures we have the correct state after complex operations
      const freshResponse = await fetch('/api/workouts?include=label');
      if (!freshResponse.ok) {
        throw new Error('Failed to fetch updated workouts');
      }
      
      const updatedWorkouts = await freshResponse.json();
      setWorkouts(updatedWorkouts);
      
      return true;
    } catch (error) {
      console.error('Error reordering workouts:', error);
      return false;
    }
  };

  /**
   * Move a single workout to a new date and/or position
   * Convenience method that uses reorderWorkouts internally
   * 
   * @param id - The ID of the workout to move
   * @param newDate - The new date for the workout
   * @param newOrder - The new order value for the workout
   * @returns Boolean indicating success
   */
  const moveWorkout = async (id: string, newDate: Date, newOrder: number): Promise<boolean> => {
    return reorderWorkouts([{ 
      id, 
      order: newOrder,
      date: newDate.toISOString()
    }]);
  };

  /**
   * Copy all workouts from one week to another
   * Maintains the same day-of-week schedule and workout ordering
   * 
   * @param sourceWeekStart - Start date of the source week (Monday)
   * @param targetWeekStart - Start date of the target week (Monday)
   * @returns Boolean indicating success
   * @throws Error if not logged in or if copying fails
   */
  const copyWorkoutsToWeek = async (sourceWeekStart: Date, targetWeekStart: Date): Promise<boolean> => {
    if (!session?.user?.id) {
      throw new Error('You must be logged in to copy workouts');
    }
    
    try {
      // Get all days in the source week
      const sourceWeekEnd = endOfWeek(sourceWeekStart, { weekStartsOn: 1 });
      const daysInSourceWeek = eachDayOfInterval({ start: sourceWeekStart, end: sourceWeekEnd });
      
      // Find workouts for each day in the source week
      const workoutsToCopy: Workout[] = [];
      
      for (const day of daysInSourceWeek) {
        // Filter workouts for this specific day
        const dayWorkouts = workouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return (
            workoutDate.getFullYear() === day.getFullYear() &&
            workoutDate.getMonth() === day.getMonth() &&
            workoutDate.getDate() === day.getDate()
          );
        });
        
        workoutsToCopy.push(...dayWorkouts);
      }
      
      if (workoutsToCopy.length === 0) {
        return false; // No workouts to copy
      }
      
      // Calculate the offset between source and target weeks
      const daysDifference = differenceInDays(targetWeekStart, sourceWeekStart);
      
      // Make API call to copy workouts
      const response = await fetch('/api/workouts/copy-week', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceWeekStart: sourceWeekStart.toISOString(),
          targetWeekStart: targetWeekStart.toISOString(),
          daysDifference
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to copy workouts');
      }

      // Refetch workouts to get the updated list including new copies
      const freshResponse = await fetch('/api/workouts?include=label');
      if (!freshResponse.ok) {
        throw new Error('Failed to fetch updated workouts');
      }
      
      const updatedWorkouts = await freshResponse.json();
      setWorkouts(updatedWorkouts);
      
      return true;
    } catch (error) {
      console.error('Error copying workouts:', error);
      return false;
    }
  };

  // Provide context to children
  return (
    <WorkoutContext.Provider value={{ 
      workouts, 
      isLoading, 
      addWorkout, 
      updateWorkout, 
      deleteWorkout,
      reorderWorkouts,
      moveWorkout,
      copyWorkoutsToWeek
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};