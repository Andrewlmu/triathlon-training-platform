"use client";

import React, { useState } from 'react';
import { X, Copy, Calendar } from 'lucide-react';
import { useWorkouts } from '@/context/WorkoutContext';
import { startOfWeek, endOfWeek, addWeeks, format, eachDayOfInterval, parseISO, differenceInDays } from 'date-fns';
import { Workout } from '@/types/workout';

interface CopyWeekModalProps {
  onClose: () => void;
}

/**
 * Modal component for copying workouts from one week to another
 */
const CopyWeekModal: React.FC<CopyWeekModalProps> = ({ onClose }) => {
  const { workouts, copyWorkoutsToWeek, isLoading } = useWorkouts();
  const [sourceDate, setSourceDate] = useState<Date>(new Date());
  const [targetDate, setTargetDate] = useState<Date>(
    addWeeks(new Date(), 1) // Default to one week ahead
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get source week start (Monday) and end dates (Sunday)
  const sourceWeekStart = startOfWeek(sourceDate, { weekStartsOn: 1 });
  const sourceWeekEnd = endOfWeek(sourceDate, { weekStartsOn: 1 });
  
  // Get target week start and end dates
  const targetWeekStart = startOfWeek(targetDate, { weekStartsOn: 1 });
  const targetWeekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });

  // Format dates for display
  const sourceWeekDisplay = `${format(sourceWeekStart, 'MMM d')} - ${format(sourceWeekEnd, 'MMM d, yyyy')}`;
  const targetWeekDisplay = `${format(targetWeekStart, 'MMM d')} - ${format(targetWeekEnd, 'MMM d, yyyy')}`;

  // Handle date input change with proper week start alignment
  const handleSourceDateChange = (dateString: string) => {
    const selectedDate = parseISO(dateString);
    setSourceDate(selectedDate);
  };
  
  const handleTargetDateChange = (dateString: string) => {
    const selectedDate = parseISO(dateString);
    setTargetDate(selectedDate);
  };

  // Preview of workouts to be copied
  const getDaysInWeek = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  };

  const getWorkoutsForDay = (date: Date, allWorkouts: Workout[]): Workout[] => {
    return allWorkouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate.getFullYear() === date.getFullYear() &&
        workoutDate.getMonth() === date.getMonth() &&
        workoutDate.getDate() === date.getDate()
      );
    });
  };

  // Count workouts to be copied by type
  const sourceWeekDays = getDaysInWeek(sourceDate);
  const sourceWeekWorkouts = sourceWeekDays.flatMap(day => getWorkoutsForDay(day, workouts));
  
  const workoutCounts = {
    total: sourceWeekWorkouts.length,
    swim: sourceWeekWorkouts.filter(w => w.type === 'Swim').length,
    bike: sourceWeekWorkouts.filter(w => w.type === 'Bike').length,
    run: sourceWeekWorkouts.filter(w => w.type === 'Run').length,
  };

  const handleCopyWeek = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (sourceWeekWorkouts.length === 0) {
        setError("No workouts to copy from the selected week");
        return;
      }
      
      await copyWorkoutsToWeek(sourceWeekStart, targetWeekStart);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error copying week:', err);
      setError("Failed to copy workouts. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg shadow-2xl w-full max-w-md border border-[#333333]">
        <div className="p-4 border-b border-[#333333] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Copy className="h-5 w-5 text-[#FFD700]" />
            <span>Copy Training Week</span>
          </h2>
          <button onClick={onClose} className="text-[#A0A0A0] hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {success ? (
            <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">
              Successfully copied workouts to the target week!
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Source Week (any day in the week)
                </label>
                <div className="flex items-center">
                  <input
                    type="date"
                    value={format(sourceDate, 'yyyy-MM-dd')}
                    onChange={(e) => handleSourceDateChange(e.target.value)}
                    className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none"
                  />
                  <div className="ml-2 px-2 py-1 rounded bg-[#252525] text-[#A0A0A0] text-sm">
                    {sourceWeekDisplay}
                  </div>
                </div>
                <p className="text-xs text-[#A0A0A0] mt-1">
                  Week: {format(sourceWeekStart, 'MMM d')} to {format(sourceWeekEnd, 'MMM d')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Target Week (any day in the week)
                </label>
                <div className="flex items-center">
                  <input
                    type="date"
                    value={format(targetDate, 'yyyy-MM-dd')}
                    onChange={(e) => handleTargetDateChange(e.target.value)}
                    className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none"
                  />
                  <div className="ml-2 px-2 py-1 rounded bg-[#252525] text-[#A0A0A0] text-sm">
                    {targetWeekDisplay}
                  </div>
                </div>
                <p className="text-xs text-[#A0A0A0] mt-1">
                  Week: {format(targetWeekStart, 'MMM d')} to {format(targetWeekEnd, 'MMM d')}
                </p>
              </div>
              
              <div className="mt-4 bg-[#252525] rounded-md p-4">
                <h3 className="text-sm font-semibold text-white mb-2">Workouts to Copy</h3>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[#A0A0A0]">Total workouts:</div>
                  <div className="font-medium text-white">{workoutCounts.total}</div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-[#00CED1]">Swim:</div>
                    <div>{workoutCounts.swim}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[#1E90FF]">Bike:</div>
                    <div>{workoutCounts.bike}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[#E63946]">Run:</div>
                    <div>{workoutCounts.run}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-[#A0A0A0] text-sm mt-2">
                <p>This will create copies of all workouts from the source week and place them in the target week on the same days of the week.</p>
                <p className="mt-1">For example, Monday workouts will be copied to Monday, Tuesday to Tuesday, etc.</p>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-[#333333] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-[#333333] hover:bg-[#444444] rounded-md transition"
          >
            Cancel
          </button>
          {!success && (
            <button
              onClick={handleCopyWeek}
              disabled={isSubmitting || workoutCounts.total === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#121212] bg-[#FFD700] hover:bg-[#F0C800] rounded-md transition disabled:opacity-50 disabled:hover:bg-[#FFD700]"
            >
              <Copy className="h-4 w-4" />
              {isSubmitting ? "Copying..." : "Copy Week"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyWeekModal;