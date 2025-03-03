import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET a single workout
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: params.id },
    });
    
    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(workout);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    );
  }
}

// PATCH to update a workout
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // Handle date conversion if it exists
    if (data.date) {
      data.date = new Date(data.date);
    }
    
    const workout = await prisma.workout.update({
      where: { id: params.id },
      data,
    });
    
    return NextResponse.json(workout);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update workout' },
      { status: 500 }
    );
  }
}

// DELETE a workout
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.workout.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
}