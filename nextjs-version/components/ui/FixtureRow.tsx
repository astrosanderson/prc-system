'use client';

import type { Game, GoalScorer } from '@/lib/types';

interface FixtureRowProps {
  game: Game;
  /** Compact variant used in sidebar widgets — single-line, no scorers section. */
  compact?: boolean;
  className?: string;
}

function ScorerLine({ s, align = 'left' }: { s: GoalScorer; align?: 'left' | 'right' }) {
  return (
    <li className={`fixture-scorer-line ${align === 'right' ? 'text-end' : ''}`}>
      <span className="fixture-scorer-name">{s.playerName}</span>
      {typeof s.minute === 'number' && (
        <span className="fixture-scorer-minute"> ({s.minute}{"'"})</span>
      )}
    </li>
  );
}

export function FixtureRow({ game, compact, className = '' }: FixtureRowProps) {
  const teamA = game.teamA ?? game.fixture?.split(' vs ')[0] ?? 'Team A';
  const teamB = game.teamB ?? game.fixture?.split(' vs ')[1] ?? 'Team B';
  const scoreA = typeof game.scoreA === 'number'
    ? game.scoreA
    : Number(game.score?.split('-')[0] ?? 0);
  const scoreB = typeof game.scoreB === 'number'
    ? game.scoreB
    : Number(game.score?.split('-')[1] ?? 0);

  const aWins = scoreA > scoreB;
  const bWins = scoreB > scoreA;

  const teamAScorers = (game.scorers ?? []).filter((s) => s.team === 'A');
  const teamBScorers = (game.scorers ?? []).filter((s) => s.team === 'B');
  const hasScorers   = teamAScorers.length > 0 || teamBScorers.length > 0;

  /* Compact (sidebar) layout — single-line three-column grid */
  if (compact) {
    return (
      <div className={`fixture-row-compact ${className}`}>
        <span className={`fixture-team-left ${aWins ? 'fixture-team--win' : ''}`}>{teamA}</span>
        <span className="fixture-score-compact">
          {scoreA} <span className="fixture-colon">:</span> {scoreB}
        </span>
        <span className={`fixture-team-right ${bWins ? 'fixture-team--win' : ''}`}>{teamB}</span>
      </div>
    );
  }

  /* Full fixture card */
  return (
    <div className={`fixture-card ${className}`}>
      {/* Score row — strict 3-column grid: 1fr | auto | 1fr */}
      <div className="fixture-score-row">
        <div className={`fixture-team fixture-team-left ${aWins ? 'fixture-team--win' : ''}`}>
          {teamA}
        </div>
        <div className="fixture-score">
          <span className={`fixture-score-num ${aWins ? 'fixture-score--win' : ''}`}>{scoreA}</span>
          <span className="fixture-colon">:</span>
          <span className={`fixture-score-num ${bWins ? 'fixture-score--win' : ''}`}>{scoreB}</span>
        </div>
        <div className={`fixture-team fixture-team-right ${bWins ? 'fixture-team--win' : ''}`}>
          {teamB}
        </div>
      </div>

      {/* Scorer panel — secondary inset */}
      {hasScorers && (
        <div className="fixture-scorers">
          <div className="fixture-scorers-grid">
            <div>
              {teamAScorers.length > 0 && (
                <>
                  <div className="fixture-scorers-label">Scorers · {teamA}</div>
                  <ul className="list-unstyled mb-0">
                    {teamAScorers.map((s, i) => <ScorerLine key={`a-${i}`} s={s} />)}
                  </ul>
                </>
              )}
            </div>
            <div>
              {teamBScorers.length > 0 && (
                <>
                  <div className="fixture-scorers-label text-end">Scorers · {teamB}</div>
                  <ul className="list-unstyled mb-0">
                    {teamBScorers.map((s, i) => <ScorerLine key={`b-${i}`} s={s} align="right" />)}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
