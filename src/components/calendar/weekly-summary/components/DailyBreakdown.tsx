'use client';

import React from 'react';
import { format } from 'date-fns';
import { DailyBreakdownProps } from '../types';
import { formatHours } from '../utils';

/**
 * DailyBreakdown Component
 * 
 * Displays a table of daily training hours by sport
 * Shows duration breakdowns for each day of the week
 * 
 * @param dailyBreakdown - Array of daily training data
 */
const DailyBreakdown: React.FC<DailyBreakdownProps> = ({ dailyBreakdown }) => {
  return (
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
  );
};

export default DailyBreakdown;