'use client';

import { useAppData } from '@/context/AppDataContext';
import { Avatar, DivisionBadge } from '@/components/ui';

const SEASONS = [
  {
    year: '2023/24', totalPlayers: 5402, academies: 52, games: 144,
    topScorer: 'Marcus Thorne', topAcademy: 'Copperbelt Elite FC',
    champion: 'North Star Elite', runnerUp: 'Victoria Falls FC',
    totalGoals: 312, avgGoalsPerGame: 2.17,
  },
  {
    year: '2022/23', totalPlayers: 4891, academies: 48, games: 132,
    topScorer: 'David Nyambe', topAcademy: 'Victoria Falls FC',
    champion: 'Victoria Falls FC', runnerUp: 'Zambezi Lions Academy',
    totalGoals: 278, avgGoalsPerGame: 2.11,
  },
  {
    year: '2021/22', totalPlayers: 4320, academies: 44, games: 118,
    topScorer: 'Samuel Okoro', topAcademy: 'North Star Elite',
    champion: 'Copperbelt Elite FC', runnerUp: 'Riverside United',
    totalGoals: 241, avgGoalsPerGame: 2.04,
  },
];

const ACADEMY_ACHIEVEMENTS = [
  { academy: 'North Star Elite', location: 'Ndola', titles: 3, cups: 2, runnerUp: 1, founded: 2008 },
  { academy: 'Victoria Falls FC', location: 'Victoria Falls', titles: 2, cups: 4, runnerUp: 3, founded: 2005 },
  { academy: 'Copperbelt Elite FC', location: 'Kitwe', titles: 2, cups: 1, runnerUp: 2, founded: 2010 },
  { academy: 'Zambezi Lions Academy', location: 'Lusaka', titles: 1, cups: 3, runnerUp: 2, founded: 2012 },
  { academy: 'Riverside United', location: 'Livingstone', titles: 0, cups: 2, runnerUp: 2, founded: 2014 },
  { academy: 'Southern Cross Academy', location: 'Choma', titles: 0, cups: 1, runnerUp: 1, founded: 2015 },
];

const MATCH_HIGHLIGHTS = [
  {
    id: '1', season: '2023/24', fixture: 'North Star Elite vs Victoria Falls FC',
    score: '3-2', date: '2024-11-10', type: 'Final',
    summary: 'A nail-biting final with Robert Chileshe scoring the winner in the 87th minute.',
  },
  {
    id: '2', season: '2023/24', fixture: 'Copperbelt Elite vs Zambezi Lions',
    score: '4-0', date: '2024-10-22', type: 'Semi-Final',
    summary: 'Victoria Mwamba dominated with a hat-trick as Copperbelt cruised to the final four.',
  },
  {
    id: '3', season: '2022/23', fixture: 'Victoria Falls FC vs North Star Elite',
    score: '2-1', date: '2023-11-15', type: 'Final',
    summary: 'Victor Mwembe\'s brace secured back-to-back league titles for Victoria Falls FC.',
  },
  {
    id: '4', season: '2022/23', fixture: 'Riverside United vs Copperbelt Elite',
    score: '5-3', date: '2023-09-30', type: 'League Match',
    summary: 'Seven-goal thriller in the most entertaining match of the regular season.',
  },
];

const LEAGUE_RECORDS = [
  { label: 'Most Goals in a Season', value: 'Marcus Thorne', detail: '19 goals · 2023/24' },
  { label: 'Most Assists in a Season', value: 'Robert Chileshe', detail: '14 assists · 2023/24' },
  { label: 'Highest Rated Player', value: 'Marcus Thorne', detail: '8.4 avg rating · 2023/24' },
  { label: 'Most Clean Sheets', value: 'Samuel Okoro', detail: '12 sheets · 2022/23' },
  { label: 'Most League Titles', value: 'North Star Elite', detail: '3 titles' },
  { label: 'Most Cups Won', value: 'Victoria Falls FC', detail: '4 cups' },
];

