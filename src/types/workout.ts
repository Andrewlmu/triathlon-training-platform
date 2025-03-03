export interface Workout {
  id: string;
  type: "Bike" | "Run" | "Swim";
  title: string;
  description: string;
  duration: number;
  date: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}