'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';
import { Avatar, StatusBadge, DivisionBadge, GenderBadge, PlayerViewModal, EditPlayerModal } from '@/components/ui';
import { DIVISIONS, GENDERS } from '@/lib/types';
import type { Division, Gender, Player, TransferRequest } from '@/lib/types';

export default function MyAcademyPage() {
  const router = useRouter();
  const { session } = useSession();
  const { data, updatePlayer, deletePlayer, getAcademyPlayerCount, createTransfer } = useAppData();

  const [search, setSearch]           = useState('');
  const [divFilter, setDivFilter]     = useState<Division | ''>('');
  const [genderFilter, setGenderFilter] = useState<Gender | ''>('');
  const [viewPlayer, setViewPlayer]   = useState<Player | null>(null);
  const [editPlayer, setEditPlayer]   = useState<Player | null>(null);
  const [deleteTarget, setDeleteTarget]     = useState<Player | null>(null);
  const [transferTarget, setTransferTarget] = useState<Player | null>(null);

  /* Admins don't have a "my academy" ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â redirect them */
  useEffect(() => {
    if (session && session.role === 'admin') {
      router.replace('/academies');
    }
  }, [session, router]);

  if (!session || session.role !== 'member') return null;

  const academy   = data.academies.find((a) => a.id === session.academyId);
  const myPlayers = data.players.filter((p) => p.academyId === session.academyId);
  const isRegOpen = data.registrationWindow.isOpen;

  const filtered = useMemo(() => {
    return myPlayers.filter((p) => {
      const name = `${p.firstName} ${p.lastName}`.toLowerCase();
      if (search && !name.includes(search.toLowerCase()) && !p.prcId.toLowerCase().includes(search.toLowerCase())) return false;
      if (divFilter && p.division !== divFilter) return false;
      if (genderFilter && p.gender !== genderFilter) return false;
      return true;
    });
  }, [myPlayers, search, divFilter, genderFilter]);

  const divisionRows = DIVISIONS.map((d) => ({
    division: d,
    players: filtered.filter((p) => p.division === d),
  })).filter((row) => row.players.length > 0);

  return (
    <main className="container-xxl py-5">
      {/* Academy header ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â no back arrow (My Players is a primary nav item) */}
      <div className="row align-items-end mb-5 g-4">
        <div className="col-lg-8">
          <span className="badge-gold mb-3 d-inline-block">My Academy</span>
          <h1 className="editorial-header display-4 fw-900 text-dark-green">
            {academy?.name ?? session.academyName}
          </h1>
          <div className="d-flex flex-wrap gap-3 align-items-center mt-2">
            {academy?.location && (
              <span className="text-muted fw-bold fs-8">
                <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '0.9rem' }}>location_on</span>
                {academy.location}
              </span>
            )}
            {academy?.rep && (
              <span className="text-muted fw-bold fs-8">
                <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '0.9rem' }}>person</span>
                {academy.rep}
              </span>
            )}
          </div>
        </div>
        <div className="col-lg-4 text-lg-end d-flex flex-wrap gap-2 justify-content-lg-end">
          <Link
            href={`/team-sheet?academyId=${session.academyId}`}
            target="_blank"
            className="btn btn-light border fw-bold px-3 py-2 fs-8 text-uppercase"
            style={{ borderRadius: 10 }}
          >
            <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>print</span>
            Print Team Sheet
          </Link>
          {isRegOpen ? (
            <Link href="/players/register" className="btn-gold px-4 py-2 fw-900 text-uppercase fs-8">
              <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>person_add</span>
              Add Player
            </Link>
          ) : (
            <div className="d-inline-flex align-items-center gap-2 bg-warning bg-opacity-10 text-gold fw-bold px-3 py-2 fs-8">
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>lock</span>
              Registration Closed
            </div>
          )}
        </div>
      </div>

      {/* Stat row */}
      <div className="row g-3 mb-4">
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Total Players</div>
            <div className="fs-3 fw-900 text-dark-green">{myPlayers.length}</div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Active</div>
            <div className="fs-3 fw-900 text-mid-green">{myPlayers.filter((p) => p.status === 'Active').length}</div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Pending</div>
            <div className="fs-3 fw-900 text-gold">{myPlayers.filter((p) => p.status === 'Pending').length}</div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Divisions</div>
            <div className="fs-3 fw-900 text-mid-green">{new Set(myPlayers.map((p) => p.division)).size}</div>
          </div>
        </div>
      </div>

      {/* Search/filter bar */}
      <div className="inline-filter-bar">
        <div style={{ flex: '1 1 200px' }}>
          <label className="fs-9 fw-900 text-uppercase opacity-50 mb-1 d-block">Search Players</label>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-transparent border-end-0">
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>search</span>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by name or PRC ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div style={{ minWidth: 130 }}>
          <label className="fs-9 fw-900 text-uppercase opacity-50 mb-1 d-block">Division</label>
          <select
            className="form-select form-select-sm"
            value={divFilter}
            onChange={(e) => setDivFilter(e.target.value as Division | '')}
          >
            <option value="">All</option>
            {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 120 }}>
          <label className="fs-9 fw-900 text-uppercase opacity-50 mb-1 d-block">Gender</label>
          <select
            className="form-select form-select-sm"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as Gender | '')}
          >
            <option value="">All</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        {(search || divFilter || genderFilter) && (
          <button className="btn btn-sm btn-outline-secondary align-self-end"
            onClick={() => { setSearch(''); setDivFilter(''); setGenderFilter(''); }}>
            Clear
          </button>
        )}
      </div>

      {/* Per-division roster */}
      {myPlayers.length === 0 ? (
        <div className="text-center py-5 bg-white">
          <span className="material-symbols-outlined text-muted d-block mb-3" style={{ fontSize: '3rem' }}>groups</span>
          <p className="fw-bold text-muted mb-3">No players registered yet.</p>
          {isRegOpen && (
            <Link href="/players/register" className="btn-gold px-4 py-2 fw-900 text-uppercase fs-8">
              Register First Player
            </Link>
          )}
        </div>
      ) : divisionRows.length === 0 ? (
        <div className="text-center py-4 bg-white">
          <p className="fw-bold text-muted mb-0">No players match your filters.</p>
        </div>
      ) : (
        divisionRows.map(({ division, players }) => (
          <div key={division} className="mb-5">
            <div className="d-flex align-items-center gap-3 mb-3">
              <DivisionBadge division={division} />
              <span className="fw-900 text-dark-green">{players.length} player{players.length !== 1 ? 's' : ''}</span>
              <div className="flex-grow-1 border-bottom border-light" />
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Position</th>
                    <th>Age</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="fs-7">
                  {players.map((player) => {
                    const age = player.dob
                      ? new Date().getFullYear() - new Date(player.dob).getFullYear()
                      : '—';
                    return (
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
                        <td className="text-muted fw-bold">{player.position}</td>
                        <td className="text-muted fw-bold">{age}</td>
                        <td><StatusBadge status={player.status} /></td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-2 flex-wrap">
                            <button
                              className="btn btn-sm btn-light border fw-bold"
                              onClick={() => setViewPlayer(player)}
                              style={{ borderRadius: 8 }}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-sm btn-light border fw-bold"
                              onClick={() => setEditPlayer(player)}
                              style={{ borderRadius: 8 }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-light border fw-bold"
                              onClick={() => setTransferTarget(player)}
                              style={{ borderRadius: 8 }}
                              title="Request transfer to another academy"
                            >
                              Transfer
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger fw-bold"
                              onClick={() => setDeleteTarget(player)}
                              style={{ borderRadius: 8 }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* View modal */}
      {viewPlayer && (
        <PlayerViewModal player={viewPlayer} onClose={() => setViewPlayer(null)} />
      )}

      {/* Edit modal */}
      {editPlayer && (
        <EditPlayerModal
          player={editPlayer}
          academyName={academy?.name ?? session.academyName}
          getCount={(d) => getAcademyPlayerCount(session.academyId, d)}
          onSave={(updates) => {
            updatePlayer(editPlayer.id, updates, { actorId: session.userId, actorName: session.displayName, actorRole: 'member', academyId: session.academyId, academyName: session.academyName });
            setEditPlayer(null);
          }}
          onClose={() => setEditPlayer(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="kpp-modal-backdrop is-open" onClick={() => setDeleteTarget(null)}>
          <div className="kpp-modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="kpp-modal-header">
              <span className="kpp-modal-title">Delete player?</span>
              <button className="kpp-modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div className="kpp-modal-body">
              <p className="fs-8 text-warm-muted mb-0">
                This will permanently remove <strong className="text-dark-green">{deleteTarget.firstName} {deleteTarget.lastName}</strong> ({deleteTarget.prcId}) from your academy. This action cannot be undone.
              </p>
            </div>
            <div className="kpp-modal-footer">
              <button className="kpp-btn kpp-btn--outline" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button
                className="kpp-btn kpp-btn--danger"
                onClick={() => {
                  deletePlayer(deleteTarget.id, { actorId: session.userId, actorName: session.displayName, actorRole: 'member', academyId: session.academyId, academyName: session.academyName });
                  setDeleteTarget(null);
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer request modal */}
      {transferTarget && (
        <TransferModal
          player={transferTarget}
          academies={data.academies.filter((a) => a.id !== session.academyId)}
          onClose={() => setTransferTarget(null)}
          onSubmit={(toId, toName, reason) => {
            const req: TransferRequest = {
              id: `t${Date.now()}`,
              playerId:         transferTarget.id,
              playerName:       `${transferTarget.firstName} ${transferTarget.lastName}`,
              fromAcademyId:    session.academyId,
              fromAcademyName:  session.academyName,
              toAcademyId:      toId,
              toAcademyName:    toName,
              requestedBy:      session.displayName,
              requestedAt:      new Date().toISOString(),
              status:           'Pending',
              reason,
            };
            createTransfer(req, { actorId: session.userId, actorName: session.displayName, actorRole: 'member', academyId: session.academyId, academyName: session.academyName });
            setTransferTarget(null);
          }}
        />
      )}
    </main>
  );
}

function TransferModal({
  player, academies, onClose, onSubmit,
}: {
  player: Player;
  academies: { id: string; name: string }[];
  onClose: () => void;
  onSubmit: (toId: string, toName: string, reason: string) => void;
}) {
  const [toId, setToId]   = useState('');
  const [reason, setReason] = useState('');
  const target = academies.find((a) => a.id === toId);
  return (
    <div className="kpp-modal-backdrop is-open" onClick={onClose}>
      <div className="kpp-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="kpp-modal-header">
          <span className="kpp-modal-title">Request Transfer</span>
          <button className="kpp-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="kpp-modal-body">
          <p className="fs-8 text-warm-muted mb-3">
            Submit a transfer request for <strong className="text-dark-green">{player.firstName} {player.lastName}</strong> to another academy. The request will be reviewed by an administrator.
          </p>
          <label className="form-label fw-bold fs-8">Receiving Academy *</label>
          <select className="form-select mb-3" value={toId} onChange={(e) => setToId(e.target.value)}>
            <option value="">Select academy…</option>
            {academies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <label className="form-label fw-bold fs-8">Reason (optional)</label>
          <textarea className="form-control" rows={3} value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why is this transfer being requested?" />
        </div>
        <div className="kpp-modal-footer">
          <button className="kpp-btn kpp-btn--outline" onClick={onClose}>Cancel</button>
          <button
            className="kpp-btn kpp-btn--primary"
            disabled={!toId}
            onClick={() => target && onSubmit(target.id, target.name, reason.trim())}
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
