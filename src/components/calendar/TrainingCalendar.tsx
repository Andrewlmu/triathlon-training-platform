"use client";

import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addMonths } from "date-fns";
import { Bike, Waves, Timer, Plus } from "lucide-react";
import WorkoutBuilder from "./workout/WorkoutBuilder";
import WorkoutDisplay from "./workout/WorkoutDisplay";
import { Workout } from "@/types/workout";

interface DayWorkouts {
    [date: string]: Workout[];
}

const TrainingCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [workouts, setWorkouts] = useState<DayWorkouts>({});

    // Ensure full week view (including previous/next month's trailing days)
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const weekStart = startOfWeek(monthStart);
    const weekEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const handleSaveWorkout = (date: Date, workout: Workout) => {
        setWorkouts(prev => {
            const dateStr = date.toDateString();
            const existingWorkouts = prev[dateStr] || [];
            return {
                ...prev,
                [dateStr]: [...existingWorkouts, workout]
            };
        });
    };

    const getWorkoutIcon = (type: "Bike" | "Run" | "Swim") => {
        switch (type) {
            case "Swim":
                return <Waves className="h-4 w-4 text-blue-500" />;
            case "Bike":
                return <Bike className="h-4 w-4 text-green-500" />;
            case "Run":
                return <Timer className="h-4 w-4 text-red-500" />;
        }
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
                        className={`min-h-24 p-2 border cursor-pointer ${isSameMonth(day, currentMonth) ? "bg-white" : "bg-gray-50 text-gray-400"
                            }`}
                    >
                        <span className="text-sm">{format(day, "d")}</span>
                        <div className="mt-1 space-y-1">
                            {workouts[day.toDateString()]?.map((workout, idx) => (
                                <div
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedWorkout(workout);
                                    }}
                                    className="flex items-center gap-1 text-xs p-1 rounded bg-gray-50 cursor-pointer hover:bg-gray-100"
                                >
                                    {getWorkoutIcon(workout.type)}
                                    <span>{workout.title}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setSelectedDate(day)}
                            className="mt-1 flex items-center text-xs text-gray-500 hover:text-gray-700"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Workout Builder Modal */}
            {selectedDate && (
                <WorkoutBuilder
                    date={selectedDate}
                    onClose={() => setSelectedDate(null)}
                    onSave={(workout) => handleSaveWorkout(selectedDate, workout)}
                />
            )}

            {/* Workout Display Modal */}
            {selectedWorkout && (
                <WorkoutDisplay
                    workout={selectedWorkout}
                    onClose={() => setSelectedWorkout(null)}
                />
            )}
        </div>
    );
};

export default TrainingCalendar;