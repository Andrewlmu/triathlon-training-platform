import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CopyWeekModal from './CopyWeekModal';
import { useWorkouts } from '@/context/WorkoutContext';
import { format, addWeeks } from 'date-fns';
import { WorkoutType } from '@/types/workout';

// Mock the workouts context
jest.mock('@/context/WorkoutContext');

// Mock the lucide-react icons directly to avoid ESM issues
jest.mock('lucide-react', () => {
  const mockIcon = () => <div data-testid="icon-mock">Icon</div>;
  return {
    X: mockIcon,
    Copy: mockIcon,
    Calendar: mockIcon,
  };
});

describe('CopyWeekModal', () => {
  // Sample mock data
  const mockWorkouts = [
    {
      id: 'workout-1',
      type: 'Bike' as WorkoutType,
      title: 'Monday Ride',
      duration: 60,
      date: '2025-03-10T08:00:00.000Z', // Monday
      userId: 'user-123',
      order: 0,
      description: 'Easy ride',
    },
    {
      id: 'workout-2',
      type: 'Run' as WorkoutType,
      title: 'Wednesday Run',
      duration: 45,
      date: '2025-03-12T18:00:00.000Z', // Wednesday
      userId: 'user-123',
      order: 0,
      description: 'Tempo run',
    },
    {
      id: 'workout-3',
      type: 'Swim' as WorkoutType,
      title: 'Friday Swim',
      duration: 30,
      date: '2025-03-14T07:00:00.000Z', // Friday
      userId: 'user-123',
      order: 0,
      description: 'Technique drills',
    },
  ];

  // Mock functions
  const mockCopyWorkoutsToWeek = jest.fn().mockResolvedValue(true);
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the useWorkouts hook
    (useWorkouts as jest.Mock).mockReturnValue({
      workouts: mockWorkouts,
      isLoading: false,
      copyWorkoutsToWeek: mockCopyWorkoutsToWeek,
    });
  });

  it('renders with source and target week inputs', () => {
    render(<CopyWeekModal onClose={mockOnClose} />);

    // Check that the title is displayed
    expect(screen.getByText('Copy Training Week')).toBeInTheDocument();

    // Check that source and target week fields are displayed
    expect(screen.getByText('Source Week (any day in the week)')).toBeInTheDocument();
    expect(screen.getByText('Target Week (any day in the week)')).toBeInTheDocument();

    // Check that buttons are rendered - now using a more flexible selector
    expect(screen.getByText('Copy Week')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('displays workout summary information', () => {
    render(<CopyWeekModal onClose={mockOnClose} />);

    // Check workout summary is displayed
    expect(screen.getByText('Workouts to Copy')).toBeInTheDocument();
    expect(screen.getByText('Total workouts:')).toBeInTheDocument();

    // Check sport breakdown
    expect(screen.getByText('Swim:')).toBeInTheDocument();
    expect(screen.getByText('Bike:')).toBeInTheDocument();
    expect(screen.getByText('Run:')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<CopyWeekModal onClose={mockOnClose} />);

    // Find and click the cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Verify onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls copyWorkoutsToWeek when copy button is clicked', async () => {
    render(<CopyWeekModal onClose={mockOnClose} />);

    // Find and click the copy button using text content
    const copyButton = screen.getByText('Copy Week');
    fireEvent.click(copyButton);

    // Verify copyWorkoutsToWeek was called
    await waitFor(() => {
      expect(mockCopyWorkoutsToWeek).toHaveBeenCalledTimes(1);
    });
  });

  it('shows success message after copying workouts', async () => {
    render(<CopyWeekModal onClose={mockOnClose} />);

    // Find and click the copy button using text content
    const copyButton = screen.getByText('Copy Week');
    fireEvent.click(copyButton);

    // Verify success message appears
    await waitFor(() => {
      expect(screen.getByText(/successfully copied workouts/i)).toBeInTheDocument();
    });
  });

  it('disables copy button when no workouts to copy', async () => {
    // Override the mock to return empty workouts array
    (useWorkouts as jest.Mock).mockReturnValue({
      workouts: [],
      isLoading: false,
      copyWorkoutsToWeek: mockCopyWorkoutsToWeek,
    });

    render(<CopyWeekModal onClose={mockOnClose} />);

    // Check that total workouts element exists
    const totalWorkoutsText = screen.getByText('Total workouts:');
    const totalValue = totalWorkoutsText.nextElementSibling;
    expect(totalValue?.textContent).toBe('0');

    // Get the copy button and verify it's disabled
    const copyButton = screen.getByText('Copy Week').closest('button');
    expect(copyButton).toBeDisabled();

    // Verify copyWorkoutsToWeek was not called
    expect(mockCopyWorkoutsToWeek).not.toHaveBeenCalled();
  });
});
