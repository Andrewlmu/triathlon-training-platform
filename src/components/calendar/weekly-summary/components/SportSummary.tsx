'use client';

import React from 'react';
import { Bike, Waves, Footprints } from 'lucide-react';
import { SportSummaryProps } from '../types';
import { formatHours } from '../utils';
import SegmentedProgressBar from './SegmentedProgressBar';

/**
 * SportSummary Component
 * 
 * Displays summary information for a specific sport (swim, bike, run)
 * Shows an icon, total duration, and segmented progress bar
 * 
 * @param type - The sport type (swim, bike, run)
 * @param sportData - Data for the sport including labels
 * @param maxValue - Maximum value for scaling the progress bar
 * @param baseColor - Default color for the sport
 * @param iconColor - Color for the sport icon
 */
const SportSummary: React.FC<SportSummaryProps> = ({
  type,
  sportData,
  maxValue,
  baseColor,
  iconColor
}) => {
  // Get the appropriate icon based on sport type
  const getSportIcon = () => {
    switch (type) {
      case 'swim':
        return <Waves className={`h-4 w-4 text-[${iconColor}]`} />;
      case 'bike':
        return <Bike className={`h-4 w-4 text-[${iconColor}]`} />;
      case 'run':
        return <Footprints className={`h-4 w-4 text-[${iconColor}]`} />;
      default:
        return null;
    }
  };

  // Get display name with first letter capitalized
  const getDisplayName = () => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1">
          {getSportIcon()}
          <span className="text-sm font-medium text-white">{getDisplayName()}</span>
        </div>
        <span className="text-sm text-[#FFD700] font-medium">
          {formatHours(sportData.total)}h
        </span>
      </div>
      <SegmentedProgressBar
        sportData={sportData}
        maxValue={maxValue}
        baseColor={baseColor}
      />
    </div>
  );
};

export default SportSummary;