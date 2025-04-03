'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User, LogIn } from 'lucide-react';

/**
 * WelcomeBanner Component
 *
 * Displays an informative welcome message for unauthenticated users,
 * encouraging them to sign in or create an account to use the platform.
 * Only appears for users who are not logged in.
 *
 * @returns A welcome banner component or null if user is authenticated
 */
const WelcomeBanner = () => {
  const { data: session, status } = useSession();
  
  // Don't show banner if user is authenticated or status is still loading
  if (session || status === 'loading') {
    return null;
  }

  return (
    <div className="bg-[#212121] border border-[#333333] rounded-lg shadow-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-2">Welcome to Triathlon Training Platform</h2>
          <p className="text-[#A0A0A0] mb-3">
            Plan, organize, and track your swim, bike, and run workouts with our intuitive training calendar.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <div className="bg-[#FFD700] p-1 rounded-full mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm text-white">Create and organize workouts with drag-and-drop functionality</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-[#FFD700] p-1 rounded-full mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm text-white">Track training volume with automatic weekly statistics</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-[#FFD700] p-1 rounded-full mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm text-white">Categorize workouts by intensity and type</p>
            </div>
          </div>
        </div>
        
        <div className="md:w-64 flex flex-col gap-3">
          <Link
            href="/auth/signin"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-[#121212] bg-[#FFD700] hover:bg-[#F0C800] rounded-md transition"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white bg-[#333333] hover:bg-[#444444] rounded-md transition"
          >
            <User className="h-4 w-4" />
            Create Account
          </Link>
          <p className="text-xs text-center text-[#A0A0A0] mt-1">
            Sign in or create an account to start planning your training
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;