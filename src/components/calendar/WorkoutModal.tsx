import React, { useState } from "react";

interface Workout {
  type: "Swim" | "Bike" | "Run";
  duration: number;
}

interface WorkoutModalProps {
  date: Date;
  onClose: () => void;
  onSave: (workout: Workout) => void;
}

const WorkoutModal: React.FC<WorkoutModalProps> = ({ date, onClose, onSave }) => {
  const [workout, setWorkout] = useState<Workout>({ type: "Bike", duration: 60 });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-80">
        <h3 className="text-gray-900 font-bold">Add Workout for {date.toDateString()}</h3>
        <select
          value={workout.type}
          onChange={(e) => setWorkout({ ...workout, type: e.target.value as Workout["type"] })}
          className="text-gray-900 border p-2 my-2 w-full"
        >
          <option>Swim</option>
          <option>Bike</option>
          <option>Run</option>
        </select>
        <input
          type="number"
          value={workout.duration}
          onChange={(e) => setWorkout({ ...workout, duration: Number(e.target.value) })}
          className="text-gray-900 border p-2 my-2 w-full"
          placeholder="Duration (min)"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={onClose} className="px-3 py-1 border rounded bg-red-500">Cancel</button>
          <button onClick={() => { onSave(workout); onClose(); }} className="px-3 py-1 bg-blue-500 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutModal;
