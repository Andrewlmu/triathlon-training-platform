import { PrismaClient } from '@prisma/client';

/**
 * Create PrismaClient with custom configuration
 * 
 * @returns Configured PrismaClient instance
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Log all queries, errors, and warnings during development
    log: ['query', 'error', 'warn'],
    // Format errors in a human-readable way
    errorFormat: 'pretty',
  });
};

/**
 * Type for PrismaClient singleton
 */
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

/**
 * Global object to store PrismaClient instance
 * Prevents multiple instances during hot reloading in development
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

/**
 * Export singleton PrismaClient instance
 * Creates a new instance if none exists or reuses existing one
 */
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

/**
 * In development, save PrismaClient instance to global object to prevent hot reload issues
 * In production, this assignment is skipped
 */
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;