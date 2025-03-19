"use client";

import React from 'react';
import { X, Edit, Trash, Bike, Footprints, Waves } from 'lucide-react';
import { format } from 'date-fns';
import { Workout } from '@/types/workout';
import { useWorkouts } from '@/context/WorkoutContext';
import { useLabels } from '@/context/LabelContext';

interface WorkoutDisplayProps {
  workout: Workout;
  onClose: () => void;
  onEdit?: () => void;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ 
  workout, 
  onClose,
  onEdit
}) => {
  const { deleteWorkout } = useWorkouts();
  const { labels } = useLabels();
  
  // Find the workout label if it exists
  const workoutLabel = workout.labelId 
    ? labels.find(l => l.id === workout.labelId) 
    : null;

  const handleDelete = async () => {
    // Removed confirmation dialog
    try {
      await deleteWorkout(workout.id);
      onClose();
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 
      ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`
      : `${mins}m`;
  };

  const getWorkoutIcon = (type: "Bike" | "Run" | "Swim") => {
    switch (type) {
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
      <div className="bg-[#1E1E1E] rounded-lg shadow-2xl w-full max-w-lg border border-[#333333]">
        <div className="p-4 border-b border-[#333333] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            {getWorkoutIcon(workout.type)}
            <span>{workout.title}</span>
          </h2>
          <button onClick={onClose} className="text-[#A0A0A0] hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-[#252525] rounded-md text-[#A0A0A0]">
                {format(new Date(workout.date), 'MMM d, yyyy')}
              </div>
              <div className="px-3 py-1 bg-[#252525] rounded-md text-[#A0A0A0]">
                {formatDuration(workout.duration)}
              </div>
            </div>
            
            {workoutLabel && (
              <div 
                className="px-3 py-1 rounded-md text-white"
                style={{ 
                  backgroundColor: `${workoutLabel.color}66`,
                }}
              >
                {workoutLabel.name}
              </div>
            )}
          </div>

          {workout.description && (
            <div className="mt-4 bg-[#252525] rounded-md p-4 text-white">
              <p className="whitespace-pre-line">{workout.description}</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#333333] flex justify-between">
          <div>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#E63946] hover:bg-[#D32F2F] rounded-md transition"
            >
              <Trash className="h-4 w-4" />
              Delete
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-[#333333] hover:bg-[#444444] rounded-md transition"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#121212] bg-[#FFD700] hover:bg-[#F0C800] rounded-md transition"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDisplay;