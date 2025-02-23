import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Workout, WorkoutType } from '@/types/workout';

interface WorkoutBuilderProps {
  date: Date;
  onClose: () => void;
  onSave: (workout: Workout) => void;
}

const hoursToMinutes = (hours: number): number => {
  return Math.round(hours * 60);
};

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ date, onClose, onSave }) => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Bike');
  const [title, setTitle] = useState('');
  const [durationHours, setDurationHours] = useState('1');
  const [description, setDescription] = useState('');

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
    
    const workout: Workout = {
      id: Date.now().toString(),
      type: workoutType,
      title: title.trim() || workoutType,
      description,
      duration: hoursToMinutes(parseFloat(durationHours) || 0),
      date: date.toISOString(),
    };
    
    onSave(workout);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Workout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value as WorkoutType)}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="Bike">Bike</option>
              <option value="Run">Run</option>
              <option value="Swim">Swim</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="e.g., Sweet Spot Intervals"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (hours)
            </label>
            <input
              type="text"
              value={durationHours}
              onChange={(e) => handleDurationInput(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="1.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workout Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              rows={6}
              placeholder="Enter your workout details here..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Save Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutBuilder;