"use client";

import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addMonths, isToday } from "date-fns";
import { Bike, Waves, Footprints, Plus, Calendar } from "lucide-react";
import WorkoutBuilder from "./workout/WorkoutBuilder";
import WorkoutDisplay from "./workout/WorkoutDisplay";
import { Workout } from "@/types/workout";
import { useWorkouts } from "@/context/WorkoutContext";
import { useLabels } from "@/context/LabelContext";

/**
 * TrainingCalendar Component
 * 
 * Provides a monthly calendar view for planning and viewing triathlon workouts.
 * Allows for adding, editing, and deleting workouts on specific dates.
 */
const TrainingCalendar = () => {
  // State management for calendar view and interactions
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  
  // Get workout data and functions from context
  const { workouts, isLoading, addWorkout, updateWorkout, deleteWorkout } = useWorkouts();
  const { labels } = useLabels();

  // Initialize date state
  useEffect(() => {
    setCurrentMonth(new Date());
  }, []);

  // Show loading state while initializing
  if (!currentMonth || isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-[#121212] rounded-lg shadow-xl p-4">
        <h2 className="text-lg font-bold text-white">Loading calendar...</h2>
      </div>
    );
  }

  // Calculate calendar days for the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  /**
   * Handle saving a new workout or updating an existing one
   * @param date The date to save the workout on
   * @param workout The workout data to save
   */
  const handleSaveWorkout = async (date: Date, workout: Workout) => {
    try {
      const workoutData = {
        ...workout,
        date: date.toISOString()
      };
      
      if (editingWorkout) {
        await updateWorkout(editingWorkout.id, workoutData);
      } else {
        await addWorkout(workoutData);
      }
      
      setEditingWorkout(null);
    } catch (error) {
      console.error('Error saving workout:', error);
      // You could show an error message to the user here
    }
  };

  /**
   * Navigate to the current month
   */
  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  /**
   * Get the appropriate icon for each workout type
   * @param type The workout type
   * @returns A React node with the corresponding icon
   */
  const getWorkoutIcon = (type: "Bike" | "Run" | "Swim") => {
    switch (type) {
      case "Swim":
        return <Waves className="h-4 w-4 text-[#00CED1]" />;
      case "Bike":
        return <Bike className="h-4 w-4 text-[#1E90FF]" />;
      case "Run":
        return <Footprints className="h-4 w-4 text-[#E63946]" />;
    }
  };

  /**
   * Format duration in minutes to a readable hours format
   * @param minutes Duration in minutes
   * @returns Formatted string with hours
   */
  const formatDuration = (minutes: number): string => {
    const hours = minutes / 60;
    return `${hours.toFixed(1)}h`;
  };

  /**
   * Calculate the total duration of all workouts for a day
   * @param workouts Array of workouts for a day
   * @returns Total duration in minutes
   */
  const calculateDayTotalDuration = (workouts: Workout[]): number => {
    return workouts.reduce((total, workout) => total + workout.duration, 0);
  };

  /**
   * Get workouts for a specific date
   * @param date The date to get workouts for
   * @returns Array of workouts for that date
   */
  const getWorkoutsForDay = (date: Date): Workout[] => {
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate.getFullYear() === date.getFullYear() &&
        workoutDate.getMonth() === date.getMonth() &&
        workoutDate.getDate() === date.getDate()
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#121212] rounded-lg shadow-xl">
      {/* Calendar Header with Navigation */}
      <div className="p-4 flex items-center justify-between border-b border-[#333333] bg-[#1E1E1E]">
        <h2 className="text-lg font-bold text-white">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex gap-2">
          <button 
            onClick={goToToday} 
            className="flex items-center gap-1 px-3 py-1.5 bg-[#FFD700] text-[#121212] rounded-md hover:bg-[#F0C800] transition"
            aria-label="Go to today"
          >
            <Calendar className="h-4 w-4" />
            Today
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} 
            className="px-3 py-1.5 bg-[#252525] text-white rounded-md hover:bg-[#333333] transition"
            aria-label="Previous month"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
            className="px-3 py-1.5 bg-[#252525] text-white rounded-md hover:bg-[#333333] transition"
            aria-label="Next month"
          >
            Next
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-[#333333]">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-semibold text-[#A0A0A0] bg-[#1E1E1E]">{day}</div>
        ))}

        {/* Calendar Days Grid */}
        {days.map((day) => {
          const dayWorkouts = getWorkoutsForDay(day);
          const totalDuration = calculateDayTotalDuration(dayWorkouts);
          const isCurrentDay = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              className={`min-h-32 p-2 border border-[#333333] relative flex flex-col ${
                isSameMonth(day, currentMonth) 
                  ? "bg-[#1E1E1E]" 
                  : "bg-[#121212] text-[#666666]"
              }`}
            >
              {/* Day Number and Total Duration */}
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium text-white ${
                  isCurrentDay ? "bg-[#FFD700] text-[#121212] w-6 h-6 rounded-full flex items-center justify-center" : ""
                }`}>
                  {format(day, "d")}
                </span>
                {totalDuration > 0 && (
                  <span className="text-xs px-1.5 py-0.5 bg-[#252525] rounded text-[#A0A0A0] font-medium">
                    {formatDuration(totalDuration)}
                  </span>
                )}
              </div>
              
              {/* Workouts for this day - make scrollable */}
              <div className="mt-1 space-y-1.5 flex-grow overflow-y-auto max-h-28">
                {dayWorkouts.map((workout) => {
                  // Find the label for this workout
                  const workoutLabel = workout.labelId 
                    ? labels.find(l => l.id === workout.labelId) 
                    : null;
                  
                  return (
                    <div 
                      key={workout.id}
                      onClick={() => setSelectedWorkout(workout)}
                      className={`flex items-center text-xs p-1.5 rounded-sm 
                        ${!workoutLabel 
                          ? `${
                              workout.type === 'Bike' ? 'bg-[#1E90FF1A] border-l-2 border-[#1E90FF]' : 
                              workout.type === 'Run' ? 'bg-[#E639461A] border-l-2 border-[#E63946]' : 
                              'bg-[#00CED11A] border-l-2 border-[#00CED1]'
                            }`
                          : ''
                        } 
                        hover:bg-opacity-25 transition cursor-pointer`}
                      style={workoutLabel ? {
                        backgroundColor: `${workoutLabel.color}1A`, // Add transparency
                        borderLeftWidth: '2px',
                        borderLeftStyle: 'solid',
                        borderLeftColor: workoutLabel.color
                      } : {}}
                    >
                      <div className="flex items-center gap-1 w-full overflow-hidden">
                        {getWorkoutIcon(workout.type)}
                        <span className="font-medium text-white truncate">{workout.title}</span>
                        <span className="ml-auto text-[#A0A0A0] whitespace-nowrap">{formatDuration(workout.duration)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Add Workout Button */}
              <button
                onClick={() => {
                  setSelectedDate(day);
                  setEditingWorkout(null);
                }}
                className="absolute bottom-1 right-1 p-1 rounded-full bg-[#252525] hover:bg-[#333333] transition"
                aria-label="Add workout"
              >
                <Plus className="h-4 w-4 text-[#FFD700]" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Workout Builder Modal - Opens when adding/editing a workout */}
      {selectedDate && (
        <WorkoutBuilder
          date={selectedDate}
          workout={editingWorkout}
          onClose={() => {
            setSelectedDate(null);
            setEditingWorkout(null);
          }}
          onSave={(workout) => handleSaveWorkout(selectedDate, workout)}
        />
      )}

      {/* Workout Display Modal - Opens when viewing a workout */}
      {selectedWorkout && (
        <WorkoutDisplay
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          onEdit={() => {
            // Find the date object for this workout
            const workoutDate = new Date(selectedWorkout.date);
            setEditingWorkout(selectedWorkout);
            setSelectedDate(workoutDate);
            setSelectedWorkout(null);
          }}
        />
      )}
    </div>
  );
};

export default TrainingCalendar;