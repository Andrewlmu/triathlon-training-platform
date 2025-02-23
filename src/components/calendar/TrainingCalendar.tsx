"use client";

import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addMonths } from "date-fns";
import WorkoutModal from "./WorkoutModal";

interface Workout {
  type: "Swim" | "Bike" | "Run";
  duration: number;
}

const TrainingCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [workouts, setWorkouts] = useState<{ [date: string]: Workout }>({});

  // Ensure full week view (including previous/next month's trailing days)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const weekStart = startOfWeek(monthStart);
  const weekEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handleSaveWorkout = (date: Date, workout: Workout) => {
    setWorkouts((prev) => ({
      ...prev,
      [date.toDateString()]: workout,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex gap-2">
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="p-2 hover:bg-gray-100 rounded">Previous</button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded">Next</button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-px bg-grey-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium">{day}</div>
        ))}

        {/* Calendar Days */}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            onClick={() => setSelectedDate(day)}
            className={`min-h-24 p-2 border cursor-pointer ${isSameMonth(day, currentMonth) ? "bg-gray-500" : "bg-gray-100 text-gray-400"}`}
          >
            <span className="text-sm">{format(day, "d")}</span>
            {workouts[day.toDateString()] && (
              <div className="mt-1 text-xs text-gray-900">
                {workouts[day.toDateString()].type} - {workouts[day.toDateString()].duration} min
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Workout Modal */}
      {selectedDate && (
        <WorkoutModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          onSave={(workout) => handleSaveWorkout(selectedDate, workout)}
        />
      )}
    </div>
  );
};

export default TrainingCalendar;
