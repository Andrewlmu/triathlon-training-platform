/**
 * Types for the WeeklySummary component and its subcomponents
 */

/**
 * Interface for workout label data with duration
 */
export interface LabelData {
  id: string;
  name: string;
  color: string;
  duration: number;
}

/**
 * Interface for sport-specific data with label breakdown
 */
export interface SportData {
  total: number;
  byLabel: Record<string, LabelData>;
}

/**
 * Interface for daily training totals
 */
export interface DayTotals {
  date: Date;
  swim: number;
  bike: number;
  run: number;
  total: number;
}

/**
 * Interface for weekly training data summary
 */
export interface WeeklyData {
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
export interface IntensityZone {
  name: string;
  color: string;
  duration: number;
}

/**
 * Props for the SegmentedProgressBar component
 */
export interface SegmentedProgressBarProps {
  sportData: SportData;
  maxValue: number;
  baseColor: string;
}

/**
 * Props for the SportSummary component
 */
export interface SportSummaryProps {
  type: 'swim' | 'bike' | 'run';
  sportData: SportData;
  maxValue: number;
  baseColor: string;
  iconColor: string;
}

/**
 * Props for the NavigationHeader component
 */
export interface NavigationHeaderProps {
  currentWeekStart: Date;
  weekEnd: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

/**
 * Props for the DailyBreakdown component
 */
export interface DailyBreakdownProps {
  dailyBreakdown: DayTotals[];
}

/**
 * Props for the LabelLegend component
 */
export interface LabelLegendProps {
  labels: { name: string; color: string }[];
}

/**
 * Props for the TrainingMetrics component
 */
export interface TrainingMetricsProps {
  weeklyTotals: WeeklyData['weeklyTotals'];
  trainingDays: number;
  restDays: number;
  intensityZones: IntensityZone[];
}

/**
 * Props for the IntensityBreakdown component
 */
export interface IntensityBreakdownProps {
  intensityZones: IntensityZone[];
  totalDuration: number;
}