'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';
import type { Game, MatchEvent, MatchEventType, Player } from '@/lib/types';

const EVENT_LABELS: Record<MatchEventType, string> = {
  goal:         'Goal',
  assist:       'Assist',
  yellow_card:  'Yellow card',
  red_card:     'Red card',
  substitution: 'Substitution',
  kickoff:      'Kick-off',
  halftime:     'Half-time',
  fulltime:     'Full-time',
};

const EVENT_ICONS: Record<MatchEventType, string> = {
  goal:         'sports_soccer',
  assist:       'volunteer_activism',
  yellow_card:  'square',
  red_card:     'square',
  substitution: 'swap_horiz',
  kickoff:      'play_circle',
  halftime:     'pause_circle',
  fulltime:     'stop_circle',
};

export default function LiveMatchPage() {
  const { session } = useSession();
  const { data, addGame, addMatchEvent, removeMatchEvent, updateGame } = useAppData();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  /* New-match draft */
  const [draft, setDraft] = useState({ teamA: '', teamB: '', date: new Date().toISOString().split('T')[0] });

  /* Event entry */
  const [evt, setEvt] = useState<{
    type: MatchEventType; team: 'A' | 'B'; minute: number; playerId: string; secondaryPlayerId: string; note: string;
  }>({ type: 'goal', team: 'A', minute: 0, playerId: '', secondaryPlayerId: '', note: '' });

  if (!session || session.role !== 'admin') {
    return (
      <main className="container-xxl py-5 text-center">
        <h2 className="fw-900 text-dark-green">Access denied</h2>
        <p className="text-warm-muted">This area is restricted to PRC administrators.</p>
      </main>
    );
  }

  const liveGames = useMemo(
    () => data.games.filter((g) => g.phase === 'live' || g.phase === 'scheduled' || !g.phase),
    [data.games],
  );
  const activeGame: Game | null = data.games.find((g) => g.id === activeGameId) ?? null;

  const teamAPlayers: Player[] = activeGame
    ? data.players.filter((p) => p.academy === activeGame.teamA)
    : [];
  const teamBPlayers: Player[] = activeGame
    ? data.players.filter((p) => p.academy === activeGame.teamB)
    : [];

  const adminActor = { actorId: session.userId, actorName: session.displayName, actorRole: 'admin' as const };

  function startNewMatch() {
    if (!draft.teamA || !draft.teamB) return;
    const id = `g${Date.now()}`;
    const game: Game = {
      id,
      teamA: draft.teamA,
      teamB: draft.teamB,
      fixture: `${draft.teamA} vs ${draft.teamB}`,
      date: draft.date,
      scoreA: 0,
      scoreB: 0,
      score: '0-0',
      result: 'D',
      phase: 'live',
      events: [{
        id: `e${Date.now()}`,
        type: 'kickoff',
        team: 'A',
        minute: 0,
        timestamp: new Date().toISOString(),
      }],
    };
    addGame(game, adminActor);
    setActiveGameId(id);
    setDraft({ teamA: '', teamB: '', date: new Date().toISOString().split('T')[0] });
  }

  function logEvent() {
    if (!activeGame) return;
    const pool = evt.team === 'A' ? teamAPlayers : teamBPlayers;
    const primary = pool.find((p) => p.id === evt.playerId);
    const secondary = pool.find((p) => p.id === evt.secondaryPlayerId);
    const event: MatchEvent = {
      id:                  `e${Date.now()}${Math.random().toString(36).slice(2,5)}`,
      type:                evt.type,
      team:                evt.team,
      minute:              evt.minute,
      playerId:            primary?.id,
      playerName:          primary ? `${primary.firstName} ${primary.lastName}` : undefined,
      secondaryPlayerId:   secondary?.id,
      secondaryPlayerName: secondary ? `${secondary.firstName} ${secondary.lastName}` : undefined,
      note:                evt.note.trim() || undefined,
      timestamp:           new Date().toISOString(),
    };
    addMatchEvent(activeGame.id, event, adminActor);
    setEvt((p) => ({ ...p, minute: p.minute + 1, playerId: '', secondaryPlayerId: '', note: '' }));
  }

  function endMatch() {
    if (!activeGame) return;
    updateGame(activeGame.id, { phase: 'finished' }, adminActor);
    setActiveGameId(null);
  }

  return (
    <main className="container-xxl py-5">
      <div className="mb-4">
        <Link href="/admin/dashboard" className="text-mid-green fw-bold fs-8 text-uppercase text-decoration-none">
          <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>arrow_back</span>
          Dashboard
        </Link>
      </div>

      <header className="mb-4">
        <span className="fw-bold text-uppercase fs-8 d-block mb-1" style={{ color: 'var(--color-gold)', letterSpacing: '0.12em' }}>
          Match Centre
        </span>
        <h1 className="editorial-header display-4 fw-900 text-dark-green">
          Live Match <span className="text-warm-muted">Data</span>
        </h1>
        <p className="text-warm-muted fw-bold mb-0">
          Live score, goal scorers, cards, and substitutions. Events feed the player and academy statistics.
        </p>
      </header>

      {!activeGame ? (
        <>
          <section className="stat-tile mb-4" style={{ padding: '1.25rem 1.5rem' }}>
            <h5 className="fw-900 text-uppercase text-dark-green fs-7 mb-3">Start a new live match</h5>
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-bold fs-8">Team A *</label>
                <select className="form-select" value={draft.teamA}
                  onChange={(e) => setDraft((p) => ({ ...p, teamA: e.target.value }))}>
                  <option value="">Select…</option>
                  {data.academies.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold fs-8">Team B *</label>
                <select className="form-select" value={draft.teamB}
                  onChange={(e) => setDraft((p) => ({ ...p, teamB: e.target.value }))}>
                  <option value="">Select…</option>
                  {data.academies.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold fs-8">Date</label>
                <input type="date" className="form-control" value={draft.date}
                  onChange={(e) => setDraft((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="col-md-1 d-grid">
                <button className="btn-gold fw-900 text-uppercase fs-8 py-2"
                  onClick={startNewMatch}
                  disabled={!draft.teamA || !draft.teamB}>
                  Start
                </button>
              </div>
            </div>
          </section>

          <section className="stat-tile" style={{ padding: '1.25rem 1.5rem' }}>
            <h5 className="fw-900 text-uppercase text-dark-green fs-7 mb-3">Open matches</h5>
            {liveGames.length === 0 ? (
              <p className="text-warm-muted fs-8 mb-0">No matches scheduled. Start one above.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {liveGames.map((g) => (
                  <div key={g.id} className="d-flex align-items-center gap-3 stat-tile" style={{ padding: '0.7rem 0.9rem' }}>
                    <span className="fw-bold text-dark-green flex-grow-1">{g.fixture}</span>
                    <span className="fw-900 text-dark-green">{g.scoreA ?? 0}–{g.scoreB ?? 0}</span>
                    <span className="fs-9 text-warm-muted">{g.date}</span>
                    <button className="btn btn-sm fw-bold" style={{ background: 'var(--color-gold)', color: 'var(--color-dark-green)', borderRadius: 8 }}
                      onClick={() => setActiveGameId(g.id)}>
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          {/* Live scoreboard */}
          <section className="mb-4" style={{ background: 'var(--color-dark-green)', color: '#fff', borderRadius: 14, padding: '1.5rem 1.75rem' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="fw-bold text-uppercase fs-8" style={{ color: 'var(--color-gold)', letterSpacing: '0.12em' }}>
                LIVE · {activeGame.matchType ?? 'Match'} · {activeGame.date}
              </span>
              <button className="btn btn-sm btn-outline-light fw-bold" onClick={endMatch}>End match</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1.5rem' }}>
              <div className="text-end fw-900" style={{ fontSize: '1.3rem' }}>{activeGame.teamA}</div>
              <div className="fw-900" style={{ fontSize: '3rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {activeGame.scoreA ?? 0} <span style={{ opacity: 0.4 }}>:</span> {activeGame.scoreB ?? 0}
              </div>
              <div className="fw-900" style={{ fontSize: '1.3rem' }}>{activeGame.teamB}</div>
            </div>
          </section>

          {/* Event entry */}
          <section className="stat-tile mb-4" style={{ padding: '1.25rem 1.5rem' }}>
            <h5 className="fw-900 text-uppercase text-dark-green fs-7 mb-3">Log Event</h5>
            <div className="row g-2 align-items-end">
              <div className="col-md-2">
                <label className="form-label fw-bold fs-8">Event</label>
                <select className="form-select form-select-sm" value={evt.type}
                  onChange={(e) => setEvt((p) => ({ ...p, type: e.target.value as MatchEventType }))}>
                  {Object.entries(EVENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold fs-8">Team</label>
                <select className="form-select form-select-sm" value={evt.team}
                  onChange={(e) => setEvt((p) => ({ ...p, team: e.target.value as 'A' | 'B' }))}>
                  <option value="A">{activeGame.teamA}</option>
                  <option value="B">{activeGame.teamB}</option>
                </select>
              </div>
              <div className="col-md-1">
                <label className="form-label fw-bold fs-8">Min&apos;</label>
                <input type="number" min={0} max={130} className="form-control form-control-sm"
                  value={evt.minute}
                  onChange={(e) => setEvt((p) => ({ ...p, minute: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold fs-8">Player</label>
                <select className="form-select form-select-sm" value={evt.playerId}
                  onChange={(e) => setEvt((p) => ({ ...p, playerId: e.target.value }))}>
                  <option value="">—</option>
                  {(evt.team === 'A' ? teamAPlayers : teamBPlayers).map((p) =>
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  )}
                </select>
              </div>
              {evt.type === 'substitution' && (
                <div className="col-md-3">
                  <label className="form-label fw-bold fs-8">Comes on</label>
                  <select className="form-select form-select-sm" value={evt.secondaryPlayerId}
                    onChange={(e) => setEvt((p) => ({ ...p, secondaryPlayerId: e.target.value }))}>
                    <option value="">—</option>
                    {(evt.team === 'A' ? teamAPlayers : teamBPlayers).map((p) =>
                      <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                    )}
                  </select>
                </div>
              )}
              <div className="col-md-1 d-grid">
                <button className="btn-gold fw-900 fs-8 text-uppercase py-1" onClick={logEvent}>
                  Log
                </button>
              </div>
            </div>
          </section>

          {/* Event timeline */}
          <section className="stat-tile" style={{ padding: '1.25rem 1.5rem' }}>
            <h5 className="fw-900 text-uppercase text-dark-green fs-7 mb-3">Timeline ({activeGame.events?.length ?? 0})</h5>
            {(activeGame.events?.length ?? 0) === 0 ? (
              <p className="text-warm-muted fs-8 mb-0">No events yet.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {[...(activeGame.events ?? [])].sort((a, b) => b.minute - a.minute).map((e) => {
                  const teamName = e.team === 'A' ? activeGame.teamA : activeGame.teamB;
                  const cardColor =
                    e.type === 'yellow_card' ? 'var(--color-gold)' :
                    e.type === 'red_card'    ? 'var(--color-danger)' :
                    'var(--color-mid-green)';
                  return (
                    <div key={e.id} className="d-flex align-items-center gap-3 stat-tile" style={{ padding: '0.55rem 0.85rem' }}>
                      <span className="fw-900 text-dark-green" style={{ minWidth: 40, textAlign: 'right' }}>
                        {e.minute}{"'"}
                      </span>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: cardColor }}>
                        {EVENT_ICONS[e.type]}
                      </span>
                      <span className="fw-bold text-uppercase fs-9" style={{ minWidth: 110, letterSpacing: '0.05em', color: cardColor }}>
                        {EVENT_LABELS[e.type]}
                      </span>
                      <span className="fs-8 text-warm-muted" style={{ minWidth: 130 }}>{teamName}</span>
                      <span className="fs-8 flex-grow-1">
                        {e.playerName ?? ''}
                        {e.type === 'substitution' && e.secondaryPlayerName ? ` → ${e.secondaryPlayerName}` : ''}
                        {e.note ? ` · ${e.note}` : ''}
                      </span>
                      <button className="btn btn-sm btn-light border fs-9"
                        onClick={() => removeMatchEvent(activeGame.id, e.id)}>
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
