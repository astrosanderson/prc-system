'use client';

import { useState, useMemo } from 'react';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';
import { FixtureRow } from '@/components/ui';
import type { Game, MatchResult, MatchType, GoalScorer } from '@/lib/types';
import { MATCH_TYPES } from '@/lib/types';

function computeResult(a: number, b: number): MatchResult {
  if (a > b) return 'W';
  if (b > a) return 'L';
  return 'D';
}

function GameModal({
  game,
  onSave,
  onClose,
  academies,
  players,
}: {
  game: Partial<Game> | null;
  onSave: (data: Omit<Game, 'id'>) => void;
  onClose: () => void;
  academies: { id: string; name: string }[];
  players: import('@/lib/types').Player[];
}) {
  const [form, setForm] = useState({
    teamA:     game?.teamA    ?? '',
    teamB:     game?.teamB    ?? '',
    scoreA:    game?.scoreA   ?? 0,
    scoreB:    game?.scoreB   ?? 0,
    date:      game?.date     ?? '',
    matchType: (game?.matchType ?? 'Friendly') as MatchType,
    notes:     game?.notes    ?? '',
  });
  const [scorers, setScorers] = useState<GoalScorer[]>(game?.scorers ?? []);

  const result   = computeResult(form.scoreA, form.scoreB);
  const score    = `${form.scoreA}-${form.scoreB}`;
  const fixture  = form.teamA && form.teamB ? `${form.teamA} vs ${form.teamB}` : '';

  const resultSummary = (() => {
    if (!form.teamA || !form.teamB) return '';
    if (result === 'D') return 'Match ended in a draw';
    const winner = result === 'W' ? form.teamA : form.teamB;
    const loser  = result === 'W' ? form.teamB : form.teamA;
    return `${winner} defeated ${loser}`;
  })();

  const teamAPlayers = players.filter((p) =>
    p.academy === form.teamA || (academies.find((a) => a.name === form.teamA)?.id === p.academyId)
  );
  const teamBPlayers = players.filter((p) =>
    p.academy === form.teamB || (academies.find((a) => a.name === form.teamB)?.id === p.academyId)
  );

  function addScorer(team: 'A' | 'B') {
    const teamPlayers = team === 'A' ? teamAPlayers : teamBPlayers;
    if (!teamPlayers.length) return;
    const p = teamPlayers[0];
    setScorers((prev) => [...prev, { playerId: p.id, playerName: `${p.firstName} ${p.lastName}`, team, minute: undefined }]);
  }

  function updateScorerPlayer(idx: number, playerId: string, team: 'A' | 'B') {
    const teamPlayers = team === 'A' ? teamAPlayers : teamBPlayers;
    const p = teamPlayers.find((pl) => pl.id === playerId) ?? teamPlayers[0];
    if (!p) return;
    setScorers((prev) => prev.map((s, i) =>
      i === idx ? { ...s, playerId: p.id, playerName: `${p.firstName} ${p.lastName}` } : s
    ));
  }

  function updateScorerMinute(idx: number, minute: number | undefined) {
    setScorers((prev) => prev.map((s, i) => i === idx ? { ...s, minute } : s));
  }

  function removeScorer(idx: number) {
    setScorers((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    if (!form.teamA.trim() || !form.teamB.trim() || !form.date) return;
    onSave({
      teamA:     form.teamA.trim(),
      teamB:     form.teamB.trim(),
      fixture,
      date:      form.date,
      scoreA:    form.scoreA,
      scoreB:    form.scoreB,
      score,
      result,
      matchType: form.matchType,
      notes:     form.notes.trim() || undefined,
      scorers:   scorers.length > 0 ? scorers : undefined,
    });
  }

  const canSave = form.teamA.trim() && form.teamB.trim() && form.date;

  return (
    <div className="kpp-modal-backdrop is-open" onClick={onClose}>
      <div className="kpp-modal kpp-modal--light kpp-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="kpp-modal-header">
          <span className="kpp-modal-title">{game?.id ? 'Edit Game' : 'Add Game'}</span>
          <button className="kpp-modal-close" onClick={onClose}>ÃƒÂ¢Ã…“Ã¢â‚¬Â¢</button>
        </div>
        <div className="kpp-modal-body">
          <div className="row g-3">
            {/* Teams */}
            <div className="col-sm-5">
              <label className="form-label fw-bold fs-8">Team A *</label>
              <select className="form-select" value={form.teamA}
                onChange={(e) => setForm((p) => ({ ...p, teamA: e.target.value }))}>
                <option value="">Select team…</option>
                {academies.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
              </select>
            </div>
            <div className="col-sm-2 d-flex align-items-end justify-content-center pb-1">
              <span className="fw-900 text-muted fs-5">vs</span>
            </div>
            <div className="col-sm-5">
              <label className="form-label fw-bold fs-8">Team B *</label>
              <select className="form-select" value={form.teamB}
                onChange={(e) => setForm((p) => ({ ...p, teamB: e.target.value }))}>
                <option value="">Select team…</option>
                {academies.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
              </select>
            </div>

            {/* Scores */}
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">{form.teamA || 'Team A'} Score</label>
              <input type="number" min={0} className="form-control" value={form.scoreA}
                onChange={(e) => setForm((p) => ({ ...p, scoreA: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">{form.teamB || 'Team B'} Score</label>
              <input type="number" min={0} className="form-control" value={form.scoreB}
                onChange={(e) => setForm((p) => ({ ...p, scoreB: parseInt(e.target.value) || 0 }))} />
            </div>

            {/* Result preview ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â score-led, no colored badge */}
            <div className="col-12">
              <div
                className="d-flex flex-wrap align-items-center gap-3 px-3 py-2"
                style={{ background: '#fafbf9', border: '1px solid rgba(27, 58, 45,0.08)', borderRadius: 10 }}
              >
                <span className="fs-9 fw-900 text-uppercase opacity-50">Preview</span>
                <span className="fw-900 text-dark-green d-flex align-items-center gap-2" style={{ letterSpacing: '0.04em' }}>
                  <span className="text-truncate" style={{ maxWidth: 140 }}>{form.teamA || 'Team A'}</span>
                  <span className="fs-4">{form.scoreA}</span>
                  <span className="text-muted">:</span>
                  <span className="fs-4">{form.scoreB}</span>
                  <span className="text-truncate" style={{ maxWidth: 140 }}>{form.teamB || 'Team B'}</span>
                </span>
                {resultSummary && (
                  <span className="fs-8 text-muted ms-auto">{resultSummary}</span>
                )}
              </div>
            </div>

            {/* Date + Match Type */}
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Date *</label>
              <input type="date" className="form-control" value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Match Type</label>
              <select className="form-select" value={form.matchType}
                onChange={(e) => setForm((p) => ({ ...p, matchType: e.target.value as MatchType }))}>
                {MATCH_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Notes */}
            <div className="col-12">
              <label className="form-label fw-bold fs-8">Notes</label>
              <textarea className="form-control" rows={2} placeholder="Optional notes…"
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            </div>

            {/* Goal scorers */}
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <label className="form-label fw-bold fs-8 mb-0">Goal Scorers</label>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary rounded-0 fw-bold fs-9"
                    onClick={() => addScorer('A')} disabled={!teamAPlayers.length}>
                    + Team A
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-secondary rounded-0 fw-bold fs-9"
                    onClick={() => addScorer('B')} disabled={!teamBPlayers.length}>
                    + Team B
                  </button>
                </div>
              </div>
              {scorers.length === 0 ? (
                <div className="text-muted fs-8 py-2 text-center" style={{ background: '#fafbf9', borderRadius: 8 }}>
                  No scorers added. Select teams first, then add goals.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {scorers.map((sc, idx) => {
                    const teamPlayers = sc.team === 'A' ? teamAPlayers : teamBPlayers;
                    return (
                      <div key={idx} className="d-flex flex-wrap align-items-center gap-2">
                        <span
                          className="fw-bold text-uppercase"
                          style={{
                            fontSize: '0.62rem',
                            letterSpacing: '0.08em',
                            padding: '0.25rem 0.55rem',
                            borderRadius: 999,
                            background: sc.team === 'A' ? 'rgba(27, 58, 45,0.08)' : 'rgba(45, 106, 79,0.1)',
                            color: sc.team === 'A' ? 'var(--primary)' : '#2d6a4f',
                          }}
                        >
                          {sc.team === 'A' ? form.teamA || 'Team A' : form.teamB || 'Team B'}
                        </span>
                        <select
                          className="form-select form-select-sm"
                          value={sc.playerId}
                          onChange={(e) => updateScorerPlayer(idx, e.target.value, sc.team)}
                          style={{ flex: '1 1 180px', minWidth: 0 }}
                        >
                          {teamPlayers.map((p) => (
                            <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                          ))}
                        </select>
                        <div className="input-group input-group-sm" style={{ width: 110 }}>
                          <input
                            type="number"
                            min={0}
                            max={130}
                            className="form-control"
                            placeholder="min"
                            value={typeof sc.minute === 'number' ? sc.minute : ''}
                            onChange={(e) => updateScorerMinute(idx, e.target.value === '' ? undefined : Math.max(0, parseInt(e.target.value) || 0))}
                          />
                          <span className="input-group-text">{"'"}</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-light border"
                          onClick={() => removeScorer(idx)}
                          aria-label="Remove scorer"
                          style={{ borderRadius: 8 }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>close</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="kpp-modal-footer">
          <button className="kpp-btn kpp-btn--outline" onClick={onClose}>Cancel</button>
          <button className="kpp-btn kpp-btn--primary" onClick={handleSave} disabled={!canSave}>
            {game?.id ? 'Save Changes' : 'Add Game'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ArchivesPage() {
  const { session } = useSession();
  const { data, addGame, updateGame, deleteGame } = useAppData();

  const [modal, setModal]             = useState<Partial<Game> | null | 'new'>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch]           = useState('');
  const [typeFilter, setTypeFilter]   = useState<MatchType | ''>('');

  const isAdmin = session?.role === 'admin';

  const sortedGames = useMemo(() => {
    return [...data.games]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((g) => {
        const fixture = (g.fixture ?? '').toLowerCase();
        if (search && !fixture.includes(search.toLowerCase())) return false;
        if (typeFilter && g.matchType !== typeFilter) return false;
        return true;
      });
  }, [data.games, search, typeFilter]);

  function handleSave(formData: Omit<Game, 'id'>) {
    if (modal && typeof modal === 'object' && modal.id) {
      updateGame(modal.id, formData);
    } else {
      addGame({ id: `g${Date.now()}`, ...formData });
    }
    setModal(null);
  }

  const wins   = data.games.filter((g) => g.result === 'W').length;
  const losses = data.games.filter((g) => g.result === 'L').length;
  const draws  = data.games.filter((g) => g.result === 'D').length;

  return (
    <main className="container-xxl py-5">
      {/* Header */}
      <div className="row align-items-end mb-5 g-4">
        <div className="col-lg-8">
          <span className="badge-gold mb-3 d-inline-block">Season Results</span>
          <h1 className="editorial-header display-4 fw-900 text-dark-green">
            Past <span className="text-warm-muted">Games</span>
          </h1>
        </div>
        {isAdmin && (
          <div className="col-lg-4 text-lg-end">
            <button className="btn-gold px-4 py-2 fw-900 text-uppercase fs-8" onClick={() => setModal('new')}>
              <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>add</span>
              Add Game
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="row g-3 mb-5">
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Total Games</div>
            <div className="fs-3 fw-900 text-dark-green">{data.games.length}</div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Wins</div>
            <div className="fs-3 fw-900 text-mid-green">{wins}</div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Draws</div>
            <div className="fs-3 fw-900 text-gold">{draws}</div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Losses</div>
            <div className="fs-3 fw-900 text-danger">{losses}</div>
          </div>
        </div>
      </div>

      {/* Search + filter */}
      <div className="bg-white p-3 mb-4 d-flex flex-wrap gap-2 align-items-end">
        <div className="flex-grow-1" style={{ minWidth: 200 }}>
          <label className="fs-9 fw-900 text-uppercase opacity-50 mb-1 d-block">Search</label>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-transparent border-end-0">
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>search</span>
            </span>
            <input type="text" className="form-control border-start-0"
              placeholder="Search fixture…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ minWidth: 160 }}>
          <label className="fs-9 fw-900 text-uppercase opacity-50 mb-1 d-block">Match Type</label>
          <select className="form-select form-select-sm" value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MatchType | '')}>
            <option value="">All Types</option>
            {MATCH_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {(search || typeFilter) && (
          <button className="btn btn-sm btn-outline-secondary align-self-end"
            onClick={() => { setSearch(''); setTypeFilter(''); }}>
            Clear
          </button>
        )}
      </div>

      {/* Fixture list */}
      {sortedGames.length === 0 ? (
        <div
          className="text-center py-5"
          style={{ background: '#fff', border: '1px solid rgba(27, 58, 45,0.08)', borderRadius: 12 }}
        >
          <span className="material-symbols-outlined text-muted d-block mb-2" style={{ fontSize: '2.5rem' }}>sports_soccer</span>
          <p className="fw-bold text-muted mb-0">No games found.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4 gap-md-4">
          {sortedGames.map((game) => (
            <article key={game.id}>
              {/* Meta row: date, match type, admin actions */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2 px-1">
                <span className="fs-9 fw-700 text-uppercase opacity-60" style={{ letterSpacing: '0.06em' }}>
                  {game.date}
                </span>
                {game.matchType && (
                  <span
                    className="fw-bold text-uppercase"
                    style={{
                      fontSize: '0.62rem',
                      letterSpacing: '0.06em',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 999,
                      background: 'rgba(27, 58, 45,0.06)',
                      color: 'var(--primary)',
                    }}
                  >
                    {game.matchType}
                  </span>
                )}
                {isAdmin && (
                  <div className="d-flex gap-2 ms-auto">
                    <button
                      className="btn btn-sm btn-light border fw-bold"
                      onClick={() => setModal(game)}
                      style={{ borderRadius: 8 }}
                    >
                      Edit
                    </button>
                    {deleteConfirm === game.id ? (
                      <>
                        <button
                          className="btn btn-sm btn-danger fw-bold"
                          onClick={() => { deleteGame(game.id); setDeleteConfirm(null); }}
                          style={{ borderRadius: 8 }}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-sm btn-light border"
                          onClick={() => setDeleteConfirm(null)}
                          style={{ borderRadius: 8 }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-danger fw-bold"
                        onClick={() => setDeleteConfirm(game.id)}
                        style={{ borderRadius: 8 }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Fixture itself */}
              <FixtureRow game={game} />

              {game.notes && (
                <div className="fs-9 text-muted fst-italic mt-2 px-2">{game.notes}</div>
              )}
            </article>
          ))}
        </div>
      )}

      {modal !== null && (
        <GameModal
          game={modal === 'new' ? {} : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          academies={data.academies.map((a) => ({ id: a.id, name: a.name }))}
          players={data.players}
        />
      )}
    </main>
  );
}
