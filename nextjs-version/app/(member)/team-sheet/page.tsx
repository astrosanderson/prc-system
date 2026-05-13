'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';
import type { Player } from '@/lib/types';

/**
 * Printable team sheet.
 * URL params:
 *   ?academyId=...        (defaults to current member's academy)
 *   &opponent=Team+B
 *   &date=2026-05-15
 */
export default function TeamSheetPage() {
  const { session } = useSession();
  const { data }    = useAppData();
  const params      = useSearchParams();

  const academyId   = params.get('academyId') ?? session?.academyId ?? '';
  const opponent    = params.get('opponent')  ?? '';
  const matchDate   = params.get('date')      ?? new Date().toISOString().split('T')[0];

  const academy   = data.academies.find((a) => a.id === academyId);
  const players   = useMemo(
    () => data.players
      .filter((p) => p.academyId === academyId && p.status === 'Active')
      .sort((a, b) => (a.jerseyNumber ?? 99) - (b.jerseyNumber ?? 99)),
    [data.players, academyId],
  );

  /* Auto-open the print dialog on first paint */
  useEffect(() => {
    if (typeof window !== 'undefined' && players.length > 0) {
      const t = setTimeout(() => window.print(), 250);
      return () => clearTimeout(t);
    }
  }, [players.length]);

  function totals(p: Player) {
    const s = p.seasons?.[0];
    return { goals: s?.goals ?? 0, assists: s?.assists ?? 0 };
  }

  return (
    <main className="team-sheet-page">
      <header className="team-sheet-header">
        <div>
          <div className="team-sheet-eyebrow">Match Team Sheet · Zambezi Futures</div>
          <h1 className="team-sheet-title">{academy?.name ?? 'Unknown academy'}</h1>
          <div className="team-sheet-meta">
            <div><strong>Match date:</strong> {matchDate}</div>
            <div><strong>Opponent:</strong> {opponent || '—'}</div>
            <div><strong>Representative:</strong> {academy?.rep ?? '—'}</div>
          </div>
        </div>
        <button
          className="btn-gold px-4 py-2 fw-900 text-uppercase fs-8 no-print"
          onClick={() => window.print()}
          style={{ height: 'fit-content' }}
        >
          Print
        </button>
      </header>

      <table className="team-sheet-table">
        <thead>
          <tr>
            <th style={{ width: 50 }}>#</th>
            <th>Player Name</th>
            <th>Position</th>
            <th>Grade</th>
            <th>Division</th>
            <th>Goals</th>
            <th>Assists</th>
          </tr>
        </thead>
        <tbody>
          {players.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '1.5rem', fontStyle: 'italic' }}>
                No active players in this academy.
              </td>
            </tr>
          ) : (
            players.map((p) => {
              const t = totals(p);
              return (
                <tr key={p.id}>
                  <td>{p.jerseyNumber ?? '—'}</td>
                  <td>{p.firstName} {p.lastName}</td>
                  <td>{p.position}</td>
                  <td>{p.grade}</td>
                  <td>{p.division}</td>
                  <td>{t.goals}</td>
                  <td>{t.assists}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <footer className="team-sheet-footer">
        <div>Coach / Manager signature: ____________________________</div>
        <div>Date: ____________________________</div>
      </footer>
    </main>
  );
}
