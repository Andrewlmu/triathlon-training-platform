import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WorkoutProvider } from '@/context/WorkoutContext';
import { LabelProvider } from '@/context/LabelContext';
import AuthProvider from '@/components/providers/AuthProvider';

// Load Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] });

/**
 * Metadata configuration for the application
 * Used by Next.js for generating HTML metadata tags
 */
export const metadata: Metadata = {
  title: 'Triathlon Training Platform',
  description: 'Plan and track your triathlon training',
};

/**
 * Root Layout Component
 * 
 * The main layout component that wraps the entire application.
 * Sets up global providers for authentication, labels, and workouts.
 * Applies font styling and provides the basic HTML structure.
 * 
 * Provider hierarchy:
 * 1. AuthProvider - Provides authentication state and functions
 * 2. LabelProvider - Provides workout label management
 * 3. WorkoutProvider - Provides workout data and operations
 * 
 * @param children - Child components/pages to render within the layout
 * @returns The root layout component with all necessary providers
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Authentication provider for NextAuth */}
        <AuthProvider>
          {/* Label management provider */}
          <LabelProvider>
            {/* Workout data provider */}
            <WorkoutProvider>
              {children}
            </WorkoutProvider>
          </LabelProvider>
        </AuthProvider>
      </body>
    </html>
  );
}