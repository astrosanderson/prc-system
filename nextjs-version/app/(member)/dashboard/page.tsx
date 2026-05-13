'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';
import { DashboardHero, Widget, DivisionMixChart } from '@/components/dashboard';
import { StatCard, StatusBadge, SectionHeader, Avatar, QuickActionButton, PlayerViewModal } from '@/components/ui';
import { DIVISION_MIX } from '@/lib/mockData';
import type { Player } from '@/lib/types';

export default function MemberDashboardPage() {
  const router    = useRouter();
  const { session } = useSession();
  const { data }  = useAppData();
  const [viewPlayer, setViewPlayer] = useState<Player | null>(null);

  /* Admin users should never land on the member dashboard */
  useEffect(() => {
    if (session?.role === 'admin') router.replace('/admin/dashboard');
  }, [session, router]);

  if (session?.role === 'admin') return null;

  const academyName = session?.academyName ?? 'Your Academy';
  const myPlayers   = data.players.filter((p) => p.academyId === session?.academyId);
  const divisionCount = new Set(myPlayers.map((p) => p.division)).size;
  const pendingCount  = myPlayers.filter((p) => p.status === 'Pending').length;
  const isRegOpen     = data.registrationWindow.isOpen;

  return (
    <main className="container-xxl py-5">

      {/* Hero */}
      <DashboardHero
        eyebrow="Academy Workspace"
        title="Welcome"
        titleAccent={session?.displayName ?? ''}
        subtitle={academyName}
        subtitleLabel="ACADEMY"
        statusLabel={isRegOpen ? 'Registration Open' : 'Registration Closed'}
        statusSublabel="CURRENT WINDOW"
        registrationWindow={data.registrationWindow}
      />

      {/* Registration closed warning */}
      {!isRegOpen && (
        <div className="alert alert-warning d-flex align-items-center gap-2 mb-4 fw-bold">
          <span className="material-symbols-outlined">lock</span>
          Registration window is currently closed. Contact your league administrator.
        </div>
      )}

      {/* Stat Cards */}
      <section className="row g-4 mb-5">
        <div className="col-md-4">
          <StatCard
            label="My Players"
            value={myPlayers.length}
            icon="groups"
            variant="primary"
            delay={0}
            subtitle={<><span className="material-symbols-outlined fs-6">groups</span><span>In {academyName}</span></>}
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Active Divisions"
            value={divisionCount || 0}
            icon="sports_soccer"
            variant="surface"
            delay={1}
            subtitle={<><span className="material-symbols-outlined fs-6">analytics</span><span>U-8 to U-18 structure</span></>}
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Pending Approval"
            value={pendingCount}
            icon="pending_actions"
            variant="secondary"
            delay={2}
            action={
              isRegOpen ? (
                <Link href="/players/register" className="btn btn-dark btn-sm text-uppercase fw-900 rounded-0 px-4 mt-3">
                  Add Player
                </Link>
              ) : (
                <span className="badge bg-secondary mt-3 fw-bold">Reg. Closed</span>
              )
            }
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="row g-4 mb-5">
        <div className="col-6 col-md-3">
          <QuickActionButton href="/academies/my"     icon="groups"         label="My Players" />
        </div>
        <div className="col-6 col-md-3">
          <QuickActionButton href="/players/register" icon="person_add"     label="Add Player" />
        </div>
        <div className="col-6 col-md-3">
          <QuickActionButton href="/academies"        icon="travel_explore" label="Academies" />
        </div>
        <div className="col-6 col-md-3">
          <QuickActionButton href="/archives"         icon="history"        label="Past Games" />
        </div>
      </section>

      {/* Main + Sidebar */}
      <div className="row g-5">

        {/* Roster table */}
        <div className="col-lg-8">
          <SectionHeader
            primary="My"
            accent="Roster"
            action={
              <Link href="/players" className="btn btn-light rounded-0 border fw-bold">
                All Players
              </Link>
            }
          />
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Position</th>
                  <th>Division</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody className="fs-7">
                {myPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4 fw-bold">
                      No players registered yet.{' '}
                      {isRegOpen && <Link href="/players/register">Register the first player →</Link>}
                    </td>
                  </tr>
                ) : (
                  myPlayers.slice(0, 5).map((player) => (
                    <tr key={player.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <Avatar src={player.photo} alt={`${player.firstName} ${player.lastName}`} />
                          <span className="fw-bold text-dark-green">{player.firstName} {player.lastName}</span>
                        </div>
                      </td>
                      <td className="text-muted fw-bold">{player.position}</td>
                      <td><span className="badge-elite">{player.division}</span></td>
                      <td><StatusBadge status={player.status} /></td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-light rounded-0 border fw-bold"
                          onClick={() => setViewPlayer(player)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {myPlayers.length > 5 && (
            <Link href="/academies/my" className="btn btn-light rounded-0 border fw-bold w-100 text-uppercase fs-8 py-2">
              View All {myPlayers.length} Players
            </Link>
          )}
        </div>

        {/* Sidebar */}
        <aside className="col-lg-4">
          <Widget title="DIVISION MIX" icon="analytics">
            <DivisionMixChart stats={DIVISION_MIX} />
          </Widget>
          <Widget title="PAST GAMES" dark footer={
            <Link href="/archives" className="btn btn-outline-light w-100 rounded-0 fs-8 fw-bold text-uppercase py-3 mt-3">
              All Games
            </Link>
          }>
            <div className="d-flex flex-column">
              {data.games.slice(0, 3).map((g) => {
                const scoreA = typeof g.scoreA === 'number' ? g.scoreA : Number(g.score.split('-')[0] ?? 0);
                const scoreB = typeof g.scoreB === 'number' ? g.scoreB : Number(g.score.split('-')[1] ?? 0);
                const teamA  = g.teamA ?? g.fixture?.split(' vs ')[0];
                const teamB  = g.teamB ?? g.fixture?.split(' vs ')[1];
                return (
                  <div key={g.id} className="py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span className="text-white fs-8 fw-bold text-truncate" style={{ opacity: scoreA > scoreB ? 1 : 0.7 }}>
                        {teamA}
                      </span>
                      <span className="text-white fw-900" style={{ letterSpacing: '0.04em', minWidth: 56, textAlign: 'center' }}>
                        {scoreA} <span className="opacity-50">:</span> {scoreB}
                      </span>
                      <span className="text-white fs-8 fw-bold text-truncate text-end" style={{ opacity: scoreB > scoreA ? 1 : 0.7 }}>
                        {teamB}
                      </span>
                    </div>
                    <div className="fs-9 opacity-50 mt-1">{g.date}</div>
                  </div>
                );
              })}
            </div>
          </Widget>
        </aside>
      </div>

      {viewPlayer && (
        <PlayerViewModal player={viewPlayer} onClose={() => setViewPlayer(null)} />
      )}
    </main>
  );
}
