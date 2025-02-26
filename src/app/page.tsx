import TrainingCalendar from '@/components/calendar/TrainingCalendar';
import WeeklySummary from '@/components/calendar/WeeklySummary';
import { Calendar } from 'lucide-react';

/**
 * Home Page Component
 * 
 * The main entry point for the triathlon training platform.
 * Displays the calendar and weekly summary components.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header Section */}
      <header className="bg-[#1E1E1E] border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-[#FFD700]" />
            <h1 className="text-2xl font-bold">Triathlon Training Platform</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Main Calendar (3/4 width on desktop) */}
          <div className="md:col-span-3">
            <TrainingCalendar />
          </div>

          {/* Weekly Summary (1/4 width on desktop) */}
          <div className="md:col-span-1">
            <WeeklySummary />
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="border-t border-[#333333] bg-[#1E1E1E] mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-[#A0A0A0]">
            Built with Next.js and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}