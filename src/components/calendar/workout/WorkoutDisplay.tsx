"use client";

import React from 'react';
import { X, Bike, Waves, Footprints } from 'lucide-react';
import { Workout } from '@/types/workout';

/**
 * Props interface for the WorkoutDisplay component
 */
interface WorkoutDisplayProps {
  workout: Workout;        // The workout to display
  onClose: () => void;     // Function to close the modal
}

/**
 * Convert minutes to hours with fixed decimal format
 * @param minutes Number of minutes
 * @returns Formatted hours string with one decimal place
 */
const minutesToHours = (minutes: number): string => {
  return (minutes / 60).toFixed(1);
};

/**
 * WorkoutDisplay Component
 * 
 * Modal to display detailed information about a workout.
 * Shows title, type, duration, and full description.
 */
const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ workout, onClose }) => {
  /**
   * Get the appropriate icon for the workout type
   * @returns React node with the corresponding icon
   */
  const getWorkoutIcon = () => {
    switch (workout.type) {
      case "Swim":
        return <Waves className="h-5 w-5 text-[#00CED1]" />;
      case "Bike":
        return <Bike className="h-5 w-5 text-[#1E90FF]" />;
      case "Run":
        return <Footprints className="h-5 w-5 text-[#E63946]" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg shadow-xl w-full max-w-2xl border border-[#333333]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#333333] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWorkoutIcon()}
            <h2 className="text-xl font-semibold text-white">{workout.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workout Content */}
        <div className="p-4">
          {/* Duration Display */}
          <div className="mb-4 text-[#FFD700] font-medium">
            Duration: {minutesToHours(workout.duration)} hours
          </div>

          {/* Description (if available) */}
          {workout.description && (
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans bg-transparent text-white border-none p-0">{workout.description}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDisplay;