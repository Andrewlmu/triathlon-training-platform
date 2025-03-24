import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * POST Handler - Register a new user
 *
 * Creates a new user account with the provided email, password, and optional name.
 * Handles password hashing, database transactions, and error handling.
 * Prevents duplicate email registrations.
 *
 * Expected request body:
 * {
 *   email: "user@example.com",  // Required user email
 *   password: "securepass123",  // Required password
 *   name: "John Doe"            // Optional user name
 * }
 *
 * @route POST /api/auth/signup
 * @returns {Promise<NextResponse>} JSON response with user data or error
 */
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Hash password with bcrypt for secure storage
    // Salt factor of 10 provides a good balance of security and performance
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Use transaction to ensure both user and credentials are created together
      // This maintains data integrity - either both succeed or both fail
      const result = await prisma.$transaction(async (tx) => {
        // Create the user record first
        const user = await tx.user.create({
          data: {
            name,
            email,
          },
        });

        // Create user credentials with password
        // Linked to user by userId foreign key
        const credentials = await tx.userCredential.create({
          data: {
            userId: user.id,
            password: hashedPassword,
          },
        });

        return { user };
      });

      // Return user data without sensitive fields
      return NextResponse.json(
        {
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      // Type guard for Prisma errors to provide better error logging
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Transaction Prisma error:', {
          message: error.message,
          code: error.code,
          meta: error.meta,
        });
      } else {
        console.error('Transaction unknown error:', error);
      }
      throw error; // Re-throw to be caught by outer try/catch
    }
  } catch (error: unknown) {
    // Handle any error type safely with detailed logging
    let errorMessage = 'An error occurred while creating your account';

    // Type guard for Error objects
    if (error instanceof Error) {
      console.error('Error creating user:', {
        message: error.message,
        stack: error.stack,
      });
      errorMessage = error.message;
    } else {
      console.error('Unknown error type:', error);
    }

    // Type guard for Prisma errors to provide better debugging info
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error details:', {
        code: error.code,
        meta: error.meta,
      });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
