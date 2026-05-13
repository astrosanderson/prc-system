'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { Session } from '@/lib/types';

interface SessionContextValue {
  session: Session | null;
  isLoading: boolean;
  setSession: (s: Session | null) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const SESSION_KEY = 'zfSession';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Hydrate from localStorage on first mount (client-only) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setSessionState(JSON.parse(raw) as Session);
    } catch {
      /* ignore malformed data */
    }
    setIsLoading(false);
  }, []);

  const setSession = useCallback((s: Session | null) => {
    setSessionState(s);
    if (s) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      /* Legacy keys kept for backward-compat with existing HTML pages */
      localStorage.setItem('role', s.role);
      localStorage.setItem('academyName', s.academyName);
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('role');
      localStorage.removeItem('academyName');
    }
  }, []);

  const clearSession = useCallback(() => setSession(null), [setSession]);

  return (
    <SessionContext.Provider value={{ session, isLoading, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
