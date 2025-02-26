"use client";

import React, { useState, useEffect } from 'react';
import { useWorkoutStore, getDateKey } from '@/hooks/useWorkoutStore';
import { Bike, Waves, Footprints, ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format, eachDayOfInterval } from 'date-fns';

/**
 * WeeklySummary Component
 * 
 * Displays a summary of training activities for the current week with navigation
 * to previous and future weeks. Shows sport-specific breakdowns and totals.
 */
const WeeklySummary = () => {
  // State to track the current week being displayed
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null);

  // Get workout data from the shared store
  const { workouts } = useWorkoutStore();

  // Initialize week on client-side to prevent hydration errors
  useEffect(() => {
    setCurrentWeekStart(startOfWeek(new Date()));
  }, []);

  // Show loading state while initializing
  if (!currentWeekStart) {
    return <div className="bg-[#1E1E1E] rounded-lg shadow-xl border border-[#333333] p-4">
      <h2 className="text-lg font-bold text-white">Weekly Training</h2>
      <p className="text-[#A0A0A0] text-sm">Loading...</p>
    </div>;
  }

  // Calculate week boundaries and days
  const weekEnd = endOfWeek(currentWeekStart);
  const daysOfWeek = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });

  // Initialize weekly totals object
  const weeklyTotals = {
    swim: 0,
    bike: 0,
    run: 0,
    total: 0
  };

  /**
   * Process daily workout data and calculate totals
   * Maps each day of the week to a summary of its workouts
   */
  const dailyBreakdown = daysOfWeek.map(day => {
    const dateKey = getDateKey(day);
    const dayWorkouts = workouts[dateKey] || [];

    // Initialize totals for this day
    const dayTotals = {
      date: day,
      swim: 0,
      bike: 0,
      run: 0,
      total: 0
    };

    // Process each workout and update totals
    dayWorkouts.forEach(workout => {
      const durationHours = workout.duration / 60;

      if (workout.type === 'Swim') {
        dayTotals.swim += durationHours;
        weeklyTotals.swim += durationHours;
      } else if (workout.type === 'Bike') {
        dayTotals.bike += durationHours;
        weeklyTotals.bike += durationHours;
      } else if (workout.type === 'Run') {
        dayTotals.run += durationHours;
        weeklyTotals.run += durationHours;
      }

      dayTotals.total += durationHours;
      weeklyTotals.total += durationHours;
    });

    return dayTotals;
  });

  /**
   * Format hours to a consistent decimal format
   * @param hours Number of hours to format
   * @returns Formatted string with one decimal place
   */
  const formatHours = (hours: number): string => {
    return hours.toFixed(1);
  };

  // Calculate max value for scaling the bar graphs proportionally
  const maxValue = Math.max(weeklyTotals.swim, weeklyTotals.bike, weeklyTotals.run, 1);

  /**
   * Navigate to the previous week
   */
  const prevWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  /**
   * Navigate to the next week
   */
  const nextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  return (
    <div className="bg-[#1E1E1E] rounded-lg shadow-xl border border-[#333333] p-4">
      {/* Header with Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Weekly Training</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevWeek}
            className="p-1 text-[#A0A0A0] hover:text-white"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-white">
            {format(currentWeekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </span>
          <button
            onClick={nextWeek}
            className="p-1 text-[#A0A0A0] hover:text-white"
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Swim Summary with Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1">
              <Waves className="h-4 w-4 text-[#00CED1]" />
              <span className="text-sm font-medium text-white">Swim</span>
            </div>
            <span className="text-sm text-[#FFD700] font-medium">{formatHours(weeklyTotals.swim)}h</span>
          </div>
          <div className="w-full h-2 bg-[#252525] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00CED1] rounded-full"
              style={{ width: `${(weeklyTotals.swim / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Bike Summary with Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1">
              <Bike className="h-4 w-4 text-[#1E90FF]" />
              <span className="text-sm font-medium text-white">Bike</span>
            </div>
            <span className="text-sm text-[#FFD700] font-medium">{formatHours(weeklyTotals.bike)}h</span>
          </div>
          <div className="w-full h-2 bg-[#252525] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1E90FF] rounded-full"
              style={{ width: `${(weeklyTotals.bike / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Run Summary with Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1">
              <Footprints className="h-4 w-4 text-[#E63946]" />
              <span className="text-sm font-medium text-white">Run</span>
            </div>
            <span className="text-sm text-[#FFD700] font-medium">{formatHours(weeklyTotals.run)}h</span>
          </div>
          <div className="w-full h-2 bg-[#252525] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E63946] rounded-full"
              style={{ width: `${(weeklyTotals.run / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Total Weekly Hours */}
        <div className="pt-2 mt-2 border-t border-[#333333] flex justify-between items-center">
          <span className="text-sm font-medium text-white">Total</span>
          <span className="text-md text-[#FFD700] font-bold">{formatHours(weeklyTotals.total)}h</span>
        </div>

        {/* Daily Breakdown Table */}
        <div className="mt-4 pt-4 border-t border-[#333333]">
          <h3 className="text-sm font-semibold text-white mb-2">Daily Breakdown</h3>
          <div className="space-y-1">
            {/* Table header */}
            <div className="grid grid-cols-5 text-xs py-1 border-b border-[#333333]">
              <div className="text-[#A0A0A0] font-medium">Day</div>
              <div className="text-[#00CED1]">Swim</div>
              <div className="text-[#1E90FF]">Bike</div>
              <div className="text-[#E63946]">Run</div>
              <div className="text-white font-medium text-right">Total</div>
            </div>

            {/* Daily data rows */}
            {dailyBreakdown.map((day, idx) => (
              <div key={idx} className="grid grid-cols-5 text-xs py-1">
                <div className="text-[#A0A0A0]">{format(day.date, 'EEE')}</div>
                <div className="text-[#00CED1]">{day.swim > 0 ? formatHours(day.swim) : '-'}</div>
                <div className="text-[#1E90FF]">{day.bike > 0 ? formatHours(day.bike) : '-'}</div>
                <div className="text-[#E63946]">{day.run > 0 ? formatHours(day.run) : '-'}</div>
                <div className="text-white font-medium text-right">{day.total > 0 ? formatHours(day.total) : '-'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Metrics Section */}
        <div className="mt-4 pt-4 border-t border-[#333333]">
          <h3 className="text-sm font-semibold text-white mb-2">Training Metrics</h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Simulated Training Stress Score */}
            <div className="bg-[#252525] p-2 rounded">
              <div className="text-[#A0A0A0] text-xs">Weekly Load</div>
              <div className="text-[#FFD700] font-bold">{(weeklyTotals.total * 100).toFixed(0)} TSS</div>
            </div>

            {/* Sport Distribution Percentages */}
            <div className="bg-[#252525] p-2 rounded">
              <div className="text-[#A0A0A0] text-xs">Triathlon Balance</div>
              <div className="text-white font-medium text-xs">
                {weeklyTotals.total > 0 ? (
                  <>
                    <span className="text-[#00CED1]">{Math.round((weeklyTotals.swim / weeklyTotals.total) * 100)}%</span> /
                    <span className="text-[#1E90FF]">{Math.round((weeklyTotals.bike / weeklyTotals.total) * 100)}%</span> /
                    <span className="text-[#E63946]">{Math.round((weeklyTotals.run / weeklyTotals.total) * 100)}%</span>
                  </>
                ) : '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;