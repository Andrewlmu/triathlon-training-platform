"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * AuthProvider Component
 * 
 * Wraps the application with NextAuth's SessionProvider.
 * Makes authentication state and session data available throughout the app.
 * Enables useSession hook in child components.
 * 
 * This is a required provider for NextAuth to function properly
 * and should be placed at or near the root of the component tree.
 * 
 * @param children - Child components that will have access to authentication state
 * @returns Provider component wrapping children with authentication context
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}