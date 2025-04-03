'use client';

import React, { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';

import { useWeeklyData } from './hooks/useWeeklyData';
import { calculateIntensityDistribution, calculateTrainingDays, extractLegendItems, formatHours } from './utils';

// Import sub-components
import NavigationHeader from './components/NavigationHeader';
import SportSummary from './components/SportSummary';
import LabelLegend from './components/LabelLegend';
import DailyBreakdown from './components/DailyBreakdown';
import TrainingMetrics from './components/TrainingMetrics';

/**
 * WeeklySummary Component
 *
 * Displays a summary of training activities for the current week with navigation
 * to previous and future weeks. Shows sport-specific breakdowns and totals.
 */
const WeeklySummary = () => {
  // State to track the current week being displayed
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null);
  
  // Initialize week on client-side to prevent hydration errors
  useEffect(() => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  }, []);

  // Get weekly training data from custom hook
  const { weeklyData, isLoading } = useWeeklyData(currentWeekStart);

  // Navigation handlers
  const prevWeek = () => {
    setCurrentWeekStart((prev) => (prev ? subWeeks(prev, 1) : null));
  };

  const nextWeek = () => {
    setCurrentWeekStart((prev) => (prev ? addWeeks(prev, 1) : null));
  };

  // Show loading state while initializing
  if (!currentWeekStart || isLoading) {
    return (
      <div className="bg-[#1E1E1E] rounded-lg shadow-xl border border-[#333333] p-4">
        <h2 className="text-lg font-bold text-white">Weekly Training</h2>
        <p className="text-[#A0A0A0] text-sm">Loading...</p>
      </div>
    );
  }

  // Extract data from hook
  const { weeklyTotals, dailyBreakdown, maxValue } = weeklyData;
  const weekEnd = currentWeekStart ? endOfWeek(currentWeekStart, { weekStartsOn: 1 }) : new Date();

  // Calculate derived data
  const legendItems = extractLegendItems(weeklyTotals);
  const trainingDays = calculateTrainingDays(dailyBreakdown);
  const intensityZones = calculateIntensityDistribution(weeklyTotals);

  return (
    <div className="bg-[#1E1E1E] rounded-lg shadow-xl border border-[#333333] p-4">
      {/* Header with Week Navigation */}
      <NavigationHeader 
        currentWeekStart={currentWeekStart}
        weekEnd={weekEnd}
        onPrevWeek={prevWeek}
        onNextWeek={nextWeek}
      />

      <div className="space-y-4">
        {/* Swim Summary with Progress Bar */}
        <SportSummary 
          type="swim"
          sportData={weeklyTotals.swim}
          maxValue={maxValue}
          baseColor="#00CED1"
          iconColor="#00CED1"
        />

        {/* Bike Summary with Progress Bar */}
        <SportSummary 
          type="bike"
          sportData={weeklyTotals.bike}
          maxValue={maxValue}
          baseColor="#1E90FF"
          iconColor="#1E90FF"
        />

        {/* Run Summary with Progress Bar */}
        <SportSummary 
          type="run"
          sportData={weeklyTotals.run}
          maxValue={maxValue}
          baseColor="#E63946"
          iconColor="#E63946"
        />

        {/* Label Legend */}
        <LabelLegend labels={legendItems} />

        {/* Total Weekly Hours */}
        <div className="pt-2 mt-2 border-t border-[#333333] flex justify-between items-center">
          <span className="text-sm font-medium text-white">Total</span>
          <span className="text-md text-[#FFD700] font-bold">
            {formatHours(weeklyTotals.total)}h
          </span>
        </div>

        {/* Daily Breakdown Table */}
        <DailyBreakdown dailyBreakdown={dailyBreakdown} />

        {/* Training Metrics Section */}
        <TrainingMetrics 
          weeklyTotals={weeklyTotals}
          trainingDays={trainingDays.trainingDays}
          restDays={trainingDays.restDays}
          intensityZones={intensityZones}
        />
      </div>
    </div>
  );
};

export default WeeklySummary;