import { DefaultSession } from "next-auth"

/**
 * NextAuth type extensions
 * 
 * This module augments the NextAuth session type to include
 * additional properties needed by our application.
 */
declare module "next-auth" {
  /**
   * Extended Session Interface
   * 
   * Adds user ID to the standard NextAuth session user object
   * The user ID is needed for database operations and authentication checks
   */
  interface Session {
    user?: {
      id: string  // Add user ID to session user object
    } & DefaultSession["user"]
  }
}