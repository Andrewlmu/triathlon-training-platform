'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { NavigationHeaderProps } from '../types';

/**
 * NavigationHeader Component
 * 
 * Displays week date range with navigation controls
 * Allows navigating between weeks
 * 
 * @param currentWeekStart - Date object for the start of the displayed week
 * @param weekEnd - Date object for the end of the displayed week
 * @param onPrevWeek - Function to navigate to previous week
 * @param onNextWeek - Function to navigate to next week
 */
const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentWeekStart,
  weekEnd,
  onPrevWeek,
  onNextWeek
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-white">Weekly Training</h2>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevWeek}
          className="p-1 text-[#A0A0A0] hover:text-white"
          aria-label="Previous week"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-white">
          {format(currentWeekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </span>
        <button
          onClick={onNextWeek}
          className="p-1 text-[#A0A0A0] hover:text-white"
          aria-label="Next week"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default NavigationHeader;