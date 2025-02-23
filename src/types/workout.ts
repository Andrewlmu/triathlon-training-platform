export type WorkoutType = 'Bike' | 'Run' | 'Swim';
export type SectionType = 'warmup' | 'main' | 'cooldown';
export type IntensityType = 'power' | 'pace' | 'heartrate';

export interface WorkoutInterval {
    duration: number;  // in minutes
    distance?: number; // in meters/km depending on workout type
    intensity: {
        type: IntensityType;
        value: number | string;  // percentage for power, pace string, or HR number
    };
    description?: string;
    restDuration?: number;  // rest period after interval in minutes
}

export interface WorkoutSection {
    type: SectionType;
    title?: string;
    repetitions: number;
    intervals: WorkoutInterval[];
}

export interface Workout {
    id: string;
    type: WorkoutType;
    title: string;
    description?: string;
    date: string;
    sections: WorkoutSection[];
}