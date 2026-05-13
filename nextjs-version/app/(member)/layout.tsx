import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <ProtectedRoute>{children}</ProtectedRoute>
    </AppShell>
  );
}
