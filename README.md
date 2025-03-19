# Triathlon Training Platform

![Dashboard Preview](./screenshots/dashboard.png)

A comprehensive web application for planning and tracking your triathlon training journey. This platform bridges the gap between individual workout planning and long-term training cycles, providing triathletes with an intuitive calendar interface to organize swim, bike, and run workouts effectively. Unlike simple workout logs or overwhelming periodization software, this platform offers the perfect middle ground—allowing athletes to plan weekly training blocks, visualize training load across disciplines with color-coded intensity labels, and make adjustments with easy drag-and-drop functionality. With features like weekly statistics and workout categorization, triathletes can maintain structure in their training while having the flexibility to adapt plans as needed.

## 🚀 Live Demo

Visit the live application: [Triathlon Training Platform](https://triathlon-training-platform.vercel.app/)

Demo credentials:
- Email: demo@example.com
- Password: demo1234

## ✨ Features

![Calendar View](./screenshots/calendar-view.png)

- **Monthly Calendar View**: Visualize your training schedule with intuitive swim/bike/run indicators
- **Workout Management**: Create, edit, and delete workouts with detailed information
- **Training Labels**: Categorize workouts by intensity (Recovery, Zone 2, Threshold, VO2 Max, etc.)
- **Weekly Statistics**: Track your training volume with automatic calculations of time by sport
- **User Authentication**: Secure login and registration with protected routes
- **Drag & Drop Interface**: Easily move workouts between days or reorder them
- **Copy Week Feature**: Duplicate entire training weeks for repeating training blocks
- **Dark Mode**: Eye-friendly dark interface designed for athletes

## 🔧 Tech Stack

- **Frontend**: Next.js 15+, React 19, TypeScript
- **State Management**: React Context API, React Hooks
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: Custom components, Lucide React icons
- **Drag & Drop**: @dnd-kit core and sortable libraries
- **Authentication**: NextAuth.js with credentials provider
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Date Handling**: date-fns
- **Testing**: Jest and React Testing Library

## 📸 Screenshots

### Weekly Training Statistics
![Weekly Stats](./screenshots/weekly-stats.png)

### Workout Builder
![Workout Builder](./screenshots/workout-builder.png)

### Label Management
![Label Management](./screenshots/label-management.png)

### Copy Week Feature
![Copy Week](./screenshots/copy-week.png)

## 🛠️ Installation and Setup

### Prerequisites
- Node.js 18+ (LTS version recommended)
- PostgreSQL database (local or hosted)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/triathlon-training-platform.git
   cd triathlon-training-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@host:port/database"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Setup database**
   ```bash
   npx prisma migrate dev
   # or
   yarn prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Creating an Account
Register with your email and password to get started.

### Adding Workouts
1. Navigate to the calendar view
2. Click on a day to add a workout
3. Select workout type (Swim, Bike, Run)
4. Add title, duration, and optional description
5. Select a training label for intensity tracking
6. Save your workout

### Managing Labels
1. Click on "Manage Labels" in the sidebar
2. Add custom labels with specific colors
3. Use the "Reset to Default Labels" button to restore standard training zones

### Viewing Statistics
The weekly summary automatically calculates:
- Total training hours by sport
- Distribution percentages
- Training load metrics

### Copy Week Feature
1. Click "Copy Week" button at the top of the calendar
2. Select a source week (the week you want to copy)
3. Select a target week (where you want to paste the workouts)
4. Click "Copy Week" to duplicate all workouts

## 🧪 Testing

Run tests with:
```bash
npm test
# or
yarn test
```

Run test coverage with:
```bash
npm run test:coverage
# or
yarn test:coverage
```

## 📝 Project Structure

```
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── api/            # Backend API endpoints
│   │   ├── auth/           # Authentication pages
│   │   └── ...             # Other page routes
│   ├── components/         # React components
│   │   ├── auth/           # Authentication components
│   │   ├── calendar/       # Calendar and workout components
│   │   ├── labels/         # Label management components
│   │   └── layout/         # Layout components
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
└── jest/                   # Jest configuration and setup
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Lucide Icons](https://lucide.dev/)
- [date-fns](https://date-fns.org/)
- [dnd kit](https://dndkit.com/)