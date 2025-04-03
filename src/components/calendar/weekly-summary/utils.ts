import { IntensityZone, LabelData } from './types';

/**
 * Format hours to a consistent decimal format
 * @param hours - Duration in hours
 * @returns Formatted string with one decimal place
 */
export const formatHours = (hours: number): string => {
  return hours.toFixed(1);
};

/**
 * Sort labels by training intensity zones
 * @param labels - Array of label objects to sort
 * @returns Sorted array of label objects
 */
export const sortLabelsByIntensity = (labels: { name: string; color: string }[]): { name: string; color: string }[] => {
  // Predefined physiological order of training zones
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

  return [...labels].sort((a, b) => {
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
 * Sort intensity zones by training intensity
 * @param zones - Array of intensity zone objects to sort
 * @returns Sorted array of intensity zone objects
 */
export const sortIntensityZones = (zones: IntensityZone[]): IntensityZone[] => {
  // Predefined physiological order of training zones
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

  return [...zones].sort((a, b) => {
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
 * Extract unique label data from weekly totals
 * @param weeklyTotals - Object containing sport data with labels
 * @returns Array of unique label objects
 */
export const extractLegendItems = (
  weeklyTotals: { 
    swim: { byLabel: Record<string, LabelData> }; 
    bike: { byLabel: Record<string, LabelData> }; 
    run: { byLabel: Record<string, LabelData> }; 
  }
): { name: string; color: string }[] => {
  const allLabels: Record<string, { name: string; color: string }> = {};

  // Collect all unique labels from all sports
  ['swim', 'bike', 'run'].forEach((sport) => {
    const sportData = weeklyTotals[sport as 'swim' | 'bike' | 'run'];
    Object.values(sportData.byLabel).forEach((label) => {
      if (!allLabels[label.id]) {
        allLabels[label.id] = { name: label.name, color: label.color };
      }
    });
  });

  return sortLabelsByIntensity(Object.values(allLabels));
};

/**
 * Calculate intensity distribution by aggregating all labels
 * @param weeklyTotals - Object containing sport data with labels
 * @returns Array of intensity zone objects
 */
export const calculateIntensityDistribution = (
  weeklyTotals: {
    swim: { byLabel: Record<string, LabelData> }; 
    bike: { byLabel: Record<string, LabelData> }; 
    run: { byLabel: Record<string, LabelData> };
    total: number;
  }
): IntensityZone[] => {
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
    const sportData = weeklyTotals[sport as 'swim' | 'bike' | 'run'];
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

  // Filter out zones with zero duration and sort by defined order
  return sortIntensityZones(
    Object.values(distribution).filter((zone) => zone.duration > 0)
  );
};

/**
 * Calculate number of training days in the week
 * @param dailyBreakdown - Array of daily totals
 * @returns Object with training and rest day counts
 */
export const calculateTrainingDays = (dailyBreakdown: { total: number }[]) => {
  // Count days with workouts
  const daysWithWorkouts = dailyBreakdown.filter((day) => day.total > 0).length;
  return {
    trainingDays: daysWithWorkouts,
    restDays: 7 - daysWithWorkouts,
  };
};