'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';
import { DashboardHero, Widget, DivisionMixChart, TimelineFeed, CriticalDates } from '@/components/dashboard';
import { StatCard, StatusBadge, SectionHeader, Avatar, DivisionBadge, GenderBadge, PlayerViewModal } from '@/components/ui';
import { FEED_EVENTS, CRITICAL_DATES, DIVISION_MIX, STATS } from '@/lib/mockData';
import type { Player } from '@/lib/types';

function RejectModal({
  playerName,
  onConfirm,
  onClose,
}: {
  playerName: string;
  onConfirm: (note: string) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState('');
  return (
    <div className="kpp-modal-backdrop is-open" onClick={onClose}>
      <div className="kpp-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="kpp-modal-header">
          <span className="kpp-modal-title">Reject Registration</span>
          <button className="kpp-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="kpp-modal-body">
          <p className="text-muted mb-3 fs-8">
            Rejecting <strong className="text-dark-green">{playerName}</strong>. A feedback comment is required.
          </p>
          <label className="fw-bold fs-8 text-uppercase opacity-75 mb-2 d-block">Reason *</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Explain the reason for rejection…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="kpp-modal-footer">
          <button className="kpp-btn kpp-btn--outline" onClick={onClose}>Cancel</button>
          <button
            className="kpp-btn kpp-btn--danger"
            disabled={!note.trim()}
            onClick={() => note.trim() && onConfirm(note.trim())}
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { session } = useSession();
  const { data, approvePlayer, rejectPlayer } = useAppData();
  const [viewPlayer, setViewPlayer]       = useState<Player | null>(null);
  const [rejectTarget, setRejectTarget]   = useState<Player | null>(null);

  const pendingPlayers = data.players.filter((p) => p.status === 'Pending');
  const activeCount    = data.players.filter((p) => p.status === 'Active').length;

  return (
    <main className="container-xxl py-5">

      {/* Hero */}
      <DashboardHero
        eyebrow="Executive Control"
        title="Welcome"
        titleAccent={session?.displayName ?? 'Admin'}
        statusLabel={`${data.registrationWindow.isOpen ? 'Registration Open' : 'Registration Closed'}`}
        statusSublabel="CURRENT WINDOW"
      />

      {/* Stat Cards */}
      <section className="row g-4 mb-5">
        <div className="col-md-4">
          <StatCard
            label="Total Players"
            value={STATS.totalPlayers.toLocaleString()}
            icon="groups"
            variant="primary"
            delay={0}
            subtitle={<><span className="material-symbols-outlined fs-6">trending_up</span><span>+12% from last quarter</span></>}
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Active Academies"
            value={data.academies.length}
            icon="sports_soccer"
            variant="surface"
            delay={1}
            subtitle={<><span className="material-symbols-outlined fs-6">location_on</span><span>8 Regions Active</span></>}
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Pending Registrations"
            value={pendingPlayers.length}
            icon="pending_actions"
            variant="secondary"
            delay={2}
            action={
              <Link href="/players?status=Pending" className="btn btn-dark btn-sm text-uppercase fw-900 rounded-0 px-4 mt-3">
                Review Queue
              </Link>
            }
          />
        </div>
      </section>

      {/* Main + Sidebar */}
      <div className="row g-5">

        {/* Approval Queue */}
        <div className="col-lg-8">
          <SectionHeader
            primary="Player"
            accent="Approval Queue"
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
                  <th>Academy</th>
                  <th>Division</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="fs-7">
                {pendingPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-mid-green py-4 fw-bold">
                      <span className="material-symbols-outlined align-middle me-2">check_circle</span>
                      No pending registrations.
                    </td>
                  </tr>
                ) : (
                  pendingPlayers.slice(0, 8).map((player) => (
                    <tr key={player.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <Avatar src={player.photo} alt={`${player.firstName} ${player.lastName}`} />
                          <div>
                            <div className="fw-bold text-dark-green">{player.firstName} {player.lastName}</div>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <span className="fs-9 text-muted">{player.prcId}</span>
                              <GenderBadge gender={player.gender} />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted fw-bold">{player.academy}</td>
                      <td><DivisionBadge division={player.division} /></td>
                      <td><StatusBadge status={player.status} /></td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-light rounded-0 border fw-bold"
                            onClick={() => setViewPlayer(player)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-success rounded-0 fw-bold"
                            onClick={() => approvePlayer(player.id)}
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pendingPlayers.length > 8 && (
            <Link href="/players?status=Pending" className="btn btn-light rounded-0 border fw-bold w-100 text-uppercase fs-8 py-2 mt-1">
              View All {pendingPlayers.length} Pending →
            </Link>
          )}

          {/* Pagination hint */}
          <div className="mt-2 d-flex justify-content-between align-items-center bg-light p-3">
            <span className="fs-8 fw-bold text-uppercase opacity-50">
              Showing {Math.min(pendingPlayers.length, 8)} of {pendingPlayers.length}
            </span>
            <Link href="/players" className="btn btn-link text-mid-green p-0 text-decoration-none fw-bold text-uppercase fs-8 border-bottom border-secondary border-2">
              Full Player List
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="col-lg-4">
          <Widget title="CRITICAL DATES" icon="alarm">
            <CriticalDates dates={CRITICAL_DATES} />
          </Widget>
          <Widget title="DIVISION MIX" dark>
            <DivisionMixChart stats={DIVISION_MIX} dark />
          </Widget>
          <div className="mt-5">
            <h4 className="widget-title text-dark-green">LIVE FEED</h4>
            <TimelineFeed events={FEED_EVENTS} />
          </div>
        </aside>
      </div>

      {viewPlayer && (
        <PlayerViewModal
          player={viewPlayer}
          onClose={() => setViewPlayer(null)}
          onApprove={(id) => { approvePlayer(id); setViewPlayer(null); }}
          onReject={(p) => { setRejectTarget(p); setViewPlayer(null); }}
        />
      )}

      {rejectTarget && (
        <RejectModal
          playerName={`${rejectTarget.firstName} ${rejectTarget.lastName}`}
          onConfirm={(note) => {
            rejectPlayer(rejectTarget.id, note, session?.displayName ?? 'Admin');
            setRejectTarget(null);
          }}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </main>
  );
}
