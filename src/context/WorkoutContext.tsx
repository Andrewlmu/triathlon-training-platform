"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workout } from '@/types/workout';

// Type for our context
interface WorkoutContextType {
  workouts: Workout[];
  isLoading: boolean;
  addWorkout: (workout: Workout) => Promise<Workout>;
  updateWorkout: (id: string, updatedWorkout: Workout) => Promise<Workout>;
  deleteWorkout: (id: string) => Promise<boolean>;
}

// Create context with default values
const WorkoutContext = createContext<WorkoutContextType>({
  workouts: [],
  isLoading: true,
  addWorkout: async () => ({ id: '', type: 'Bike', title: '', date: '', duration: 0 } as Workout),
  updateWorkout: async () => ({ id: '', type: 'Bike', title: '', date: '', duration: 0 } as Workout),
  deleteWorkout: async () => false
});

// Hook to use the context
export const useWorkouts = () => useContext(WorkoutContext);

// Provider component that wraps your app
export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch workouts from API on mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/workouts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }
        
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        // Fallback to empty array if API fails
        setWorkouts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Add a new workout
  const addWorkout = async (workout: Workout): Promise<Workout> => {
    try {
      console.log("Sending workout to API:", workout);
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
      });

      if (!response.ok) {
        throw new Error('Failed to create workout');
      }

      const newWorkout = await response.json();
      setWorkouts(prev => [...prev, newWorkout]);
      return newWorkout;
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  };

  // Update an existing workout
  const updateWorkout = async (id: string, updatedWorkout: Workout): Promise<Workout> => {
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
      setWorkouts(prev => 
        prev.map(workout => workout.id === id ? updated : workout)
      );
      return updated;
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  };

  // Delete a workout
  const deleteWorkout = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }

      setWorkouts(prev => prev.filter(workout => workout.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting workout:', error);
      return false;
    }
  };

  // Provide context to children
  return (
    <WorkoutContext.Provider value={{ workouts, isLoading, addWorkout, updateWorkout, deleteWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};