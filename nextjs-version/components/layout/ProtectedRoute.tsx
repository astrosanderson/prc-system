'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import type { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  /** If omitted, any authenticated role is accepted. */
  role?: Exclude<UserRole, 'public'>;
  children: React.ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    if (role && session.role !== role) {
      router.replace(session.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [session, isLoading, role, router]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div
          className="spinner-border text-secondary"
          role="status"
          style={{ width: '2rem', height: '2rem', borderWidth: '2px' }}
        >
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (!session) return null;
  if (role && session.role !== role) return null;

  return <>{children}</>;
}
