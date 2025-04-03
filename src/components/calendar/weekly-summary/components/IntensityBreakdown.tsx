'use client';

import React from 'react';
import { IntensityBreakdownProps } from '../types';

/**
 * IntensityBreakdown Component
 * 
 * Displays a visualization of training intensity distribution
 * Shows a segmented bar and percentage breakdown
 * 
 * @param intensityZones - Array of intensity zone objects with duration
 * @param totalDuration - Total training duration for calculating percentages
 */
const IntensityBreakdown: React.FC<IntensityBreakdownProps> = ({
  intensityZones,
  totalDuration
}) => {
  if (totalDuration <= 0 || intensityZones.length === 0) {
    return (
      <div className="text-white font-medium text-xs">-</div>
    );
  }

  return (
    <>
      {/* Segmented progress bar for intensity zones */}
      <div className="w-full bg-[#333333] h-2 rounded-full overflow-hidden flex mt-1">
        {intensityZones.map((zone, index) => (
          <div
            key={index}
            className="h-full"
            style={{
              backgroundColor: zone.color,
              width: `${(zone.duration / totalDuration) * 100}%`,
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
              {Math.round((zone.duration / totalDuration) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default IntensityBreakdown;