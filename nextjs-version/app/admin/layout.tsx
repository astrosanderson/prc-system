import { AppShell }      from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <ProtectedRoute role="admin">{children}</ProtectedRoute>
    </AppShell>
  );
}
