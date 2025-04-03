'use client';

import React from 'react';
import { SegmentedProgressBarProps } from '../types';
import { sortLabelsByIntensity } from '../utils';

/**
 * SegmentedProgressBar Component
 * 
 * Renders a progress bar segmented by training intensity labels
 * Used to visualize sport-specific training distribution
 * 
 * @param sportData - Data for the sport including labels
 * @param maxValue - Maximum value for scaling the progress bar
 * @param baseColor - Default color for the bar if no labels exist
 */
const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({ 
  sportData, 
  maxValue, 
  baseColor 
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

    const indexA = zoneOrder.indexOf(a.name);
    const indexB = zoneOrder.indexOf(b.name);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return a.name.localeCompare(b.name);
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

export default SegmentedProgressBar;