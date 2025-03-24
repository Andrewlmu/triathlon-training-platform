"use client";

import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addMonths, isToday, isSameDay } from "date-fns";
import { Bike, Waves, Footprints, Plus, Calendar, Copy } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
  DragOverlay
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import WorkoutBuilder from "./workout/WorkoutBuilder";
import WorkoutDisplay from "./workout/WorkoutDisplay";
import CopyWeekModal from "./CopyWeekModal";
import { Workout, WorkoutType } from "@/types/workout";
import { useWorkouts } from "@/context/WorkoutContext";
import { useLabels } from "@/context/LabelContext";

/**
 * DroppableDay Component
 * 
 * Creates a droppable target area for each calendar day in the drag-and-drop system.
 * Each day becomes a drop zone where workouts can be dragged to.
 * 
 * @param id - Unique identifier for the droppable area
 * @param children - Child components to render within the droppable area
 * @param className - Additional CSS classes to apply
 * @param isActive - Whether this drop area is currently active (being targeted)
 * @returns A div that acts as a drop target for workouts
 */
const DroppableDay = ({
  id,
  children,
  className,
  isActive
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      id={id}
      className={`${className} ${isActive ? 'bg-[#252525] bg-opacity-30' : ''}`}
    >
      {children}
    </div>
  );
};

/**
 * SortableWorkoutItem Component
 * 
 * Renders a workout item that can be dragged, sorted, and reordered within the calendar.
 * Displays workout information with appropriate styling based on workout type and label.
 * 
 * @param workout - The workout data to display
 * @param onClick - Callback function when the workout item is clicked
 * @param labels - Array of available workout labels for styling
 * @returns A draggable workout component with type icon, title and duration
 */
const SortableWorkoutItem = ({ workout, onClick, labels }: { workout: Workout; onClick: () => void; labels: any[] }) => {
  // Set up sortable functionality using dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: workout.id });

  // Find the label for this workout if it has one
  const workoutLabel = workout.labelId
    ? labels.find(l => l.id === workout.labelId)
    : null;

  // Prepare styling based on dragging state and workout label
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    ...(workoutLabel ? {
      backgroundColor: `${workoutLabel.color}66`,
      borderLeftColor: workoutLabel.color
    } : {})
  };

  /**
   * Formats workout duration from minutes to hours display format
   * @param minutes - Duration in minutes
   * @returns Formatted string with hours
   */
  const formatDuration = (minutes: number): string => {
    const hours = minutes / 60;
    return `${hours.toFixed(1)}h`;
  };

  /**
   * Returns the appropriate icon component based on workout type
   * @param type - The workout type (Swim, Bike, or Run)
   * @returns React icon component with appropriate styling
   */
  const getWorkoutIcon = (type: WorkoutType) => {
    switch (type) {
      case "Swim":
        return <Waves className="h-4 w-4 text-[#00CED1]" />;
      case "Bike":
        return <Bike className="h-4 w-4 text-[#1E90FF]" />;
      case "Run":
        return <Footprints className="h-4 w-4 text-[#E63946]" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`flex items-center text-xs p-1.5 rounded-sm border-l-2
        ${!workoutLabel ? 'bg-white bg-opacity-5 border-white' : ''} 
        hover:bg-opacity-25 transition cursor-grab active:cursor-grabbing`}
      onClick={onClick}
    >
      <div className="flex items-center gap-1 w-full overflow-hidden">
        {getWorkoutIcon(workout.type)}
        <span className="font-medium text-white truncate">{workout.title}</span>
        <span className="ml-auto text-[#A0A0A0] whitespace-nowrap">{formatDuration(workout.duration)}</span>
      </div>
    </div>
  );
};

/**
 * DayContainer Component
 * 
 * Renders a single day cell in the calendar with all associated workouts.
 * Handles the layout of workouts within a day and provides UI for adding new workouts.
 * 
 * @param day - The date object representing this day
 * @param workouts - Array of workouts scheduled for this day
 * @param isCurrentDay - Whether this is the current day (today)
 * @param onAddWorkout - Callback function when add workout button is clicked
 * @param onSelectWorkout - Callback function when a workout is selected
 * @param totalDuration - Total duration of all workouts for this day in minutes
 * @param labels - Array of available workout labels
 * @returns A day cell component with workouts and add button
 */
