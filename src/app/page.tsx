import TrainingCalendar from '@/components/calendar/TrainingCalendar';
import WeeklySummary from '@/components/calendar/WeeklySummary';
import Navbar from '@/components/layout/Navbar';

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
            <WeeklySummary />
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