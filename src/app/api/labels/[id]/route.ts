import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// DELETE a label
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the label to check ownership
    const existingLabel = await prisma.workoutLabel.findUnique({
      where: { id: params.id },
    });
    
    if (!existingLabel) {
      return NextResponse.json(
        { error: 'Label not found' },
        { status: 404 }
      );
    }
    
    // Check if the label belongs to the current user
    if (existingLabel.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this label' },
        { status: 403 }
      );
    }
    
    await prisma.workoutLabel.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete label' },
      { status: 500 }
    );
  }
}

// Update a label
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the label to check ownership
    const existingLabel = await prisma.workoutLabel.findUnique({
      where: { id: params.id },
    });
    
    if (!existingLabel) {
      return NextResponse.json(
        { error: 'Label not found' },
        { status: 404 }
      );
    }
    
    // Check if the label belongs to the current user
    if (existingLabel.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to modify this label' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    const label = await prisma.workoutLabel.update({
      where: { id: params.id },
      data: {
        name: data.name,
        color: data.color
      },
    });
    
    return NextResponse.json(label);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update label' },
      { status: 500 }
    );
  }
}