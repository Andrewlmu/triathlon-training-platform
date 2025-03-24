import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET Handler - Fetch all workouts for the authenticated user
 *
 * Returns all workouts belonging to the current user with their associated labels.
 * Workouts are sorted by date (descending) and order field (ascending).
 * Authentication is required.
 *
 * @route GET /api/workouts
 * @returns {Promise<NextResponse>} JSON response with workouts array or error
 */
export async function GET() {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch workouts for the authenticated user
    const workouts = await prisma.workout.findMany({
      where: { userId: session.user.id },
      include: { label: true }, // Include associated label data
      orderBy: [
        { date: 'desc' },
        { order: 'asc' }, // Order by date, then by order field
      ],
    });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}

/**
 * POST Handler - Create a new workout
 *
 * Creates a new workout for the authenticated user.
 * Automatically calculates the order field based on existing workouts for the same date.
 * Authentication is required.
 *
 * Required fields:
 * - type: Workout type (Swim, Bike, Run)
 * - title: Workout title
 * - date: ISO date string
 * - duration: Duration in minutes
 *
 * Optional fields:
 * - description: Detailed workout instructions
 * - labelId: Reference to a workout label
 *
 * @route POST /api/workouts
 * @returns {Promise<NextResponse>} JSON response with created workout or error
 */
export async function POST(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.type || !data.title || !data.date || data.duration === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate the highest order number for workouts on this date
    // This ensures new workouts are added at the end of the day's list
    const date = new Date(data.date);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingWorkouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        order: 'desc',
      },
      take: 1,
    });

    // Set the order to be one higher than the current highest
    const newOrder = existingWorkouts.length > 0 ? existingWorkouts[0].order + 1 : 0;

    // Create the base workout data
    let workoutData: {
      type: string;
      title: string;
      description: string;
      duration: number;
      date: Date;
      order: number;
      userId: string;
      labelId?: string;
    } = {
      type: data.type,
      title: data.title,
      description: data.description || '',
      duration: data.duration,
      date: new Date(data.date),
      order: newOrder,
      userId: session.user.id,
    };

    // If labelId is provided, use it directly
    if (data.labelId) {
      workoutData.labelId = data.labelId;
    }

    // Create workout in database
    const workout = await prisma.workout.create({
      data: workoutData,
      include: { label: true }, // Include the label in the response
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json({ error: 'Failed to create workout' }, { status: 500 });
  }
}

/**
 * PATCH Handler - Reorder workouts
 *
 * Updates the order and optionally the date of multiple workouts in a single operation.
 * Used for drag-and-drop reordering operations in the calendar.
 * Authentication is required.
 *
 * Expected request body:
 * {
 *   workouts: [
 *     { id: "workout-id", order: 0, date?: "2025-03-15T00:00:00.000Z" },
 *     ...
 *   ]
 * }
 *
 * @route PATCH /api/workouts
 * @returns {Promise<NextResponse>} JSON response with success status or error
 */
export async function PATCH(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate the input
    if (!data.workouts || !Array.isArray(data.workouts)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Prepare database operations for each workout update
    const updates = [];
    for (const item of data.workouts) {
      if (!item.id || item.order === undefined) continue;

      updates.push(
        prisma.workout.update({
          where: {
            id: item.id,
            userId: session.user.id, // Security check to ensure ownership
          },
          data: {
            order: item.order,
            date: item.date ? new Date(item.date) : undefined, // Allow moving to different date
          },
        })
      );
    }

    // Execute all updates in a transaction
    // This ensures all updates succeed or fail together
    await prisma.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering workouts:', error);
    return NextResponse.json({ error: 'Failed to reorder workouts' }, { status: 500 });
  }
}
