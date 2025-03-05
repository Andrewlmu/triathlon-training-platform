import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET all workouts (user specific)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const workouts = await prisma.workout.findMany({
      where: { userId: session.user.id },
      include: { label: true },
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
// POST a new workout
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.type || !data.title || !data.date || data.duration === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create the base workout data
    const baseWorkoutData = {
      type: data.type,
      title: data.title,
      description: data.description || "",
      duration: data.duration,
      date: new Date(data.date),
      user: {
        connect: {
          id: session.user.id
        }
      }
    };
    
    // Create the workout with or without label
    let workout;
    
    if (data.labelId) {
      // If there's a label, create with label connection
      workout = await prisma.workout.create({
        data: {
          ...baseWorkoutData,
          label: {
            connect: {
              id: data.labelId
            }
          }
        },
        include: { label: true }
      });
    } else {
      // If no label, create without label connection
      workout = await prisma.workout.create({
        data: baseWorkoutData,
        include: { label: true }
      });
    }
    
    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
}