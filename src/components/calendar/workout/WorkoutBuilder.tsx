"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Workout, WorkoutType } from '@/types/workout';

/**
 * Props interface for the WorkoutBuilder component
 */
interface WorkoutBuilderProps {
  date: Date;                           // The date for this workout
  workout?: Workout | null;             // Optional existing workout for editing
  onClose: () => void;                  // Function to close the modal
  onSave: (workout: Workout) => void;   // Function to save the workout
}

/**
 * Convert hours (decimal) to minutes (integer)
 * @param hours Number of hours as a decimal
 * @returns Equivalent minutes as an integer
 */
const hoursToMinutes = (hours: number): number => {
  return Math.round(hours * 60);
};

/**
 * Convert minutes to hours with fixed decimal format
 * @param minutes Number of minutes
 * @returns Formatted hours string with one decimal place
 */
const minutesToHours = (minutes: number): string => {
  return (minutes / 60).toFixed(1);
};

/**
 * WorkoutBuilder Component
 * 
 * Modal component for creating new workouts or editing existing ones.
 * Handles form state and validation for workout details.
 */
const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ date, workout, onClose, onSave }) => {
  // Form state
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Bike');
  const [title, setTitle] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [description, setDescription] = useState('');

  // Load existing workout data when editing
  useEffect(() => {
    if (workout) {
      setWorkoutType(workout.type);
      setTitle(workout.title);
      setDurationHours(minutesToHours(workout.duration));
      setDescription(workout.description);
    }
  }, [workout]);

  /**
   * Handle duration input with validation for numbers and decimal point
   * @param value The input string to validate
   */
  const handleDurationInput = (value: string) => {
    // Allow empty string and decimal point
    if (value === '' || value === '.') {
      setDurationHours(value);
      return;
    }

    // Only allow numbers and one decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    if (cleaned.match(/^\d*\.?\d*$/)) {
      setDurationHours(cleaned);
    }
  };

  /**
   * Handle form submission and save the workout
   * @param e Form submit event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedWorkout: Workout = {
      id: workout?.id || Date.now().toString(),
      type: workoutType,
      title: title.trim() || workoutType, // Default to workout type if no title provided
      description,
      duration: hoursToMinutes(parseFloat(durationHours) || 0),
      date: date.toISOString(),
    };

    onSave(updatedWorkout);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg shadow-2xl w-full max-w-lg border border-[#333333]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#333333] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {workout ? 'Edit Workout' : 'Add Workout'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workout Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Workout Type Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Type
            </label>
            <select
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value as WorkoutType)}
              className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none"
              aria-label="Workout type"
            >
              <option value="Bike">Bike</option>
              <option value="Run">Run</option>
              <option value="Swim">Swim</option>
            </select>
          </div>

          {/* Workout Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white placeholder-[#666666] focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none"
              placeholder="e.g., Sweet Spot Intervals (optional)"
              aria-label="Workout title"
            />
          </div>

          {/* Workout Duration */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Duration (hours)
            </label>
            <input
              type="text"
              value={durationHours}
              onChange={(e) => handleDurationInput(e.target.value)}
              className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none"
              placeholder=""
              required
              aria-label="Workout duration in hours"
            />
          </div>

          {/* Workout Details/Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Workout Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white placeholder-[#666666] focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none"
              rows={6}
              placeholder="Enter your workout details here (optional)"
              aria-label="Workout details"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-[#333333] hover:bg-[#444444] rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-[#121212] bg-[#FFD700] hover:bg-[#F0C800] rounded-md transition"
            >
              {workout ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutBuilder;