'use client';

import React from 'react';
import { TrainingMetricsProps } from '../types';
import { formatHours } from '../utils';
import IntensityBreakdown from './IntensityBreakdown';

/**
 * TrainingMetrics Component
 * 
 * Displays a grid of training metrics and statistics
 * Shows volume, training days, sport distribution, and intensity
 * 
 * @param weeklyTotals - Object with weekly totals by sport
 * @param trainingDays - Number of days with training
 * @param restDays - Number of rest days
 * @param intensityZones - Array of intensity zone data
 */
const TrainingMetrics: React.FC<TrainingMetricsProps> = ({
  weeklyTotals,
  trainingDays,
  restDays,
  intensityZones
}) => {
  return (
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
            <span className="text-[#FFD700]">{trainingDays}</span> training /{' '}
            <span className="text-[#A0A0A0]">{restDays}</span> rest
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

        {/* Intensity Distribution */}
        <div className="bg-[#252525] p-2 rounded">
          <div className="text-[#A0A0A0] text-xs">Intensity Breakdown</div>
          <IntensityBreakdown 
            intensityZones={intensityZones} 
            totalDuration={weeklyTotals.total} 
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingMetrics;