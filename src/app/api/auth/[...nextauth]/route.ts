import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth API Route
 * 
 * Handles all authentication-related API requests using NextAuth.js.
 * This dynamic route handles various authentication endpoints including:
 * - Sign in (/api/auth/signin)
 * - Sign out (/api/auth/signout)
 * - Session management (/api/auth/session)
 * - JWT callbacks (/api/auth/callback)
 * 
 * Configuration is imported from the centralized authOptions in @/lib/auth.ts
 * 
 * Implementation follows NextAuth.js best practices for App Router.
 * The handler is exported as both GET and POST methods to handle all auth requests.
 */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };