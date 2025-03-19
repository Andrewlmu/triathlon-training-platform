import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET a single workout
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workout = await prisma.workout.findUnique({
      where: { id },
      include: { label: true }
    });

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Check if the workout belongs to the current user
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

// PATCH to update a workout
export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
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
    console.log("Updating workout with data:", data);

    // Handle date conversion if it exists
    if (data.date) {
      data.date = new Date(data.date);
    }

    // If labelId is provided, use it directly
    if (data.labelId === "") {
      data.labelId = null;
    }

    // Update the workout
    const workout = await prisma.workout.update({
      where: { id },
      data,
      include: { label: true }
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

// DELETE a workout
export async function DELETE(
  request: Request,
  context: { params: Record<string, string> }
) {
  try {
    // Use bracket notation instead of dot notation or destructuring
    const workoutId = String(context.params["id"]);

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