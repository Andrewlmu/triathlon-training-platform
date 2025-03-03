import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all workouts
export async function GET() {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: { date: 'desc' },
    });
    
    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

// POST a new workout
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("API received data:", data);

    // Validate required fields
    if (!data.type || !data.title || !data.date || data.duration === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create workout with temp userId (will be updated when auth is added)
    const workout = await prisma.workout.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description || "",
        duration: data.duration,
        date: new Date(data.date)
        //userId: "temp-user-id"
      },
    });
    
    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
}