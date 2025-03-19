import TrainingCalendar from '@/components/calendar/TrainingCalendar';
import WeeklySummary from '@/components/calendar/WeeklySummary';
import Navbar from '@/components/layout/Navbar';
import LabelManager from '@/components/labels/LabelManager';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <TrainingCalendar />
          </div>
          <div className="md:col-span-1">
            <div className="space-y-6">
              <WeeklySummary />
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
          <p className="text-center text-sm text-[#A0A0A0]">
            Built with Next.js and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}