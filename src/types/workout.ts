export type WorkoutType = 'Bike' | 'Run' | 'Swim';

export interface Workout {
  id: string;
  type: WorkoutType;
  title: string;
  description: string;  // Plain text workout description
  duration: number;     // in minutes
  date: string;
}