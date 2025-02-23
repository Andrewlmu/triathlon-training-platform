import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Workout, WorkoutType, WorkoutSection, SectionType } from '@/types/workout';
import SectionBuilder from './SectionBuilder';

interface WorkoutBuilderProps {
  date: Date;
  onClose: () => void;
  onSave: (workout: Workout) => void;
}

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ date, onClose, onSave }) => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Bike');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState<WorkoutSection[]>([]);

  const handleAddSection = (type: SectionType) => {
    const newSection: WorkoutSection = {
      type,
      repetitions: 1,
      intervals: []
    };
    setSections([...sections, newSection]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const workout: Workout = {
      id: Date.now().toString(), // temporary ID generation
      type: workoutType,
      title,
      description,
      date: date.toISOString(),
      sections
    };
    
    onSave(workout);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create Workout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="p-4 space-y-4">
            {/* Workout Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Type
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

            {/* Title & Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="e.g., Sweet Spot 5x10min"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                rows={2}
                placeholder="Add workout details or instructions"
              />
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {sections.map((section, index) => (
                <SectionBuilder
                  key={index}
                  section={section}
                  workoutType={workoutType}
                  onUpdate={(updatedSection) => {
                    const newSections = [...sections];
                    newSections[index] = updatedSection;
                    setSections(newSections);
                  }}
                  onDelete={() => {
                    setSections(sections.filter((_, i) => i !== index));
                  }}
                />
              ))}

              {/* Add Section Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddSection('warmup')}
                  className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" /> Add Warmup
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSection('main')}
                  className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" /> Add Main Set
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSection('cooldown')}
                  className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" /> Add Cooldown
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Create Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutBuilder;