# Shareable Shopping List

A collaborative shopping list PWA built with Next.js 16, enabling real-time shared shopping experiences through simple 6-digit codes.

## Features

- **Shareable Shopping Lists**: Create a shopping list and share it with anyone using a unique 6-digit code
- **Real-Time Collaboration**: All users viewing the same list see updates instantly as items are added, edited, or checked off
- **Easy Access**:
  - Sign in to initiate your own shopping list
  - Join existing lists by entering a 6-digit code (no sign-in required)
- **Full Shopping List Management**: Add, edit, delete, and check off items collaboratively
- **Progressive Web App**: Install on mobile devices for a native app-like experience
- **Theme Support**: Toggle between Light and Dark modes with persistence
- **Modern UI**: Built with Tailwind CSS and shadcn/ui for accessibility and aesthetics

## How It Works

1. **Create**: Sign in with Clerk to create your shopping list and receive a unique 6-digit code
1. **Share**: Share your 6-digit code with family, friends, or roommates
1. **Collaborate**: Anyone with the code can access the list at `/todo/[6-digit-code]` and make changes
1. **Sync**: All changes are synchronized in real-time across all users viewing the list

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA**: [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa)
- **Package Manager**: [pnpm](https://pnpm.io/)

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account and project
- Clerk account and application

### Installation

1. Install dependencies:

   ```bash
   pnpm install
   ```

1. Set up environment variables in `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

1. Run the development server:

   ```bash
   pnpm dev
   ```

1. Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `src/app`: Next.js App Router pages, layouts, and server actions
- `src/components`: Reusable UI components (TodoList, ShareButton, etc.)
- `src/components/ui`: shadcn/ui components (Button, Checkbox, etc.)
- `src/lib`: Utilities, database client, and user service
- `src/types`: TypeScript type definitions

## Database Schema

**users table:**

- `user_id` (text, primary key) - Clerk user ID
- `user_todo_id` (text, unique) - 6-digit shareable code
- `name` (text)
- `created_at` (timestamp)

**todos table:**

- `id` (uuid, primary key)
- `text` (text)
- `completed` (boolean)
- `user_todo_id` (text, foreign key) - Links to shared list
- `created_at` (timestamp)

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run Jest tests
