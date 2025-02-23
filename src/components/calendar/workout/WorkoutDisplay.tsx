import React from 'react';
import { X, Bike, Waves, Timer } from 'lucide-react';
import { Workout, WorkoutSection, WorkoutInterval } from '@/types/workout';

interface WorkoutDisplayProps {
  workout: Workout;
  onClose: () => void;
}

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

  const formatIntensity = (interval: WorkoutInterval) => {
    const { type, value } = interval.intensity;
    switch (type) {
      case 'power':
        return `${value}% FTP`;
      case 'pace':
        return workout.type === 'Swim' ? `${value}/100m` : `${value}/km`;
      case 'heartrate':
        return `${value} BPM`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWorkoutIcon()}
            <h2 className="text-xl font-semibold">{workout.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {workout.description && (
            <p className="text-gray-600 mb-4">{workout.description}</p>
          )}

          <div className="space-y-6">
            {workout.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border rounded-lg p-4">
                <h3 className="font-medium capitalize mb-2">
                  {section.type} Section {section.repetitions > 1 && `(${section.repetitions}x)`}
                </h3>
                
                <div className="space-y-3">
                  {section.intervals.map((interval, intervalIndex) => (
                    <div key={intervalIndex} className="bg-gray-50 rounded p-3">
                      <div className="flex justify-between text-sm">
                        <span>{interval.duration} minutes</span>
                        {interval.distance && (
                          <span>{interval.distance} {workout.type === 'Swim' ? 'm' : 'km'}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatIntensity(interval)}
                        {interval.restDuration && ` + ${interval.restDuration}min rest`}
                      </div>
                      {interval.description && (
                        <p className="text-sm text-gray-500 mt-1">{interval.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDisplay;