'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Calendar, LogOut, LogIn, User } from 'lucide-react';

/**
 * Navbar Component
 *
 * Main navigation header for the application.
 * Shows application branding and authentication controls.
 * Adapts UI based on authentication state.
 *
 * @returns A responsive navigation bar component
 */
export default function Navbar() {
  // Get authentication session data and status
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <header className="bg-[#1E1E1E] border-b border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and application title */}
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-[#FFD700]" />
            <h1 className="text-2xl font-bold text-white">Triathlon Training</h1>
          </div>

          {/* Authentication controls */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              // Loading state while session is being fetched
              <div className="text-[#A0A0A0]">Loading...</div>
            ) : session ? (
              // Authenticated user view with user info and sign out button
              <>
                <div className="text-white flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{session.user?.name || session.user?.email}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#252525] text-white rounded-md hover:bg-[#333333] transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              // Unauthenticated view with sign in link
              <Link
                href="/auth/signin"
                className="flex items-center gap-1 px-3 py-1.5 bg-[#FFD700] text-[#121212] rounded-md hover:bg-[#F0C800] transition"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
