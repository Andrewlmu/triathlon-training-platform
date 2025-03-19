import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    console.log("Starting signup process");
    const { name, email, password } = await req.json();
    
    // Validate input
    if (!email || !password) {
      console.log("Validation failed: Missing email or password");
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }
    
    console.log("Checking for existing user");
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log("User already exists with email:", email);
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }
    
    console.log("Hashing password");
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log("Starting database transaction");
    try {
      // Create user and credentials in a transaction
      const result = await prisma.$transaction(async (tx) => {
        console.log("Creating user");
        // Create the user
        const user = await tx.user.create({
          data: {
            name,
            email
          }
        });
        
        console.log("User created, now creating credentials");
        // Create user credentials
        const credentials = await tx.userCredential.create({
          data: {
            userId: user.id,
            password: hashedPassword
          }
        });
        
        return { user };
      });
      
      console.log("Transaction completed successfully");
      return NextResponse.json({ 
        user: { 
          id: result.user.id, 
          name: result.user.name, 
          email: result.user.email 
        } 
      }, { status: 201 });
    } catch (error) {
      // Type guard for Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Transaction Prisma error:", {
          message: error.message,
          code: error.code,
          meta: error.meta
        });
      } else {
        console.error("Transaction unknown error:", error);
      }
      throw error; // Re-throw to be caught by outer try/catch
    }
  } catch (error: unknown) {
    // Handle any error type safely
    let errorMessage = "An error occurred while creating your account";
    
    // Type guard for Error objects
    if (error instanceof Error) {
      console.error("Error creating user:", {
        message: error.message,
        stack: error.stack
      });
      errorMessage = error.message;
    } else {
      console.error("Unknown error type:", error);
    }
    
    // Type guard for Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error details:", {
        code: error.code,
        meta: error.meta
      });
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}