export type WorkoutType = 'Bike' | 'Run' | 'Swim';

export interface WorkoutLabel {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Workout {
  id: string;
  type: WorkoutType;
  title: string;
  description: string;
  duration: number;
  date: string;
  labelId?: string;
  label?: WorkoutLabel;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}