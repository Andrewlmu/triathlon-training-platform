import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WorkoutProvider } from '@/context/WorkoutContext';
import { LabelProvider } from '@/context/LabelContext';
import AuthProvider from '@/components/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Triathlon Training Platform',
  description: 'Plan and track your triathlon training',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LabelProvider>
            <WorkoutProvider>
              {children}
            </WorkoutProvider>
          </LabelProvider>
        </AuthProvider>
      </body>
    </html>
  );
}