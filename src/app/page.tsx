import TrainingCalendar from '@/components/calendar/TrainingCalendar';
import WeeklySummary from '@/components/calendar/weekly-summary';
import Navbar from '@/components/layout/Navbar';
import LabelManager from '@/components/labels/LabelManager';

/**
 * Home Page Component
 *
 * Main landing page of the application featuring:
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
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navigation header */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
