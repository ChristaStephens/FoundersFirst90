# Founder's First 90

## Overview

Founder's First 90 is a daily habit tracker web application designed to guide new entrepreneurs through their first 90 days of building a business. The app presents one specific action item each day with progress tracking, streak mechanics, and curated resources to help aspiring founders overcome analysis paralysis and take concrete steps toward launching their startup.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using functional components and hooks
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: React's built-in useState and useEffect hooks with custom hooks for complex state logic
- **Data Persistence**: Browser localStorage for user progress tracking (no backend authentication required)
- **Mobile-First Design**: Responsive layout optimized for mobile devices with bottom navigation

### Component Architecture
- **Design System**: shadcn/ui components with Radix UI primitives for accessibility
- **Custom Components**: 
  - `DailyMission` - Displays current day's task with steps and resources
  - `ProgressDashboard` - Shows completion statistics and streak tracking
  - `BottomNavigation` - Mobile-friendly tab navigation
- **Utility Components**: Reusable UI primitives for cards, buttons, progress bars, and forms

### Data Architecture
- **Mission Data**: Static JSON file containing 90 daily missions with structured format
- **User Progress**: Stored in localStorage with progress tracking, streak counting, and achievement unlocking
- **Achievement System**: Milestone-based rewards for completion streaks and total progress

### State Management Strategy
- **Custom Hooks**: 
  - `useProgress` - Manages user completion state and streak calculations
  - `useLocalStorage` - Handles browser storage persistence
  - `useMobile` - Responsive design utilities
- **Data Flow**: Unidirectional data flow with hooks managing state updates and side effects

### Development Tools
- **Type Safety**: Full TypeScript implementation with strict mode enabled
- **Code Quality**: ESLint and Prettier configuration (implied by project structure)
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

## External Dependencies

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Headless component primitives for accessibility and keyboard navigation
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe variant styling for component APIs

### React Ecosystem
- **React Hook Form**: Form state management and validation
- **TanStack Query**: Server state management and caching (prepared for future API integration)
- **Wouter**: Lightweight routing solution
- **React DOM**: Core React rendering library

### Development and Build
- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Static type checking and enhanced developer experience
- **PostCSS**: CSS processing with Autoprefixer
- **esbuild**: Fast JavaScript bundler for production builds

### Backend Preparation (Currently Unused)
- **Express.js**: Server framework ready for future API endpoints
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database service integration
- **Session Management**: PostgreSQL session store setup for future user authentication

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx/tailwind-merge**: Conditional CSS class utilities
- **nanoid**: Unique ID generation
- **zod**: Runtime type validation and schema definition