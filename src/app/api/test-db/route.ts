import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Just a simple query to test connection
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "Connected to database successfully!" });
  } catch (error: unknown) {
    console.error("Database connection error:", error);
    
    let errorMessage = "Failed to connect to database";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: "Failed to connect to database", details: errorMessage },
      { status: 500 }
    );
  }
}