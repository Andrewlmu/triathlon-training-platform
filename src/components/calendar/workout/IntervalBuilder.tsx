import React from 'react';
import { Trash } from 'lucide-react';
import { WorkoutInterval, IntensityType, WorkoutType } from '@/types/workout';

interface IntervalBuilderProps {
  interval: WorkoutInterval;
  workoutType: WorkoutType;
  onUpdate: (interval: WorkoutInterval) => void;
  onDelete: () => void;
}

const IntervalBuilder: React.FC<IntervalBuilderProps> = ({
  interval,
  workoutType,
  onUpdate,
  onDelete,
}) => {
  const getIntensityLabel = () => {
    switch (workoutType) {
      case 'Bike':
        return 'Power (% FTP)';
      case 'Run':
        return 'Pace (min/km)';
      case 'Swim':
        return 'Pace (/100m)';
    }
  };

  const getDistanceUnit = () => {
    return workoutType === 'Swim' ? 'meters' : 'km';
  };

  return (
    <div className="border rounded p-3 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Interval</h4>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={interval.duration}
            onChange={(e) => onUpdate({ ...interval, duration: Number(e.target.value) })}
            className="w-full rounded-md border border-gray-300 p-2"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Distance ({getDistanceUnit()})
          </label>
          <input
            type="number"
            value={interval.distance || 0}
            onChange={(e) => onUpdate({ ...interval, distance: Number(e.target.value) })}
            className="w-full rounded-md border border-gray-300 p-2"
            min="0"
            step={workoutType === 'Swim' ? '25' : '0.1'}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Intensity Type
          </label>
          <select
            value={interval.intensity.type}
            onChange={(e) => onUpdate({
              ...interval,
              intensity: { ...interval.intensity, type: e.target.value as IntensityType }
            })}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="power">Power</option>
            <option value="pace">Pace</option>
            <option value="heartrate">Heart Rate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {getIntensityLabel()}
          </label>
          <input
            type="number"
            value={interval.intensity.value}
            onChange={(e) => onUpdate({
              ...interval,
              intensity: { ...interval.intensity, value: Number(e.target.value) }
            })}
            className="w-full rounded-md border border-gray-300 p-2"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rest Duration (minutes)
        </label>
        <input
          type="number"
          value={interval.restDuration || 0}
          onChange={(e) => onUpdate({ ...interval, restDuration: Number(e.target.value) })}
          className="w-full rounded-md border border-gray-300 p-2"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={interval.description || ''}
          onChange={(e) => onUpdate({ ...interval, description: e.target.value })}
          className="w-full rounded-md border border-gray-300 p-2"
          rows={2}
          placeholder="Optional interval description"
        />
      </div>
    </div>
  );
};

export default IntervalBuilder;