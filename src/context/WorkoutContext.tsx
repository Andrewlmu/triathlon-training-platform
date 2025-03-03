"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workout } from '@/types/workout';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();

  // Fetch workouts from API on mount or when session changes
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

  // Add a new workout
  const addWorkout = async (workoutData: Omit<Workout, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Workout> => {
    if (!session?.user?.id) {
      throw new Error('You must be logged in to add a workout');
    }
    
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Spread the workoutData object to make sure all properties (including labelId) are included
        body: JSON.stringify({
          ...workoutData
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add workout');
      }
  
      const newWorkout = await response.json();
      setWorkouts(prev => [newWorkout, ...prev]);
      return newWorkout;
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  };

  // Update an existing workout
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