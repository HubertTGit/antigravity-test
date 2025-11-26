# Copilot Instructions for AntiGravity Test

## Architecture Overview

This is a Next.js 16 (App Router) collaborative shopping list PWA with Clerk authentication and Supabase PostgreSQL database. Uses Turbopack in development for faster builds.

**Key data flow**: Clerk auth → middleware → user service generates 6-digit `userTodoId` → todos scoped by `userTodoId` → optimistic UI updates in client components → server actions revalidate paths.

**Sharing model**: Each user gets a unique 6-digit `userTodoId` code. Users can share this code to allow others to view/edit the same shopping list (shareable via `/todo/[todoId]` route). All todos are scoped to this code, not the Clerk user ID.

## Database Architecture

- **Database**: Supabase PostgreSQL with `@supabase/supabase-js` client
- **Schema management**: Via Supabase dashboard or SQL migrations
- **Unique pattern**: Users have both `userId` (Clerk ID, primary key) and `userTodoId` (6-digit shareable code, unique)
- **Foreign keys**: `todos.user_todo_id` references `users.user_todo_id` with cascade delete
- **Connection**: Supabase client via `src/lib/db.ts` using service role key for server-side operations

### Database Schema

**users table:**

- `user_id` (text, primary key) - Clerk user ID
- `user_todo_id` (text, unique, not null) - 6-digit shareable code
- `name` (text, nullable)
- `created_at` (timestamp with time zone)

**todos table:**

- `id` (uuid, primary key, default: gen_random_uuid())
- `text` (text, not null)
- `completed` (boolean, default: false)
- `user_todo_id` (text, foreign key to users.user_todo_id, cascade delete)
- `created_at` (timestamp with time zone)

## Authentication Flow

1. Middleware (`src/middleware.ts`) uses Clerk with public routes: `/`, `/todo/*`, `/sign-in/*`, `/sign-up/*`
2. User service (`src/lib/user-service.ts`) handles `getOrCreateUser()` which generates unique 6-digit `userTodoId` with retry logic (max 5 attempts)
3. All todo operations use `userTodoId` for scoping, not `userId`
4. **Route validation**: Dynamic routes like `/todo/[todoId]` validate the `todoId` by querying Supabase for matching user, redirect to `/?error=invalid_todo_id` if not found (see `src/app/todo/[todoId]/page.tsx`)

## Server Actions Pattern

All data mutations live in `src/app/actions.ts` marked with `"use server"`. Every mutation:

1. Performs Supabase database operation
2. Handles errors explicitly (check `error` from Supabase response)
3. Calls `revalidatePath()` to update Next.js cache
4. Returns no data (relies on revalidation for UI updates)

Example pattern:

```typescript
export async function addTodo(todoId: string, text: string) {
  const { error } = await supabase
    .from("todos")
    .insert({ text, user_todo_id: todoId });

  if (error) throw error;
  revalidatePath(`/todo/${todoId}`); // Always revalidate after mutation
}
```

**Note**: Use snake_case for column names in Supabase queries (e.g., `user_todo_id`, not `userTodoId`).

## Client Component Patterns

See `src/components/todo-list.tsx` for canonical examples:

- **"use client" directive**: Required for components using hooks (`useState`, `useEffect`, `useTransition`), event handlers, or browser APIs
- **Optimistic updates**: Update local state immediately, then call server action in `startTransition`
- **State management**: Use `useState` for UI state, `useTransition` for server action loading states
- **No manual refetching**: Rely on `revalidatePath()` from server actions to trigger re-renders
- **Data type adaptation**: Server components fetch data with snake_case DB columns, client components expect camelCase TypeScript types. Transform in `useEffect` when fetching:

```typescript
const adaptedTodos: Todo[] = fetchedTodos.map((t) => ({
  id: t.id.toString(),
  text: t.text,
  completed: t.completed,
  createdAt: t.created_at.getTime(), // DB: created_at → TS: createdAt
}));
```

- **Toast notifications**: Use `toast` from `sonner` for user feedback (success/error messages)

## UI Components

- **shadcn/ui components**: Located in `src/components/ui/`, installed via `npx shadcn@latest add <component>`
- **Config**: `components.json` defines "new-york" style, `@/` path aliases
- **Styling**: Tailwind CSS with CSS variables for theming (`globals.css`)
- **Theme**: Handled by `next-themes` via `ThemeProvider` in root layout

## Testing

- **Framework**: Jest + React Testing Library
- **Config**: `jest.config.ts` uses `next/jest` for automatic Next.js config loading
- **Setup**: `jest.setup.ts` imports `@testing-library/jest-dom` for matchers
- **Run**: `pnpm test`
- **Examples**: See `src/components/ui/button.test.tsx` and `src/components/todo-list.test.tsx`

## PWA Configuration

- **Package**: `@ducanh2912/next-pwa` configured in `next.config.ts`
- **Behavior**: PWA disabled in development, enabled in production
- **Output**: Service worker and manifest generated to `public/`

## Development Workflow

```bash
pnpm dev           # Start dev server on localhost:3000
pnpm build         # Production build
pnpm start         # Start production server
pnpm lint          # ESLint check
pnpm test          # Run Jest tests
```

## Environment Variables

Required in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for server-side operations)
- Clerk variables (auto-added by Clerk CLI or dashboard)

## Common Gotchas

1. **Column naming**: Use snake_case for Supabase column names in queries (`user_todo_id`), not camelCase
2. **Error handling**: Always check for `error` in Supabase responses and handle explicitly
3. **Single vs multiple**: Use `.single()` for single row results, otherwise get array
4. **Clerk middleware**: Route matchers must use `createRouteMatcher()` pattern, not string arrays
5. **Path aliases**: Use `@/` prefix consistently (configured in `tsconfig.json` and `components.json`)
6. **Optimistic UI**: Always provide optimistic update before server action, then let revalidation sync real data

## Key Files Reference

- `src/app/actions.ts` - All server actions (data mutations)
- `src/lib/user-service.ts` - User creation with unique ID generation
- `src/lib/db.ts` - Supabase client configuration
- `src/middleware.ts` - Clerk auth routing
- `src/components/todo-list.tsx` - Canonical client component with optimistic updates
- `src/app/todo/[todoId]/page.tsx` - Dynamic route with server-side validation example
