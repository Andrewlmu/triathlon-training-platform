import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

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
    if (!data.sourceWeekStart || !data.targetWeekStart) {
      return NextResponse.json(
        { error: 'Source and target weeks are required' },
        { status: 400 }
      );
    }
    
    const sourceWeekStart = new Date(data.sourceWeekStart);
    const targetWeekStart = new Date(data.targetWeekStart);
    const daysDifference = data.daysDifference || 0;
    
    // Get source week date range
    const sourceWeekEnd = endOfWeek(sourceWeekStart, { weekStartsOn: 1 });
    
    // Find all workouts in the source week
    const sourceWeekWorkouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: sourceWeekStart,
          lte: sourceWeekEnd,
        },
      },
      include: {
        label: true,
      },
    });
    
    if (sourceWeekWorkouts.length === 0) {
      return NextResponse.json(
        { error: 'No workouts found in the source week' },
        { status: 404 }
      );
    }
    
    // Group workouts by day of the week (0-6, where 0 is Monday in our case)
    const workoutsByDay: Record<number, any[]> = {};
    
    sourceWeekWorkouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      // Get day of week (0-6, where 0 is Monday since we use weekStartsOn: 1)
      const dayOfWeek = (workoutDate.getDay() + 6) % 7; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
      
      if (!workoutsByDay[dayOfWeek]) {
        workoutsByDay[dayOfWeek] = [];
      }
      
      workoutsByDay[dayOfWeek].push(workout);
    });
    
    // Create copies of workouts in the target week
    const createdWorkouts = [];
    
    for (const [dayOfWeekStr, dayWorkouts] of Object.entries(workoutsByDay)) {
      const dayOfWeek = parseInt(dayOfWeekStr);
      
      // Calculate the target date for this day of the week
      const targetDate = addDays(targetWeekStart, dayOfWeek);
      
      // Sort workouts by original order
      const sortedWorkouts = [...dayWorkouts].sort((a, b) => a.order - b.order);
      
      // Create copies of each workout on this day
      for (let i = 0; i < sortedWorkouts.length; i++) {
        const sourceWorkout = sortedWorkouts[i];
        
        const newWorkout = await prisma.workout.create({
          data: {
            type: sourceWorkout.type,
            title: sourceWorkout.title,
            description: sourceWorkout.description,
            duration: sourceWorkout.duration,
            date: targetDate,
            order: sourceWorkout.order,
            labelId: sourceWorkout.labelId,
            userId: session.user.id,
          },
          include: {
            label: true,
          },
        });
        
        createdWorkouts.push(newWorkout);
      }
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: `Copied ${createdWorkouts.length} workouts to the target week`,
        workouts: createdWorkouts 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error copying workouts:', error);
    return NextResponse.json(
      { error: 'Failed to copy workouts' },
      { status: 500 }
    );
  }
}