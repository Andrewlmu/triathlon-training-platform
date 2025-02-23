import React from 'react';
import { Plus, Trash, GripVertical } from 'lucide-react';
import { WorkoutSection, WorkoutInterval, WorkoutType } from '@/types/workout';
import IntervalBuilder from './IntervalBuilder';

interface SectionBuilderProps {
  section: WorkoutSection;
  workoutType: WorkoutType;
  onUpdate: (section: WorkoutSection) => void;
  onDelete: () => void;
}

const SectionBuilder: React.FC<SectionBuilderProps> = ({ 
  section, 
  workoutType,
  onUpdate, 
  onDelete 
}) => {
  const handleAddInterval = () => {
    const newInterval: WorkoutInterval = {
      duration: 10,
      intensity: {
        type: 'power',
        value: 70
      }
    };
    
    onUpdate({
      ...section,
      intervals: [...section.intervals, newInterval]
    });
  };

  const handleUpdateInterval = (index: number, updatedInterval: WorkoutInterval) => {
    const newIntervals = [...section.intervals];
    newIntervals[index] = updatedInterval;
    onUpdate({
      ...section,
      intervals: newIntervals
    });
  };

  const handleDeleteInterval = (index: number) => {
    onUpdate({
      ...section,
      intervals: section.intervals.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400" />
          <h3 className="font-medium capitalize">{section.type} Section</h3>
        </div>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Repetitions
        </label>
        <input
          type="number"
          min="1"
          value={section.repetitions}
          onChange={(e) => onUpdate({ ...section, repetitions: Number(e.target.value) })}
          className="w-24 rounded-md border border-gray-300 p-2"
        />
      </div>

      <div className="space-y-4">
        {section.intervals.map((interval, index) => (
          <IntervalBuilder
            key={index}
            interval={interval}
            workoutType={workoutType}
            onUpdate={(updatedInterval) => handleUpdateInterval(index, updatedInterval)}
            onDelete={() => handleDeleteInterval(index)}
          />
        ))}

        <button
          type="button"
          onClick={handleAddInterval}
          className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" /> Add Interval
        </button>
      </div>
    </div>
  );
};

export default SectionBuilder;