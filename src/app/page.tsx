'use client';

import { useSession } from 'next-auth/react';
import TrainingCalendar from '@/components/calendar/TrainingCalendar';
import WeeklySummary from '@/components/calendar/weekly-summary';
import Navbar from '@/components/layout/Navbar';
import LabelManager from '@/components/labels/LabelManager';
import WelcomeBanner from '@/components/WelcomeBanner';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

/**
 * Home Page Component
 *
 * Main landing page of the application featuring:
 * - Welcome banner for unauthenticated users
 * - Training calendar with drag-and-drop workout management
 * - Weekly training statistics and metrics
 * - Workout label management
 *
 * Layout is responsive with a grid system that adapts to screen size.
 * Sidebar components move below the calendar on smaller screens.
 *
 * @returns The home page component with main training interface
 */
export default function Home() {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;
  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navigation header */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner - only shown for unauthenticated users */}
        <WelcomeBanner />

        {isLoading ? (
          <div className="bg-[#1E1E1E] rounded-lg shadow-xl p-8 text-center">
            <div className="w-12 h-12 border-t-2 border-[#FFD700] border-r-2 border-b-2 border-l-2 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#A0A0A0]">Loading your training data...</p>
          </div>
        ) : isAuthenticated ? (
          /* Authenticated User View */
          <div className="grid md:grid-cols-4 gap-6">
            {/* Calendar takes 3/4 of the space on medium+ screens */}
            <div className="md:col-span-3">
              <TrainingCalendar />
            </div>

            {/* Sidebar with stats and label management takes 1/4 of space */}
            <div className="md:col-span-1">
              <div className="space-y-6">
                {/* Weekly training statistics */}
                <WeeklySummary />

                {/* Workout label management */}
                <div className="bg-[#1E1E1E] rounded-lg shadow-xl border border-[#333333] p-4">
                  <h2 className="text-lg font-bold text-white mb-4">Workout Labels</h2>
                  <LabelManager />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Unauthenticated View - Preview with Sign-in CTA */
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <div className="bg-[#1E1E1E] rounded-lg shadow-xl border border-[#333333] p-6 relative">
                {/* Blurred Preview Background */}
                <div className="absolute inset-0 opacity-30 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-7 h-full">
                    {Array(35).fill(0).map((_, i) => (
                      <div key={i} className="border border-[#333333] p-2">
                        <div className="text-sm font-medium text-white opacity-50 mb-2">{(i % 7) + 1}</div>
                        {i % 3 === 0 && (
                          <div className="bg-[#252525] rounded-sm p-1 mb-1 opacity-50"></div>
                        )}
                        {i % 5 === 0 && (
                          <div className="bg-[#252525] rounded-sm p-1 opacity-50"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sign-In CTA */}
                <div className="bg-[#121212] bg-opacity-95 rounded-lg p-8 text-center z-10 relative border border-[#333333]">
                  <h2 className="text-2xl font-bold text-white mb-4">Plan Your Triathlon Training</h2>
                  <p className="text-[#A0A0A0] mb-6">Sign in to access your personalized training calendar and start planning your workouts.</p>
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-[#121212] bg-[#FFD700] hover:bg-[#F0C800] rounded-md transition mx-auto"
                  >
                    <LogIn className="h-5 w-5" />
                    Sign In to Access
                  </Link>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="space-y-6">
                {/* Weekly Stats Preview */}
                <div className="bg-[#1E1E1E] rounded-lg shadow-xl border border-[#333333] p-4 relative overflow-hidden">
                  <div className="blur-sm opacity-50">
                    <h2 className="text-lg font-bold text-white mb-4">Weekly Training</h2>
                    <div className="space-y-2">
                      <div className="h-4 bg-[#252525] rounded-full"></div>
                      <div className="h-4 bg-[#252525] rounded-full"></div>
                      <div className="h-4 bg-[#252525] rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-[#121212] bg-opacity-80">
                    <div className="text-center p-4">
                      <p className="text-white font-medium mb-2">Training Statistics</p>
                      <p className="text-[#A0A0A0] text-sm">Sign in to view your stats</p>
                    </div>
                  </div>
                </div>

                {/* Labels Preview */}
                <div className="bg-[#1E1E1E] rounded-lg shadow-xl border border-[#333333] p-4 relative overflow-hidden">
                  <div className="blur-sm opacity-50">
                    <h2 className="text-lg font-bold text-white mb-4">Workout Labels</h2>
                    <div className="space-y-2">
                      <div className="h-6 bg-[#252525] rounded"></div>
                      <div className="h-6 bg-[#252525] rounded"></div>
                      <div className="h-6 bg-[#252525] rounded"></div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-[#121212] bg-opacity-80">
                    <div className="text-center p-4">
                      <p className="text-white font-medium mb-2">Workout Labels</p>
                      <p className="text-[#A0A0A0] text-sm">Sign in to customize</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333333] bg-[#1E1E1E] mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-[#A0A0A0]">Built with Next.js and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}