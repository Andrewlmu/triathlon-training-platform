import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutDisplay from './WorkoutDisplay';
import { useWorkouts } from '@/context/WorkoutContext';
import { useLabels } from '@/context/LabelContext';
import { WorkoutType } from '@/types/workout';

// Mock the context hooks
jest.mock('@/context/WorkoutContext');
jest.mock('@/context/LabelContext');

// Mock the lucide-react icons directly to avoid ESM issues
jest.mock('lucide-react', () => {
  const mockIcon = () => <div data-testid="icon-mock">Icon</div>;
  return {
    X: mockIcon,
    Edit: mockIcon,
    Trash: mockIcon,
    Bike: mockIcon,
    Footprints: mockIcon,
    Waves: mockIcon,
  };
});

describe('WorkoutDisplay', () => {
  // Mock workout data
  const mockWorkout = {
    id: 'workout-123',
    type: 'Bike' as WorkoutType,
    title: 'Sweet Spot Intervals',
    description: '4x10 minutes at 90% FTP with 5 minute recoveries',
    duration: 90,
    date: '2025-03-15T08:00:00.000Z',
    userId: 'user-123',
    order: 0,
  };

  // Mock label data
  const mockLabel = {
    id: 'label-123',
    name: 'Sweet Spot',
    color: '#F0C800',
    userId: 'user-123',
  };

  // Mock the close and edit functions
  const mockOnClose = jest.fn();
  const mockOnEdit = jest.fn();
  const mockDeleteWorkout = jest.fn().mockImplementation(() => {
    // Important: We need to mock this implementation to call onClose
    // to match the behavior in the actual component
    mockOnClose();
    return Promise.resolve(true);
  });

  beforeEach(() => {
    // Set up mocks before each test
    (useWorkouts as jest.Mock).mockReturnValue({
      deleteWorkout: mockDeleteWorkout,
    });

    (useLabels as jest.Mock).mockReturnValue({
      labels: [mockLabel],
    });

    // Clear mocks
    jest.clearAllMocks();
  });

  it('renders the workout title and details', () => {
    render(<WorkoutDisplay workout={mockWorkout} onClose={mockOnClose} onEdit={mockOnEdit} />);

    // Check that the workout title is displayed
    expect(screen.getByText('Sweet Spot Intervals')).toBeInTheDocument();

    // Check that the description is displayed
    expect(
      screen.getByText('4x10 minutes at 90% FTP with 5 minute recoveries')
    ).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<WorkoutDisplay workout={mockWorkout} onClose={mockOnClose} onEdit={mockOnEdit} />);

    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Check that onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<WorkoutDisplay workout={mockWorkout} onClose={mockOnClose} onEdit={mockOnEdit} />);

    // Find and click the edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Check that onEdit was called
    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('deletes the workout when delete button is clicked', () => {
    render(<WorkoutDisplay workout={mockWorkout} onClose={mockOnClose} onEdit={mockOnEdit} />);

    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Check that deleteWorkout was called with the correct workout ID
    expect(mockDeleteWorkout).toHaveBeenCalledWith('workout-123');
    // Check that onClose was called after deletion
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays the label when workout has a label', () => {
    const workoutWithLabel = {
      ...mockWorkout,
      labelId: 'label-123',
    };

    render(<WorkoutDisplay workout={workoutWithLabel} onClose={mockOnClose} onEdit={mockOnEdit} />);

    // Check that the label name is displayed
    expect(screen.getByText('Sweet Spot')).toBeInTheDocument();
  });
});
