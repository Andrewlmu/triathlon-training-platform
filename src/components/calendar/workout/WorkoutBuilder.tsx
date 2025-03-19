"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Workout, WorkoutType } from '@/types/workout';
import { useLabels } from '@/context/LabelContext';

interface WorkoutBuilderProps {
  date: Date;
  workout?: Workout | null;
  onClose: () => void;
  onSave: (workout: Workout) => void;
}

const hoursToMinutes = (hours: number): number => {
  return Math.round(hours * 60);
};

const minutesToHours = (minutes: number): string => {
  return (minutes / 60).toFixed(1);
};

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ date, workout, onClose, onSave }) => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Bike');
  const [title, setTitle] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [description, setDescription] = useState('');
  const [labelId, setLabelId] = useState<string>('');
  
  const { labels, createDefaultLabels } = useLabels();

  // Create default labels when component mounts
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedWorkout: Workout = {
      id: workout?.id || Date.now().toString(),
      type: workoutType,
      title: title.trim() || workoutType,
      description,
      duration: hoursToMinutes(parseFloat(durationHours) || 0),
      date: date.toISOString(),
      labelId: labelId || undefined,
      userId: workout?.userId || '',
      order: workout?.order || 0,
    };
    
    console.log("Saving workout with labelId:", labelId);
    
    onSave(updatedWorkout);
    onClose();
  };

  // Order labels by training intensity
  const orderedLabels = [...labels].sort((a, b) => {
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
        <div className="p-4 border-b border-[#333333] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {workout ? 'Edit Workout' : 'Add Workout'}
          </h2>
          <button onClick={onClose} className="text-[#A0A0A0] hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
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