"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Workout, WorkoutType } from '@/types/workout';
import { useLabels } from '@/context/LabelContext';

/**
 * WorkoutBuilderProps Interface
 * 
 * Props for the WorkoutBuilder component that creates or edits workouts
 */
interface WorkoutBuilderProps {
  date: Date;
  workout?: Workout | null;
  onClose: () => void;
  onSave: (workout: Workout) => void;
}

/**
 * Convert hours (with decimals) to minutes
 * 
 * @param hours - Duration in hours (e.g., 1.5 for 1.5 hours)
 * @returns Number of minutes (e.g., 90 minutes)
 */
const hoursToMinutes = (hours: number): number => {
  return Math.round(hours * 60);
};

/**
 * Convert minutes to hours formatted as a string with one decimal place
 * 
 * @param minutes - Duration in minutes
 * @returns Formatted hours string (e.g., "1.5")
 */
const minutesToHours = (minutes: number): string => {
  return (minutes / 60).toFixed(1);
};

/**
 * WorkoutBuilder Component
 * 
 * Modal form for creating new workouts or editing existing ones.
 * Provides fields for all workout attributes: type, title, label, duration, and details.
 * 
 * @param date - The date for the workout
 * @param workout - Optional existing workout data (if editing)
 * @param onClose - Function to call when closing the form
 * @param onSave - Function to call when saving the workout
 * @returns A modal form component for workout creation/editing
 */
const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ date, workout, onClose, onSave }) => {
  // State for form fields
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Bike');
  const [title, setTitle] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [description, setDescription] = useState('');
  const [labelId, setLabelId] = useState<string>('');

  const { labels, createDefaultLabels } = useLabels();

  // Create default labels when component mounts if none exist
  useEffect(() => {
    if (labels.length === 0) {
      createDefaultLabels();
    }
  }, [createDefaultLabels, labels.length]);

  // Load existing workout data if editing
  useEffect(() => {
    if (workout) {
      setWorkoutType(workout.type);
      setTitle(workout.title);
      setDurationHours(minutesToHours(workout.duration));
      setDescription(workout.description);
      setLabelId(workout.labelId || '');
    }
  }, [workout]);

  /**
   * Validate and handle duration input, ensuring only valid numerical entries
   * 
   * @param value - The input string from the duration field
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
   * Handle form submission
   * Creates a new workout object or updates an existing one
   * 
   * @param e - Form submit event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedWorkout: Workout = {
      id: workout?.id || Date.now().toString(),
      type: workoutType,
      title: title.trim() || workoutType,  // Use type as title if not provided
      description,
      duration: hoursToMinutes(parseFloat(durationHours) || 0),
      date: date.toISOString(),
      labelId: labelId || undefined,
      userId: workout?.userId || '',
      order: workout?.order || 0,
    };

    onSave(updatedWorkout);
    onClose();
  };

  // Order labels by training intensity for better UX
  const orderedLabels = [...labels].sort((a, b) => {
    // Predefined physiological order of training zones
    const zoneOrder = [
      'Recovery',
      'Zone 2',
      'Tempo',
      'Sweet Spot',
      'Threshold',
      'VO2 Max',
      'Anaerobic',
      'Sprints',
    ];

    const indexA = zoneOrder.indexOf(a.name);
    const indexB = zoneOrder.indexOf(b.name);

    // If both labels are in our predefined order, sort by that order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one label is in our predefined order, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // Otherwise sort alphabetically
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg shadow-2xl w-full max-w-lg border border-[#333333]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#333333] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {workout ? 'Edit Workout' : 'Add Workout'}
          </h2>
          <button onClick={onClose} className="text-[#A0A0A0] hover:text-white transition">
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
            >
              <option value="Bike">Bike</option>
              <option value="Run">Run</option>
              <option value="Swim">Swim</option>
            </select>
          </div>

          {/* Workout Title Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none"
              placeholder="e.g., Sweet Spot Intervals (optional)"
            />
          </div>

          {/* Workout Label Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Label
            </label>
            <div className="relative">
              <select
                value={labelId}
                onChange={(e) => setLabelId(e.target.value)}
                className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none appearance-none"
              >
                <option value="">No label</option>
                {orderedLabels.map(label => (
                  <option key={label.id} value={label.id}>
                    {label.name}
                  </option>
                ))}
              </select>
              {/* Color indicator for selected label */}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{
                    backgroundColor: labelId
                      ? labels.find(l => l.id === labelId)?.color || 'transparent'
                      : 'transparent'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Duration Input */}
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
            />
          </div>

          {/* Workout Details Textarea */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Workout Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none"
              rows={6}
              placeholder="Enter your workout details here (optional)"
            />
          </div>

          {/* Form Buttons */}
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