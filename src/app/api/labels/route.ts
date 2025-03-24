import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET Handler - Fetch all labels for the current user
 * 
 * Retrieves all workout labels created by the authenticated user.
 * Labels are sorted alphabetically by name.
 * Authentication is required.
 * 
 * @route GET /api/labels
 * @returns {Promise<NextResponse>} JSON response with labels array or error
 */
export async function GET() {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Fetch all labels for the authenticated user
    const labels = await prisma.workoutLabel.findMany({
      where: { userId: session.user.id },
      orderBy: { name: 'asc' },
    });
    
    return NextResponse.json(labels);
  } catch (error) {
    console.error('Error fetching labels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch labels' },
      { status: 500 }
    );
  }
}

/**
 * POST Handler - Create a new workout label
 * 
 * Creates a new workout label for the authenticated user.
 * Requires a name and color for the label.
 * Authentication is required.
 * 
 * Expected request body:
 * {
 *   name: "Zone 2",  // Label name
 *   color: "#3B82F6" // Hex color code
 * }
 * 
 * @route POST /api/labels
 * @returns {Promise<NextResponse>} JSON response with created label or error
 */
export async function POST(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new workout label
    const label = await prisma.workoutLabel.create({
      data: {
        name: data.name,
        color: data.color,
        userId: session.user.id
      },
    });
    
    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    console.error('Error creating label:', error);
    return NextResponse.json(
      { error: 'Failed to create label' },
      { status: 500 }
    );
  }
}