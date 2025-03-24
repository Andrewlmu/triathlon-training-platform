import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET Handler - Fetch a single workout by ID
 * 
 * Retrieves a specific workout with its associated label.
 * Verifies that the workout belongs to the authenticated user.
 * Authentication is required.
 * 
 * @route GET /api/workouts/:id
 * @param context - Contains route parameters including workout ID
 * @returns {Promise<NextResponse>} JSON response with workout data or error
 */
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch the workout with its label
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: { label: true }
    });

    // Check if workout exists
    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Check if the workout belongs to the current user
    // This prevents unauthorized access to other users' workouts
    if (workout.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    );
  }
}

/**
 * PATCH Handler - Update a workout
 * 
 * Updates an existing workout with the provided data.
 * Verifies that the workout belongs to the authenticated user.
 * Authentication is required.
 * 
 * Note: labelId can be set to empty string to remove the label.
 * 
 * @route PATCH /api/workouts/:id
 * @param context - Contains route parameters including workout ID
 * @returns {Promise<NextResponse>} JSON response with updated workout or error
 */
export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the workout to check ownership
    const existingWorkout = await prisma.workout.findUnique({
      where: { id },
    });

    // Check if workout exists
    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Check if the workout belongs to the current user
    if (existingWorkout.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to modify this workout' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Handle date conversion if it exists
    if (data.date) {
      data.date = new Date(data.date);
    }

    // If labelId is empty string, set to null (remove label)
    if (data.labelId === "") {
      data.labelId = null;
    }

    // Update the workout
    const workout = await prisma.workout.update({
      where: { id },
      data,
      include: { label: true } // Include the label in the response
    });

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error updating workout:', error);
    return NextResponse.json(
      { error: 'Failed to update workout' },
      { status: 500 }
    );
  }
}

/**
 * DELETE Handler - Delete a workout
 * 
 * Removes a workout from the database.
 * Verifies that the workout belongs to the authenticated user.
 * Authentication is required.
 * 
 * @route DELETE /api/workouts/:id
 * @param context - Contains route parameters including workout ID
 * @returns {Promise<NextResponse>} JSON response with success status or error
 */
export async function DELETE(
  request: Request,
  context: { params: Record<string, string> }
) {
  try {
    // Use bracket notation for extra safety with the params object
    const workoutId = String(context.params["id"]);

    // Verify authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the workout to check ownership
    const existingWorkout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    // Check if workout exists
    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Check if the workout belongs to the current user
    if (existingWorkout.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this workout' },
        { status: 403 }
      );
    }

    // Delete the workout from the database
    await prisma.workout.delete({
      where: { id: workoutId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
}