# AntiGravity Test Project

A modern Next.js application demonstrating a clean, responsive UI with a robust Todo List feature.

## Features

- **Todo List**: Create, read, update, and delete tasks.
    - **Persistence**: Tasks are saved to `localStorage`.
    - **Filtering**: Filter by All, Active, or Completed.
- **Theme Support**: Toggle between Light and Dark modes with persistence.
- **Navigation**: Icon-only side navigation with tooltips for a clean look.
- **Modern UI**: Built with Tailwind CSS and Radix UI for accessibility and aesthetics.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Primitives**: [Radix UI](https://www.radix-ui.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (SideNav, TodoList, etc.).
- `src/components/ui`: Low-level UI primitives (Button, Tooltip, etc.).
- `src/types`: TypeScript type definitions.
