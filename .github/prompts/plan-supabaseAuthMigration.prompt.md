# Plan: Migrate from Clerk to Supabase Auth

Migrate authentication from Clerk to Supabase Auth while preserving the dual-ID system (Supabase UUID as `user_id` + 6-digit `userTodoId` for list sharing). This involves replacing 4 files using Clerk APIs, removing 1 dependency, and updating middleware, providers, hooks, and UI components.

## Steps

1. **Install Supabase Auth dependencies and configure client** — Add `@supabase/ssr` to `package.json`, create auth utilities in `src/lib/supabase-auth.ts` for server/client instances, and update `src/lib/db.ts` to use public anon key instead of service role for client-side operations.

2. **Replace middleware authentication** — Rewrite `src/middleware.ts` to use Supabase session validation with `@supabase/ssr` instead of `clerkMiddleware`, maintaining same public route logic (`/`, `/todo/*`, `/sign-in`, `/sign-up`).

3. **Create Supabase Auth context provider and hooks** — Build `src/lib/auth-context.tsx` with `AuthProvider` component and custom hooks (`useUser`, `useAuth`) that mirror Clerk's API using Supabase `onAuthStateChange`, replace `ClerkProvider` in `src/app/layout.tsx`.

4. **Build custom auth UI components** — Create sign-in/sign-up forms in `src/components/auth-form.tsx` using Supabase `signInWithPassword`/`signUp`, create user menu component to replace `UserButton` in `src/components/navbar.tsx`, update `src/app/page.tsx` to use new sign-in component.

5. **Update user service and database integration** — Modify `getOrCreateUser` to accept Supabase UUID from `auth.user.id`, ensure `user_id` column in `users` table accepts UUID format, verify user creation flow in `src/app/page.tsx` works with new auth hooks.

6. **Remove Clerk dependencies and environment variables** — Uninstall `@clerk/nextjs` from `package.json`, remove all Clerk imports from 4 files (`middleware.ts`, `layout.tsx`, `page.tsx`, `navbar.tsx`), update `.env.local` to replace Clerk keys with `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Further Considerations

1. **Sign-in/sign-up UI approach** — Use Supabase Auth UI library (`@supabase/auth-ui-react` with pre-built forms) vs. custom forms (full control, matches existing design)? Recommend custom forms to maintain "new-york" shadcn/ui style consistency.

2. **User profile storage** — Store `name` in Supabase Auth user metadata vs. keep in `users` table? Current `users.name` column works but duplicates data. Recommend keeping table approach for consistency with existing pattern.

3. **Email verification requirement** — Enable email verification in Supabase Auth settings? This adds security but requires email confirmation flow. Recommend enabling for production but allowing unverified users in development.

4. **Session management strategy** — Use server-side sessions (cookies with `@supabase/ssr`) vs. client-side only? Current Clerk uses server sessions. Recommend server-side sessions for security and SSR compatibility.
