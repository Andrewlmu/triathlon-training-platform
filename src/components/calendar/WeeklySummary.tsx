'use client';

import React, { useState, useEffect } from 'react';
import { Bike, Waves, Footprints, ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format, eachDayOfInterval } from 'date-fns';
import { useWorkouts } from '@/context/WorkoutContext';
import { useLabels } from '@/context/LabelContext';
import { Workout } from '@/types/workout';

/**
 * Interface for workout label data with duration
 */
interface LabelData {
  id: string;
  name: string;
  color: string;
  duration: number;
}

/**
 * Interface for sport-specific data with label breakdown
 */
interface SportData {
  total: number;
  byLabel: Record<string, LabelData>;
}

/**
 * Interface for daily training totals
 */
interface DayTotals {
  date: Date;
  swim: number;
  bike: number;
  run: number;
  total: number;
}

/**
 * Interface for weekly training data summary
 */
interface WeeklyData {
  weeklyTotals: {
    swim: SportData;
    bike: SportData;
    run: SportData;
    total: number;
  };
  dailyBreakdown: DayTotals[];
  maxValue: number;
}

/**
 * Interface for intensity zone
 */
interface IntensityZone {
  name: string;
  color: string;
  duration: number;
}

/**
 * WeeklySummary Component
 *
 * Displays a summary of training activities for the current week with navigation
 * to previous and future weeks. Shows sport-specific breakdowns and totals.
 */
