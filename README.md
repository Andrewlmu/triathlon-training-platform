# Triathlon Training Platform

A comprehensive web application for planning your triathlon training journey. Plan, track, and analyze your swimming, cycling, and running workouts in one place.

## Features

- **Monthly Calendar View**: Visualize your training schedule with intuitive swim/bike/run indicators
- **Workout Management**: Create, edit, and delete workouts with detailed information
- **Training Labels**: Categorize workouts by intensity (Recovery, Zone 2, Threshold, VO2 Max, etc.)
- **Weekly Statistics**: Track your training volume with automatic calculations of time by sport
- **User Authentication**: Secure login and registration with protected routes
- **Dark Mode**: Eye-friendly dark interface designed for athletes

## Tech Stack

- **Frontend**: Next.js 15+, React, TypeScript
- **State Management**: React Context API, React Hooks
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: Custom components, Lucide React icons
- **Authentication**: NextAuth.js with credentials provider
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Date Handling**: date-fns

## Usage

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.