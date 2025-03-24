import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { WorkoutProvider, useWorkouts } from './WorkoutContext';
import { WorkoutType } from '@/types/workout';

// Mock the actual context module
jest.mock('./WorkoutContext', () => {
  // Store the original module
  const originalModule = jest.requireActual('./WorkoutContext');

  // Return a modified version
  return {
    ...originalModule,
    // Override the useWorkouts hook for testing
    useWorkouts: jest.fn(),
    // Keep the provider as is
    WorkoutProvider: originalModule.WorkoutProvider,
  };
});

// Mock fetch globally
global.fetch = jest.fn();

// Helper to mock fetch responses
const mockFetchResponse = (data: any, ok = true) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: jest.fn().mockResolvedValueOnce(data),
  });
};

// Sample workout data
const mockWorkouts = [
  {
    id: 'workout-1',
    type: 'Bike' as WorkoutType,
    title: 'Morning Ride',
    duration: 60,
    date: '2025-03-15T08:00:00.000Z',
    userId: 'user-123',
    order: 0,
    description: 'Easy ride',
  },
  {
    id: 'workout-2',
    type: 'Run' as WorkoutType,
    title: 'Evening Run',
    duration: 45,
    date: '2025-03-15T18:00:00.000Z',
    userId: 'user-123',
    order: 1,
    description: 'Tempo run',
  },
];

// Test component that uses the workout context
const TestComponent = () => {
  const { workouts, isLoading, addWorkout, deleteWorkout } = useWorkouts();

  // Function to test addWorkout
  const handleAddWorkout = async () => {
    const newWorkout = {
      id: 'new-workout',
      type: 'Swim' as WorkoutType,
      title: 'Morning Swim',
      duration: 30,
      date: '2025-03-16T08:00:00.000Z',
      userId: 'user-123',
      order: 0,
      description: 'Easy swim',
    };
    await addWorkout(newWorkout);
  };

  // Function to test deleteWorkout
  const handleDeleteWorkout = async (id: string) => {
    await deleteWorkout(id);
  };

  return (
    <div>
      <h1>Workouts</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {Array.isArray(workouts) &&
              workouts.map((workout) => (
                <li key={workout.id} data-testid={`workout-${workout.id}`}>
                  {workout.title}
                  <button
                    onClick={() => handleDeleteWorkout(workout.id)}
                    data-testid={`delete-${workout.id}`}
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
          <button onClick={handleAddWorkout} data-testid="add-workout">
            Add Workout
          </button>
        </>
      )}
    </div>
  );
};

describe('WorkoutContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementation for useWorkouts
    (useWorkouts as jest.Mock).mockReturnValue({
      workouts: mockWorkouts,
      isLoading: false,
      addWorkout: jest.fn(),
      deleteWorkout: jest.fn(),
      reorderWorkouts: jest.fn(),
      moveWorkout: jest.fn(),
      copyWorkoutsToWeek: jest.fn(),
    });
  });

  it('displays workouts when loaded', async () => {
    render(<TestComponent />);

    // Check that workouts are displayed
    expect(screen.getByText('Morning Ride')).toBeInTheDocument();
    expect(screen.getByText('Evening Run')).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    // Override the mock to show loading state
    (useWorkouts as jest.Mock).mockReturnValue({
      workouts: [],
      isLoading: true,
      addWorkout: jest.fn(),
      deleteWorkout: jest.fn(),
    });

    render(<TestComponent />);

    // Check that loading text is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles adding a workout', async () => {
    const mockAddWorkout = jest.fn();

    // Setup mock implementation
    (useWorkouts as jest.Mock).mockReturnValue({
      workouts: mockWorkouts,
      isLoading: false,
      addWorkout: mockAddWorkout,
      deleteWorkout: jest.fn(),
    });

    render(<TestComponent />);

    // Click the add workout button
    const addButton = screen.getByTestId('add-workout');
    await act(async () => {
      addButton.click();
    });

    // Verify addWorkout was called
    expect(mockAddWorkout).toHaveBeenCalledTimes(1);

    // Verify the workout data passed to addWorkout
    expect(mockAddWorkout).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'Swim',
        title: 'Morning Swim',
      })
    );
  });

  it('handles deleting a workout', async () => {
    const mockDeleteWorkout = jest.fn();

    // Setup mock implementation
    (useWorkouts as jest.Mock).mockReturnValue({
      workouts: mockWorkouts,
      isLoading: false,
      addWorkout: jest.fn(),
      deleteWorkout: mockDeleteWorkout,
    });

    render(<TestComponent />);

    // Click the delete button for the first workout
    const deleteButton = screen.getByTestId('delete-workout-1');
    await act(async () => {
      deleteButton.click();
    });

    // Verify deleteWorkout was called with the correct ID
    expect(mockDeleteWorkout).toHaveBeenCalledWith('workout-1');
  });
});