const WeeklySummary = () => {
  // State to track the current week being displayed
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null);

  // Create state to track calculations
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

  // Get workout data from context
  const { workouts, isLoading } = useWorkouts();
  const { labels } = useLabels();

  // Initialize week on client-side to prevent hydration errors
  useEffect(() => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  }, []);

  // Recalculate weekly data whenever workouts or currentWeekStart changes
  useEffect(() => {
    if (!currentWeekStart) return;

    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });

    // Filter workouts for this week
    const weekWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= currentWeekStart && workoutDate <= weekEnd;
    });

    // Initialize weekly totals with label tracking
    const weeklyTotals = {
      swim: { total: 0, byLabel: {} as Record<string, LabelData> },
      bike: { total: 0, byLabel: {} as Record<string, LabelData> },
      run: { total: 0, byLabel: {} as Record<string, LabelData> },
      total: 0,
    };

    // Initialize daily breakdown (this remains unchanged)
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
  }, [workouts, currentWeekStart, labels]);

  // Show loading state while initializing
  if (!currentWeekStart || isLoading) {
    return (
      <div className="bg-[#1E1E1E] rounded-lg shadow-xl border border-[#333333] p-4">
        <h2 className="text-lg font-bold text-white">Weekly Training</h2>
        <p className="text-[#A0A0A0] text-sm">Loading...</p>
      </div>
    );
  }

  // Navigation handlers
  const prevWeek = () => {
    setCurrentWeekStart((prev) => (prev ? subWeeks(prev, 1) : null));
  };

  const nextWeek = () => {
    setCurrentWeekStart((prev) => (prev ? addWeeks(prev, 1) : null));
  };

  /**
   * Format hours to a consistent decimal format
   */
  const formatHours = (hours: number): string => {
    return hours.toFixed(1);
  };

  /**
   * Create a segmented progress bar based on label data
   */
  const SegmentedProgressBar = ({
    sportData,
    maxValue,
    baseColor,
  }: {
    sportData: SportData;
    maxValue: number;
    baseColor: string;
  }) => {
    // If there's no data, show empty bar
    if (sportData.total === 0) {
      return <div className="w-full h-2 bg-[#252525] rounded-full overflow-hidden"></div>;
    }

    // Calculate total width of the progress bar as percentage
    const totalWidth = (sportData.total / maxValue) * 100;

    // Define the order of training zones
    const zoneOrder = [
      'Recovery',
      'Zone 2',
      'Tempo',
      'Sweet Spot',
      'Threshold',
      'VO2 Max',
      'Anaerobic',
      'Sprints',
      'Unlabeled',
    ];

    // Get all labels for this sport and sort them by training zone
    const sortedLabels = Object.values(sportData.byLabel).sort((a, b) => {
      const indexA = zoneOrder.indexOf(a.name);
      const indexB = zoneOrder.indexOf(b.name);

      // If both labels are in our defined order, sort by that
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one is in the order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // Otherwise sort by duration (largest first)
      return b.duration - a.duration;
    });

    // Calculate segments
    let segments: { color: string; width: number }[] = [];

    if (sortedLabels.length === 0) {
      // If no labels (shouldn't happen), use base color
      segments.push({ color: baseColor, width: totalWidth });
    } else {
      // Calculate each segment's width
      segments = sortedLabels.map((label) => ({
        color: label.color,
        width: (label.duration / sportData.total) * totalWidth,
      }));
    }

    // Render the segments
    return (
      <div className="w-full h-2 bg-[#252525] rounded-full overflow-hidden flex">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="h-full"
            style={{
              backgroundColor: segment.color,
              width: `${segment.width}%`,
            }}
          ></div>
        ))}
      </div>
    );
  };

  /**
   * Get legend items ordered by training intensity
   */
  const getLegendItems = () => {
    const allLabels: Record<string, { name: string; color: string }> = {};

    // Collect all unique labels from all sports
    ['swim', 'bike', 'run'].forEach((sport) => {
      const sportData = weeklyData.weeklyTotals[sport as 'swim' | 'bike' | 'run'];
      Object.values(sportData.byLabel).forEach((label) => {
        if (!allLabels[label.id]) {
          allLabels[label.id] = { name: label.name, color: label.color };
        }
      });
    });

    // Define the order of training zones by intensity
    const zoneOrder = [
      'Recovery',
      'Zone 2',
      'Tempo',
      'Sweet Spot',
      'Threshold',
      'VO2 Max',
      'Anaerobic',
      'Sprints',
      // Add any other label at the end
      'Unlabeled',
    ];

    // Sort labels by the predefined zone order
    return Object.values(allLabels).sort((a, b) => {
      const indexA = zoneOrder.indexOf(a.name);
      const indexB = zoneOrder.indexOf(b.name);

      // If both labels are in our predefined order, sort by that order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one label is in our predefined order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // Otherwise sort alphabetically
      return a.name.localeCompare(b.name);
    });
  };

  /**
   * Calculate intensity distribution without grouping
   */
  const calculateIntensityDistribution = (): IntensityZone[] => {
    // Define the order of training zones
    const zoneOrder = [
      'Recovery',
      'Zone 2',
      'Tempo',
      'Sweet Spot',
      'Threshold',
      'VO2 Max',
      'Anaerobic',
      'Sprints',
      'Unlabeled',
    ];

    // Track total time in each intensity zone
    const distribution: Record<string, IntensityZone> = {};

    // Initialize with zero for each zone that exists in our legend
    zoneOrder.forEach((zone) => {
      distribution[zone] = {
        name: zone,
        color: zone === 'Unlabeled' ? '#FFFFFF' : '#000000', // Placeholder colors
        duration: 0,
      };
    });

    // Calculate total time in each sport by label
    ['swim', 'bike', 'run'].forEach((sport) => {
      const sportData = weeklyData.weeklyTotals[sport as 'swim' | 'bike' | 'run'];
      Object.values(sportData.byLabel).forEach((label) => {
        if (!distribution[label.name]) {
          distribution[label.name] = {
            name: label.name,
            color: label.color,
            duration: 0,
          };
        } else if (distribution[label.name].color === '#000000') {
          // Update color if we have a real label that matches one of our zones
          distribution[label.name].color = label.color;
        }

        distribution[label.name].duration += label.duration;
      });
    });

    // Filter out zones with zero duration and sort by our defined order
    return Object.values(distribution)
      .filter((zone) => zone.duration > 0)
      .sort((a, b) => {
        const indexA = zoneOrder.indexOf(a.name);
        const indexB = zoneOrder.indexOf(b.name);

        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }

        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        return a.name.localeCompare(b.name);
      });
  };

  /**
   * Calculate training days
   */
  const calculateTrainingDays = () => {
    // Count days with workouts
    const daysWithWorkouts = weeklyData.dailyBreakdown.filter((day) => day.total > 0).length;
    return {
      trainingDays: daysWithWorkouts,
      restDays: 7 - daysWithWorkouts,
    };
  };

  // Use the pre-calculated values from state
  const { weeklyTotals, dailyBreakdown, maxValue } = weeklyData;
  const weekEnd = currentWeekStart ? endOfWeek(currentWeekStart, { weekStartsOn: 1 }) : new Date();

  // Get ordered legend items
  const legendItems = getLegendItems();

  // Get the training days data
  const trainingDays = calculateTrainingDays();

  // Get intensity zones
  const intensityZones = calculateIntensityDistribution();

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
            <span className="text-sm text-[#FFD700] font-medium">
              {formatHours(weeklyTotals.swim.total)}h
            </span>
          </div>
          <SegmentedProgressBar
            sportData={weeklyTotals.swim}
            maxValue={maxValue}
            baseColor="#00CED1"
          />
        </div>

        {/* Bike Summary with Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1">
              <Bike className="h-4 w-4 text-[#1E90FF]" />
              <span className="text-sm font-medium text-white">Bike</span>
            </div>
            <span className="text-sm text-[#FFD700] font-medium">
              {formatHours(weeklyTotals.bike.total)}h
            </span>
          </div>
          <SegmentedProgressBar
            sportData={weeklyTotals.bike}
            maxValue={maxValue}
            baseColor="#1E90FF"
          />
        </div>

        {/* Run Summary with Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1">
              <Footprints className="h-4 w-4 text-[#E63946]" />
              <span className="text-sm font-medium text-white">Run</span>
            </div>
            <span className="text-sm text-[#FFD700] font-medium">
              {formatHours(weeklyTotals.run.total)}h
            </span>
          </div>
          <SegmentedProgressBar
            sportData={weeklyTotals.run}
            maxValue={maxValue}
            baseColor="#E63946"
          />
        </div>

        {/* Label Legend */}
        {legendItems.length > 0 && (
          <div className="mt-2 pt-1 flex flex-wrap gap-2">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-[#A0A0A0]">{item.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Total Weekly Hours */}
        <div className="pt-2 mt-2 border-t border-[#333333] flex justify-between items-center">
          <span className="text-sm font-medium text-white">Total</span>
          <span className="text-md text-[#FFD700] font-bold">
            {formatHours(weeklyTotals.total)}h
          </span>
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
                <div className="text-white font-medium text-right">
                  {day.total > 0 ? formatHours(day.total) : '-'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Metrics Section */}
        <div className="mt-4 pt-4 border-t border-[#333333]">
          <h3 className="text-sm font-semibold text-white mb-2">Training Metrics</h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Weekly Volume */}
            <div className="bg-[#252525] p-2 rounded">
              <div className="text-[#A0A0A0] text-xs">Weekly Volume</div>
              <div className="text-[#FFD700] font-bold">{formatHours(weeklyTotals.total)}h</div>
            </div>

            {/* Training Consistency */}
            <div className="bg-[#252525] p-2 rounded">
              <div className="text-[#A0A0A0] text-xs">Training Days</div>
              <div className="text-white font-medium text-xs">
                <span className="text-[#FFD700]">{trainingDays.trainingDays}</span> training /{' '}
                <span className="text-[#A0A0A0]">{trainingDays.restDays}</span> rest
              </div>
            </div>

            {/* Sport Distribution */}
            <div className="bg-[#252525] p-2 rounded">
              <div className="text-[#A0A0A0] text-xs">Triathlon Balance</div>
              <div className="text-white font-medium text-xs">
                {weeklyTotals.total > 0 ? (
                  <>
                    <span className="text-[#00CED1]">
                      {Math.round((weeklyTotals.swim.total / weeklyTotals.total) * 100)}%
                    </span>{' '}
                    /
                    <span className="text-[#1E90FF]">
                      {Math.round((weeklyTotals.bike.total / weeklyTotals.total) * 100)}%
                    </span>{' '}
                    /
                    <span className="text-[#E63946]">
                      {Math.round((weeklyTotals.run.total / weeklyTotals.total) * 100)}%
                    </span>
                  </>
                ) : (
                  '-'
                )}
              </div>
            </div>

            {/* Intensity Distribution - Now with detailed zones */}
            <div className="bg-[#252525] p-2 rounded">
              <div className="text-[#A0A0A0] text-xs">Intensity Breakdown</div>
              {weeklyTotals.total > 0 && intensityZones.length > 0 ? (
                <>
                  {/* Segmented progress bar for intensity zones */}
                  <div className="w-full bg-[#333333] h-2 rounded-full overflow-hidden flex mt-1">
                    {intensityZones.map((zone, index) => (
                      <div
                        key={index}
                        className="h-full"
                        style={{
                          backgroundColor: zone.color,
                          width: `${(zone.duration / weeklyTotals.total) * 100}%`,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Small percentage indicators */}
                  <div className="flex flex-wrap gap-x-2 mt-1 text-[10px]">
                    {intensityZones.map((zone, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        ></div>
                        <span className="text-white opacity-70">
                          {Math.round((zone.duration / weeklyTotals.total) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;
