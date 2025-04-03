'use client';

import { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { useWorkouts } from '@/context/WorkoutContext';
import { useLabels } from '@/context/LabelContext';
import { WeeklyData, DayTotals } from '../types';
import { Workout } from '@/types/workout';

/**
 * Custom hook for calculating and managing weekly training data
 * 
 * @param currentWeekStart - Date object representing the start of the current week
 * @returns Weekly training data and loading state
 */
export function useWeeklyData(currentWeekStart: Date | null) {
  // Get workout and label data from context
  const { workouts, isLoading: workoutsLoading } = useWorkouts();
  const { labels, isLoading: labelsLoading } = useLabels();
  
  // State for weekly data calculations
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({
    weeklyTotals: {
      swim: { total: 0, byLabel: {} },
      bike: { total: 0, byLabel: {} },
      run: { total: 0, byLabel: {} },
      total: 0,
    },
    dailyBreakdown: [],
    maxValue: 1,
  });
  
  // Loading state
  const isLoading = workoutsLoading || labelsLoading || !currentWeekStart;

  // Recalculate weekly data whenever workouts or currentWeekStart changes
  useEffect(() => {
    if (!currentWeekStart || workoutsLoading) return;

    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });

    // Filter workouts for this week
    const weekWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= currentWeekStart && workoutDate <= weekEnd;
    });

    // Initialize weekly totals with label tracking
    const weeklyTotals = {
      swim: { total: 0, byLabel: {} as Record<string, any> },
      bike: { total: 0, byLabel: {} as Record<string, any> },
      run: { total: 0, byLabel: {} as Record<string, any> },
      total: 0,
    };

    // Initialize daily breakdown
    const dailyBreakdown = daysOfWeek.map((day) => {
      // Filter workouts for this day
      const dayWorkouts = weekWorkouts.filter((workout) => {
        const workoutDate = new Date(workout.date);
        return (
          workoutDate.getFullYear() === day.getFullYear() &&
          workoutDate.getMonth() === day.getMonth() &&
          workoutDate.getDate() === day.getDate()
        );
      });

      // Calculate totals for this day
      const dayTotals: DayTotals = {
        date: day,
        swim: 0,
        bike: 0,
        run: 0,
        total: 0,
      };

      // Process each workout for this day
      dayWorkouts.forEach((workout) => {
        const durationHours = workout.duration / 60;

        if (workout.type === 'Swim') {
          dayTotals.swim += durationHours;
          weeklyTotals.swim.total += durationHours;
        } else if (workout.type === 'Bike') {
          dayTotals.bike += durationHours;
          weeklyTotals.bike.total += durationHours;
        } else if (workout.type === 'Run') {
          dayTotals.run += durationHours;
          weeklyTotals.run.total += durationHours;
        }

        dayTotals.total += durationHours;
        weeklyTotals.total += durationHours;

        // Track workout by label
        const sportType = workout.type.toLowerCase() as 'swim' | 'bike' | 'run';
        const labelKey = workout.labelId || 'no-label';

        // Find the label
        let labelName = 'Unlabeled';
        let labelColor = '#FFFFFF';

        if (workout.labelId) {
          const workoutLabel = labels.find((l) => l.id === workout.labelId);
          if (workoutLabel) {
            labelName = workoutLabel.name;
            labelColor = workoutLabel.color;
          }
        }

        // Initialize or update the label data for this sport
        if (!weeklyTotals[sportType].byLabel[labelKey]) {
          weeklyTotals[sportType].byLabel[labelKey] = {
            id: labelKey,
            name: labelName,
            color: labelColor,
            duration: 0,
          };
        }

        // Add this workout's duration to the label total
        weeklyTotals[sportType].byLabel[labelKey].duration += durationHours;
      });

      return dayTotals;
    });

    // Calculate max value for bar scaling
    const maxValue = Math.max(
      weeklyTotals.swim.total,
      weeklyTotals.bike.total,
      weeklyTotals.run.total,
      1
    );

    // Update state with calculated data
    setWeeklyData({
      weeklyTotals,
      dailyBreakdown,
      maxValue,
    });
  }, [workouts, currentWeekStart, labels, workoutsLoading]);

  return { weeklyData, isLoading };
}