const DayContainer = ({
  day,
  workouts,
  isCurrentDay,
  onAddWorkout,
  onSelectWorkout,
  totalDuration,
  labels
}: {
  day: Date;
  workouts: Workout[];
  isCurrentDay: boolean;
  onAddWorkout: () => void;
  onSelectWorkout: (workout: Workout) => void;
  totalDuration: number;
  labels: any[]
}) => {
  // Create unique identifier for this day's drop target
  const dayId = `day-${format(day, 'yyyy-MM-dd')}`;

  /**
   * Formats workout duration from minutes to hours display format
   * @param minutes - Duration in minutes
   * @returns Formatted string with hours
   */
  const formatDuration = (minutes: number): string => {
    const hours = minutes / 60;
    return `${hours.toFixed(1)}h`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Day Number and Total Duration */}
      <div className="flex justify-between items-start mb-1">
        <span className={`text-sm font-medium text-white ${isCurrentDay ? "bg-[#FFD700] text-[#121212] w-6 h-6 rounded-full flex items-center justify-center" : ""
          }`}>
          {format(day, "d")}
        </span>
        {totalDuration > 0 && (
          <span className="text-xs px-1.5 py-0.5 bg-[#252525] rounded text-[#A0A0A0] font-medium">
            {formatDuration(totalDuration)}
          </span>
        )}
      </div>

      {/* Sortable Area - Container for the day's workouts */}
      <div className="mt-1 space-y-1.5 flex-grow overflow-y-auto max-h-28">
        <SortableContext items={workouts.map(w => w.id)} strategy={rectSortingStrategy}>
          {workouts.map((workout) => (
            <SortableWorkoutItem
              key={workout.id}
              workout={workout}
              onClick={() => onSelectWorkout(workout)}
              labels={labels}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add Workout Button */}
      <button
        onClick={onAddWorkout}
        className="self-end p-1 mt-1 rounded-full bg-[#252525] hover:bg-[#333333] transition"
        aria-label="Add workout"
      >
        <Plus className="h-4 w-4 text-[#FFD700]" />
      </button>
    </div>
  );
};

/**
 * TrainingCalendar Component
 * 
 * Main calendar interface component for the triathlon training platform.
 * Provides a monthly calendar view with drag-and-drop workout management,
 * workout creation/editing, and week copying functionality.
 * 
 * Features:
 * - Monthly calendar navigation
 * - Drag and drop workout management
 * - Workout creation, editing, and viewing
 * - Copy week functionality for repeating training blocks
 * 
 * @returns A fully interactive training calendar component
 */
const TrainingCalendar = () => {
  // State management for calendar view and interactions
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [showCopyWeekModal, setShowCopyWeekModal] = useState(false);

  // Get workout data and functions from context
  const { workouts, isLoading, addWorkout, updateWorkout, deleteWorkout, reorderWorkouts } = useWorkouts();
  const { labels } = useLabels();

  // Configure sensors for drag and drop
  // MouseSensor requires a minimum drag distance to prevent accidental drags
  // TouchSensor has a delay to distinguish between taps and drags on touch devices
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Delay for touch devices
        tolerance: 5,
      },
    })
  );

  // Initialize calendar with current month on component mount
  useEffect(() => {
    setCurrentMonth(new Date());
  }, []);

  // Show loading state while initializing
  if (!currentMonth || isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-[#121212] rounded-lg shadow-xl p-4">
        <h2 className="text-lg font-bold text-white">Loading calendar...</h2>
      </div>
    );
  }

  // Calculate calendar days for the current month view
  // This generates the days array used to render the calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start week on Monday
  const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  /**
   * Handle saving a new workout or updating an existing one
   * 
   * @param date - The date to save the workout on
   * @param workout - The workout data to save
   */
  const handleSaveWorkout = async (date: Date, workout: Workout) => {
    try {
      const workoutData = {
        ...workout,
        date: date.toISOString()
      };

      if (editingWorkout) {
        await updateWorkout(editingWorkout.id, workoutData);
      } else {
        await addWorkout(workoutData);
      }

      setEditingWorkout(null);
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  /**
   * Handle deleting a workout 
   * 
   * @param workoutId - The ID of the workout to delete
   */
  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await deleteWorkout(workoutId);
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  /**
   * Navigate to the current month
   */
  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  /**
   * Calculate the total duration of all workouts for a day
   * 
   * @param workouts - Array of workouts for a day
   * @returns Total duration in minutes
   */
  const calculateDayTotalDuration = (workouts: Workout[]): number => {
    return workouts.reduce((total, workout) => total + workout.duration, 0);
  };

  /**
   * Get workouts for a specific date
   * 
   * @param date - The date to get workouts for
   * @returns Array of workouts for that date, sorted by order
   */
  const getWorkoutsForDay = (date: Date): Workout[] => {
    // Filter workouts that match this specific day
    const filteredWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate.getFullYear() === date.getFullYear() &&
        workoutDate.getMonth() === date.getMonth() &&
        workoutDate.getDate() === date.getDate()
      );
    });

    // Sort by order field to maintain user-defined sequence
    return filteredWorkouts.sort((a, b) => a.order - b.order);
  };

  /**
   * Generate a unique droppable ID for a day
   * 
   * @param date - The date to generate an ID for
   * @returns A unique string ID for the day
   */
  const getDayId = (date: Date): string => {
    return `day-${format(date, 'yyyy-MM-dd')}`;
  };

  /**
   * Handle the start of a drag operation
   * Tracks which workout is being dragged and from which day
   * 
   * @param event - The drag start event
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const workoutId = active.id as string;

    // Find the dragged workout
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      // Store the active workout for the drag overlay
      setActiveWorkout(workout);

      // Track which day this workout belongs to for highlighting
      const workoutDate = new Date(workout.date);
      setActiveDayId(getDayId(workoutDate));
    }
  };

  /**
   * Handle the end of a drag operation
   * Manages reordering workouts within a day or moving workouts between days
   * 
   * @param event - The drag end event
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // Reset active states
    setActiveWorkout(null);
    setActiveDayId(null);

    // Skip if dropped outside a valid target
    if (!over) return;

    const workoutId = active.id as string;
    const targetId = over.id;

    // Find the dragged workout
    const draggedWorkout = workouts.find(w => w.id === workoutId);
    if (!draggedWorkout) {
      console.error('Could not find dragged workout');
      return;
    }

    // Determine if target is a day or a workout
    const isTargetDay = typeof targetId === 'string' && targetId.startsWith('day-');
    const isTargetWorkout = !isTargetDay;

    // Get source information
    const sourceDate = new Date(draggedWorkout.date);
    const sourceDayId = getDayId(sourceDate);
    const sourceWorkouts = getWorkoutsForDay(sourceDate);

    // Get destination information
    let destinationDayId: string;

    if (isTargetDay) {
      // If dropped directly on a day
      destinationDayId = targetId as string;
    } else {
      // If dropped on a workout, find which day it belongs to
      const targetWorkout = workouts.find(w => w.id === targetId);
      if (!targetWorkout) {
        console.error('Could not find target workout');
        return;
      }
      const targetDate = new Date(targetWorkout.date);
      destinationDayId = getDayId(targetDate);
    }

    // Parse the destination date from the day ID
    const destinationDateStr = destinationDayId.replace('day-', '');
    const [yearStr, monthStr, dayStr] = destinationDateStr.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1; // Month is 0-indexed in JS Date
    const day = parseInt(dayStr);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      console.error('Invalid date format:', destinationDateStr);
      return;
    }

    const destinationDate = new Date(year, month, day);
    const destinationWorkouts = getWorkoutsForDay(destinationDate);

    // Prepare workouts to update
    let updatedWorkouts: { id: string; order: number; date?: string }[] = [];

    // Handle same day reordering
    if (sourceDayId === destinationDayId) {

      // Only reorder if dropped on another workout
      if (isTargetWorkout) {
        // Find the source and target positions within the day's workouts
        const sourceIndex = sourceWorkouts.findIndex(w => w.id === workoutId);
        const targetIndex = sourceWorkouts.findIndex(w => w.id === targetId);

        if (sourceIndex === -1 || targetIndex === -1) {
          console.error('Invalid source or target index');
          return;
        }

        // Use arrayMove utility to create a new array with the workout moved to target position
        const reorderedWorkouts = arrayMove(sourceWorkouts, sourceIndex, targetIndex);

        // Update the order property for all workouts in the day to match their new positions
        updatedWorkouts = reorderedWorkouts.map((workout, index) => ({
          id: workout.id,
          order: index
        }));
      }
    } else {

      // Handle source day - remove workout
      const sourceIndex = sourceWorkouts.findIndex(w => w.id === workoutId);
      if (sourceIndex === -1) {
        console.error('Could not find workout in source day');
        return;
      }

      // Create a new array of workouts for the source day, removing the dragged workout
      const updatedSourceWorkouts = [...sourceWorkouts];
      updatedSourceWorkouts.splice(sourceIndex, 1);

      // Update order properties for remaining workouts in source day
      const sourceUpdates = updatedSourceWorkouts.map((workout, index) => ({
        id: workout.id,
        order: index
      }));

      // Handle destination day - add workout
      const formattedDestinationDate = destinationDate.toISOString();

      // Determine insertion position
      let insertIndex;

      if (isTargetWorkout) {
        // If dropped on a specific workout, insert at that position
        const targetIndex = destinationWorkouts.findIndex(w => w.id === targetId);
        insertIndex = targetIndex !== -1 ? targetIndex : destinationWorkouts.length;
      } else {
        // If dropped on the day container, add to the end
        insertIndex = destinationWorkouts.length;
      }

      // Create a new array of workouts for the destination day with the dragged workout inserted
      const updatedDestWorkouts = [...destinationWorkouts];
      updatedDestWorkouts.splice(insertIndex, 0, {
        ...draggedWorkout,
        date: formattedDestinationDate
      });

      // Update order properties and date for workouts in destination day
      const destUpdates = updatedDestWorkouts.map((workout, index) => ({
        id: workout.id,
        order: index,
        // Only update date for the moved workout
        date: workout.id === workoutId ? formattedDestinationDate : undefined
      }));

      // Combine all updates from source and destination days
      updatedWorkouts = [...sourceUpdates, ...destUpdates];
    }

    // Save changes to the database
    if (updatedWorkouts.length > 0) {
      try {
        await reorderWorkouts(updatedWorkouts);
      } catch (error) {
        console.error('Error reordering workouts:', error);
      }
    } else {
      // No updates to save
    }
  };

  /**
   * Render function for drag overlay
   * Creates a visual representation of the workout being dragged
   * 
   * @returns A styled representation of the active workout for drag overlay
   */
  const renderDragOverlay = () => {
    if (!activeWorkout) return null;

    const workoutLabel = activeWorkout.labelId
      ? labels.find(l => l.id === activeWorkout.labelId)
      : null;

    const formatDuration = (minutes: number): string => {
      const hours = minutes / 60;
      return `${hours.toFixed(1)}h`;
    };

    const getWorkoutIcon = (type: WorkoutType) => {
      switch (type) {
        case "Swim":
          return <Waves className="h-4 w-4 text-[#00CED1]" />;
        case "Bike":
          return <Bike className="h-4 w-4 text-[#1E90FF]" />;
        case "Run":
          return <Footprints className="h-4 w-4 text-[#E63946]" />;
      }
    };

    return (
      <div
        className={`flex items-center text-xs p-1.5 rounded-sm border-l-2 shadow-md
          ${!workoutLabel ? 'bg-white bg-opacity-5 border-white' : ''}`}
        style={workoutLabel ? {
          backgroundColor: `${workoutLabel.color}1A`,
          borderLeftColor: workoutLabel.color
        } : {}}
      >
        <div className="flex items-center gap-1 w-full overflow-hidden">
          {getWorkoutIcon(activeWorkout.type)}
          <span className="font-medium text-white truncate">{activeWorkout.title}</span>
          <span className="ml-auto text-[#A0A0A0] whitespace-nowrap">{formatDuration(activeWorkout.duration)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#121212] rounded-lg shadow-xl">
      {/* Calendar Header with Navigation */}
      <div className="p-4 flex items-center justify-between border-b border-[#333333] bg-[#1E1E1E]">
        <h2 className="text-lg font-bold text-white">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCopyWeekModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#252525] text-white rounded-md hover:bg-[#333333] transition"
            aria-label="Copy week"
          >
            <Copy className="h-4 w-4" />
            Copy Week
          </button>
          <button
            onClick={goToToday}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#FFD700] text-[#121212] rounded-md hover:bg-[#F0C800] transition"
            aria-label="Go to today"
          >
            <Calendar className="h-4 w-4" />
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            className="px-3 py-1.5 bg-[#252525] text-white rounded-md hover:bg-[#333333] transition"
            aria-label="Previous month"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-3 py-1.5 bg-[#252525] text-white rounded-md hover:bg-[#333333] transition"
            aria-label="Next month"
          >
            Next
          </button>
        </div>
      </div>

      {/* DndContext provides drag and drop functionality for the entire calendar */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-[#333333]">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-[#A0A0A0] bg-[#1E1E1E]">{day}</div>
          ))}

          {/* Calendar Days Grid */}
          {days.map((day) => {
            const dayWorkouts = getWorkoutsForDay(day);
            const totalDuration = calculateDayTotalDuration(dayWorkouts);
            const isCurrentDay = isToday(day);
            const dayId = getDayId(day);
            const isActive = activeDayId === dayId;

            return (
              <DroppableDay
                key={day.toISOString()}
                id={dayId}
                isActive={isActive}
                className={`min-h-32 p-2 border border-[#333333] relative 
                  ${isSameMonth(day, currentMonth)
                    ? "bg-[#1E1E1E]"
                    : "bg-[#121212] text-[#666666]"
                  }
                `}
              >
                <DayContainer
                  day={day}
                  workouts={dayWorkouts}
                  isCurrentDay={isCurrentDay}
                  onAddWorkout={() => {
                    setSelectedDate(day);
                    setEditingWorkout(null);
                  }}
                  onSelectWorkout={setSelectedWorkout}
                  totalDuration={totalDuration}
                  labels={labels}
                />
              </DroppableDay>
            );
          })}
        </div>

        {/* Drag Overlay - shows the workout being dragged */}
        <DragOverlay>{renderDragOverlay()}</DragOverlay>
      </DndContext>

      {/* Workout Builder Modal - Opens when adding/editing a workout */}
      {selectedDate && (
        <WorkoutBuilder
          date={selectedDate}
          workout={editingWorkout}
          onClose={() => {
            setSelectedDate(null);
            setEditingWorkout(null);
          }}
          onSave={(workout) => handleSaveWorkout(selectedDate, workout)}
        />
      )}

      {/* Workout Display Modal - Opens when viewing a workout */}
      {selectedWorkout && (
        <WorkoutDisplay
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          onEdit={() => {
            // Find the date object for this workout
            const workoutDate = new Date(selectedWorkout.date);
            setEditingWorkout(selectedWorkout);
            setSelectedDate(workoutDate);
            setSelectedWorkout(null);
          }}
        />
      )}

      {/* Copy Week Modal */}
      {showCopyWeekModal && (
        <CopyWeekModal
          onClose={() => setShowCopyWeekModal(false)}
        />
      )}
    </div>
  );
};

export default TrainingCalendar;