export default function HistoricalHubPage() {
  const { data } = useAppData();

  const topScorers = [...data.players]
    .filter((p) => p.seasons?.[0]?.goals !== undefined)
    .sort((a, b) => (b.seasons![0].goals) - (a.seasons![0].goals))
    .slice(0, 5);

  const topRated = [...data.players]
    .filter((p) => p.seasonRating !== undefined)
    .sort((a, b) => (b.seasonRating!) - (a.seasonRating!))
    .slice(0, 5);

  const topAssists = [...data.players]
    .filter((p) => p.seasons?.[0]?.assists !== undefined)
    .sort((a, b) => (b.seasons![0].assists) - (a.seasons![0].assists))
    .slice(0, 5);

  return (
    <main className="container-xxl py-5 historical-hub">
      {/* Header */}
      <header className="mb-5 pb-2">
        <span className="hh-eyebrow">League Archive</span>
        <h1 className="hh-title">Historical Hub</h1>
        <p className="hh-intro">
          View seasonal records, academy achievements, and long-term competition statistics
          across the Zambezi Futures league.
        </p>
      </header>

      {/* ── Season Records ── */}
      <section className="mb-5 pb-4">
        <h2 className="hh-section-title">Season Records</h2>
        <div className="row g-4 g-lg-5">
          {SEASONS.map((season, i) => (
            <div key={season.year} className="col-md-6 col-lg-4">
              <article className={`hh-season-card h-100 ${i === 0 ? 'hh-season-card--current' : ''}`}>
                <div className="hh-season-eyebrow">
                  {i === 0 ? 'Current Season' : `${i === 1 ? '1' : '2'} Season${i === 1 ? '' : 's'} Ago`}
                </div>
                <div className="hh-season-year">{season.year}</div>

                <div className="hh-season-stats">
                  {[
                    { label: 'Players',   value: season.totalPlayers.toLocaleString() },
                    { label: 'Academies', value: season.academies },
                    { label: 'Games',     value: season.games },
                  ].map(({ label, value }) => (
                    <div key={label} className="hh-season-stat">
                      <div className="hh-season-stat-value">{value}</div>
                      <div className="hh-season-stat-label">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="hh-season-divider" />

                <dl className="hh-season-facts mb-0">
                  {[
                    { label: 'Champion',    value: season.champion },
                    { label: 'Top Scorer',  value: season.topScorer },
                    { label: 'Total Goals', value: String(season.totalGoals) },
                  ].map(({ label, value }) => (
                    <div key={label} className="hh-season-fact">
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ── All-Time Records — soft container, individual cards inside ── */}
      <section className="mb-5 pb-4">
        <h2 className="hh-section-title">All-Time Records</h2>
        <div className="hh-records-surface">
          <div className="row g-3">
            {LEAGUE_RECORDS.map((rec) => (
              <div key={rec.label} className="col-sm-6 col-lg-4">
                <article className="hh-record-card h-100">
                  <div className="hh-record-label">
                    <span className="hh-record-dot" />
                    {rec.label}
                  </div>
                  <div className="hh-record-value">{rec.value}</div>
                  <div className="hh-record-detail">{rec.detail}</div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Match Highlights ── */}
      <section className="mb-5 pb-4">
        <h2 className="hh-section-title">Notable Matches</h2>
        <div className="row g-4">
          {MATCH_HIGHLIGHTS.map((match) => (
            <div key={match.id} className="col-md-6">
              <article className="hh-match-card h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="hh-match-type">{match.type}</span>
                  <span className="hh-match-meta">{match.season} · {match.date}</span>
                </div>
                <h6 className="hh-match-title mb-1">{match.fixture}</h6>
                <div className="hh-match-score">{match.score}</div>
                <p className="hh-match-summary">{match.summary}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ── Player Stats ── */}
      <section className="row g-4 g-lg-5 mb-5 pb-4">
        <div className="col-lg-4">
          <h2 className="hh-section-title">Top Scorers — 2023/24</h2>
          <div className="hh-list">
            {topScorers.length === 0 ? (
              <div className="text-center text-muted py-4">No data available.</div>
            ) : (
              topScorers.map((player, i) => (
                <div key={player.id} className="hh-list-row">
                  <span className="hh-list-rank">#{i + 1}</span>
                  <Avatar src={player.photo} alt={`${player.firstName} ${player.lastName}`} />
                  <div className="flex-grow-1 min-w-0">
                    <div className="hh-list-name">{player.firstName} {player.lastName}</div>
                    <div className="hh-list-sub">{player.academy}</div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <div className="hh-list-stat">{player.seasons![0].goals}</div>
                    <div className="hh-list-stat-label">goals</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <h2 className="hh-section-title">Top Assists — 2023/24</h2>
          <div className="hh-list">
            {topAssists.length === 0 ? (
              <div className="text-center text-muted py-4">No data available.</div>
            ) : (
              topAssists.map((player, i) => (
                <div key={player.id} className="hh-list-row">
                  <span className="hh-list-rank">#{i + 1}</span>
                  <Avatar src={player.photo} alt={`${player.firstName} ${player.lastName}`} />
                  <div className="flex-grow-1 min-w-0">
                    <div className="hh-list-name">{player.firstName} {player.lastName}</div>
                    <div className="hh-list-sub">{player.academy}</div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <div className="hh-list-stat">{player.seasons![0].assists}</div>
                    <div className="hh-list-stat-label">assists</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <h2 className="hh-section-title">Top Rated — 2023/24</h2>
          <div className="hh-list">
            {topRated.length === 0 ? (
              <div className="text-center text-muted py-4">No data available.</div>
            ) : (
              topRated.map((player, i) => (
                <div key={player.id} className="hh-list-row">
                  <span className="hh-list-rank">#{i + 1}</span>
                  <Avatar src={player.photo} alt={`${player.firstName} ${player.lastName}`} />
                  <div className="flex-grow-1 min-w-0">
                    <div className="hh-list-name">{player.firstName} {player.lastName}</div>
                    <div className="hh-list-sub">{player.position}</div>
                  </div>
                  <DivisionBadge division={player.division} />
                  <div className="text-end flex-shrink-0">
                    <div className="hh-list-stat">{player.seasonRating!.toFixed(1)}</div>
                    <div className="hh-list-stat-label">rating</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Academy Achievements ── */}
      <section>
        <h2 className="hh-section-title">Academy Achievements</h2>
        <div className="row g-4">
          {ACADEMY_ACHIEVEMENTS.map((acad) => (
            <div key={acad.academy} className="col-md-6 col-lg-4">
              <article className="hh-academy-card h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="hh-academy-logo">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>sports_soccer</span>
                  </div>
                  <div>
                    <div className="hh-academy-name">{acad.academy}</div>
                    <div className="hh-academy-sub">{acad.location} · Est. {acad.founded}</div>
                  </div>
                </div>
                <div className="hh-academy-stats">
                  {[
                    { label: 'Titles',    value: acad.titles },
                    { label: 'Cups',      value: acad.cups },
                    { label: 'Runner-Up', value: acad.runnerUp },
                  ].map(({ label, value }) => (
                    <div key={label} className="hh-academy-stat">
                      <div className="hh-academy-stat-value">{value}</div>
                      <div className="hh-academy-stat-label">{label}</div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
