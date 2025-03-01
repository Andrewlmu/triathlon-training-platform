"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workout } from '@/types/workout';

// Type for our context
interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, updatedWorkout: Workout) => void;
  deleteWorkout: (id: string) => void;
}

// Create context with default values
const WorkoutContext = createContext<WorkoutContextType>({
  workouts: [],
  addWorkout: () => { },
  updateWorkout: () => { },
  deleteWorkout: () => { }
});

// Hook to use the context
export const useWorkouts = () => useContext(WorkoutContext);

// Provider component that wraps your app
export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  // State for all workouts as a flat array
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      try {
        // Convert from old format if needed
        const parsed = JSON.parse(savedWorkouts);

        if (Array.isArray(parsed)) {
          // Already in the right format
          setWorkouts(parsed);
        } else {
          // Convert from record format to array
          const workoutArray: Workout[] = [];
          Object.entries(parsed).forEach(([dateKey, dateWorkouts]) => {
            if (Array.isArray(dateWorkouts)) {
              workoutArray.push(...dateWorkouts);
            }
          });
          setWorkouts(workoutArray);
        }
      } catch (error) {
        console.error('Error loading workouts:', error);
      }
    }
  }, []);

  // Save to localStorage when workouts change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  // Add a new workout
  const addWorkout = (workout: Workout) => {
    setWorkouts(prev => [...prev, workout]);
  };

  // Update an existing workout
  const updateWorkout = (id: string, updatedWorkout: Workout) => {
    setWorkouts(prev =>
      prev.map(workout => workout.id === id ? updatedWorkout : workout)
    );
  };

  // Delete a workout
  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  };

  // Provide context to children
  return (
    <WorkoutContext.Provider value={{ workouts, addWorkout, updateWorkout, deleteWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};