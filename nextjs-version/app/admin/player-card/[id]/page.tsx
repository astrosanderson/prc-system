'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';

/**
 * Admin-only printable PRC Player Card.
 * Member sessions and unauthenticated requests are redirected away.
 */
export default function PlayerCardPage() {
  const params = useParams<{ id: string }>();
  const { session, isLoading } = useSession();
  const { data } = useAppData();
  const router = useRouter();

  /* Hard role gate — admin only */
  useEffect(() => {
    if (isLoading) return;
    if (!session)                       { router.replace('/login'); return; }
    if (session.role !== 'admin')       { router.replace('/dashboard'); return; }
  }, [session, isLoading, router]);

  const player = data.players.find((p) => p.id === params.id);
  if (isLoading || !session) return null;
  if (session.role !== 'admin') {
    return (
      <main className="container py-5 text-center">
        <h2 className="fw-900 text-dark-green">Access denied</h2>
        <p className="text-warm-muted">Player Card printing is restricted to PRC administrators.</p>
      </main>
    );
  }
  if (!player) {
    return (
      <main className="container py-5 text-center">
        <h2 className="fw-900 text-dark-green">Player not found</h2>
      </main>
    );
  }

  /* Auto-launch print dialog */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = setTimeout(() => window.print(), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="player-card-print">
      <div className="player-card">
        <div className="player-card-header">
          <div className="player-card-brand">ZAMBEZI FUTURES</div>
          <div className="player-card-eyebrow">PRC Official Player Card</div>
        </div>
        <div className="player-card-body">
          {player.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={player.photo} alt={`${player.firstName} ${player.lastName}`} className="player-card-photo" />
          ) : (
            <div className="player-card-photo player-card-photo--empty">
              <span className="material-symbols-outlined" style={{ fontSize: '3rem' }}>person</span>
            </div>
          )}
          <div className="player-card-info">
            <div className="player-card-name">{player.firstName} {player.lastName}</div>
            <div className="player-card-prc">{player.prcId}</div>
            <dl className="player-card-meta">
              <dt>Academy</dt><dd>{player.academy}</dd>
              <dt>Division</dt><dd>{player.division}</dd>
              <dt>Position</dt><dd>{player.position}</dd>
              <dt>Grade</dt><dd>{player.grade}</dd>
              <dt>DOB</dt><dd>{player.dob}</dd>
              <dt>Gender</dt><dd>{player.gender}</dd>
            </dl>
          </div>
        </div>
        <div className="player-card-footer">
          Issued by PRC · {new Date().toISOString().split('T')[0]}
        </div>
      </div>

      <button className="btn-gold mt-4 px-4 py-2 fw-900 text-uppercase fs-8 no-print" onClick={() => window.print()}>
        Print Player Card
      </button>
    </main>
  );
}
