import React from 'react';
import { X, Bike, Waves, Timer } from 'lucide-react';
import { Workout } from '@/types/workout';

interface WorkoutDisplayProps {
  workout: Workout;
  onClose: () => void;
}

const minutesToHours = (minutes: number): string => {
  return (minutes / 60).toFixed(1);
};

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ workout, onClose }) => {
  const getWorkoutIcon = () => {
    switch (workout.type) {
      case "Swim":
        return <Waves className="h-5 w-5 text-blue-500" />;
      case "Bike":
        return <Bike className="h-5 w-5 text-green-500" />;
      case "Run":
        return <Timer className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWorkoutIcon()}
            <h2 className="text-xl font-semibold">{workout.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4 text-sm text-gray-600">
            Duration: {minutesToHours(workout.duration)} hours
          </div>
          
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans">{workout.description}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDisplay;