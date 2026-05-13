/*
 * Root route (/) — home page served here since (public)/page.tsx
 * cannot coexist with app/page.tsx at the same URL.
 * AppShell is provided by app/(public)/layout.tsx when navigating
 * via the route group; when this file serves /, we wrap manually.
 */
import { AppShell } from '@/components/layout/AppShell';
import HomePage from './(public)/page';

export default function RootPage() {
  return (
    <AppShell>
      <HomePage />
    </AppShell>
  );
}
