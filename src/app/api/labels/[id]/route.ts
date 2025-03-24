import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * DELETE Handler - Delete a workout label
 *
 * Removes a workout label from the database.
 * Verifies that the label belongs to the authenticated user.
 * Associated workouts will have their labelId set to null.
 * Authentication is required.
 *
 * @route DELETE /api/labels/:id
 * @param params - Contains route parameters including label ID
 * @returns {Promise<NextResponse>} JSON response with success status or error
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the label to check ownership
    const existingLabel = await prisma.workoutLabel.findUnique({
      where: { id: params.id },
    });

    // Check if label exists
    if (!existingLabel) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    // Check if the label belongs to the current user
    if (existingLabel.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this label' }, { status: 403 });
    }

    // Delete the label from the database
    await prisma.workoutLabel.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete label' }, { status: 500 });
  }
}

/**
 * PATCH Handler - Update a workout label
 *
 * Updates an existing workout label with the provided name and/or color.
 * Verifies that the label belongs to the authenticated user.
 * Authentication is required.
 *
 * Expected request body:
 * {
 *   name?: "New Name",   // Optional new label name
 *   color?: "#FF5733"    // Optional new color code
 * }
 *
 * @route PATCH /api/labels/:id
 * @param params - Contains route parameters including label ID
 * @returns {Promise<NextResponse>} JSON response with updated label or error
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the label to check ownership
    const existingLabel = await prisma.workoutLabel.findUnique({
      where: { id: params.id },
    });

    // Check if label exists
    if (!existingLabel) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    // Check if the label belongs to the current user
    if (existingLabel.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized to modify this label' }, { status: 403 });
    }

    const data = await request.json();

    // Update the label in the database
    const label = await prisma.workoutLabel.update({
      where: { id: params.id },
      data: {
        name: data.name,
        color: data.color,
      },
    });

    return NextResponse.json(label);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update label' }, { status: 500 });
  }
}
