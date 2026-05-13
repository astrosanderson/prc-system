'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';
import { Avatar, StatusBadge, DivisionBadge, GenderBadge, PlayerViewModal, EditPlayerModal } from '@/components/ui';
import { DIVISIONS, GENDERS } from '@/lib/types';
import type { PlayerStatus, Division, Gender, Player } from '@/lib/types';

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
      <div className="kpp-modal kpp-modal--light" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="kpp-modal-header">
          <span className="kpp-modal-title">Reject Registration</span>
          <button className="kpp-modal-close" onClick={onClose}>ÃƒÂ¢Ã…“Ã¢â‚¬Â¢</button>
        </div>
        <div className="kpp-modal-body">
          <p className="text-muted mb-3 fs-8">
            Rejecting <strong className="text-dark-green">{playerName}</strong>. A feedback comment is required.
          </p>
          <label className="fw-bold fs-8 text-uppercase opacity-75 mb-2 d-block">Rejection Reason *</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Explain why this registration is being rejected…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="kpp-modal-footer">
          <button className="kpp-btn kpp-btn--outline" onClick={onClose}>Cancel</button>
          <button
            className="kpp-btn kpp-btn--danger"
            onClick={() => note.trim() && onConfirm(note.trim())}
            disabled={!note.trim()}
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AllPlayersPage() {
  const { session } = useSession();
  const { data, approvePlayer, rejectPlayer, updatePlayer, getAcademyPlayerCount } = useAppData();

  const [search, setSearch]           = useState('');
  const [divisionFilter, setDivision] = useState<Division | ''>('');
  const [academyFilter, setAcademy]   = useState('');
  const [statusFilter, setStatus]     = useState<PlayerStatus | ''>('');
  const [genderFilter, setGender]     = useState<Gender | ''>('');
  const [rejectTarget, setRejectTarget] = useState<{ id: string; name: string } | null>(null);
  const [viewPlayer, setViewPlayer]   = useState<Player | null>(null);
  const [editPlayer, setEditPlayer]   = useState<Player | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const isAdmin  = session?.role === 'admin';
  const myAcademy = session?.academyId ?? '';

  const filtered = useMemo(() => {
    return data.players.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      if (search && !fullName.includes(search.toLowerCase()) && !p.prcId.toLowerCase().includes(search.toLowerCase())) return false;
      if (divisionFilter && p.division !== divisionFilter) return false;
      if (academyFilter && p.academyId !== academyFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (genderFilter && p.gender !== genderFilter) return false;
      return true;
    });
  }, [data.players, search, divisionFilter, academyFilter, statusFilter, genderFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const pendingCount = data.players.filter((p) => p.status === 'Pending').length;
  const activeCount  = data.players.filter((p) => p.status === 'Active').length;

  function clearFilters() {
    setSearch(''); setDivision(''); setAcademy(''); setStatus(''); setGender(''); setPage(1);
  }

  function handleReject(note: string) {
    if (!rejectTarget) return;
    rejectPlayer(rejectTarget.id, note, session?.displayName ?? 'Admin');
    setRejectTarget(null);
  }

  return (
    <main className="container-xxl py-5">
      {/* Header */}
      <div className="row align-items-end mb-5 g-4">
        <div className="col-lg-8">
          <span className="badge-gold mb-3 d-inline-block">
            {isAdmin ? 'League Management' : 'Player Directory'}
          </span>
          <h1 className="editorial-header display-4 fw-900 text-dark-green">
            All <span className="text-warm-muted">Players</span>
          </h1>
        </div>
        <div className="col-lg-4 text-lg-end">
          {session?.role === 'member' && (
            <Link href="/players/register" className="btn-gold px-4 py-2 fw-900 text-uppercase fs-8">
              <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>person_add</span>
              Add Player
            </Link>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Total Players</div>
            <div className="fs-3 fw-900 text-dark-green">{data.players.length}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Active</div>
            <div className="fs-3 fw-900 text-mid-green">{activeCount}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Pending Approval</div>
            <div className="fs-3 fw-900 text-gold">{pendingCount}</div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-3 mb-4 d-flex flex-wrap gap-2 align-items-end">
        <div className="flex-grow-1" style={{ minWidth: 200 }}>
          <label className="fs-9 fw-900 text-uppercase opacity-50 mb-1 d-block">Search</label>
          <div className="input-group input-group-sm">
            <span className="input-group-text border-end-0 bg-transparent border-secondary border-opacity-25">
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>search</span>
            </span>
            <input
              type="text"
              className="form-control border-start-0 border-secondary border-opacity-25"
              placeholder="Search by name or PRC ID…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        <div style={{ minWidth: 130 }}>
          <label className="fs-9 fw-900 text-uppercase opacity-50 mb-1 d-block">Division</label>
          <select
            className="form-select form-select-sm border-secondary border-opacity-25"
            value={divisionFilter}
            onChange={(e) => { setDivision(e.target.value as Division | ''); setPage(1); }}
          >
            <option value="">All</option>
            {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 180 }}>
          <label className="fs-9 fw-900 text-uppercase opacity-50 mb-1 d-block">Academy</label>
          <select
            className="form-select form-select-sm border-secondary border-opacity-25"
            value={academyFilter}
            onChange={(e) => { setAcademy(e.target.value); setPage(1); }}
          >
            <option value="">All Academies</option>
            {data.academies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 130 }}>
          <label className="fs-9 fw-900 text-uppercase opacity-50 mb-1 d-block">Status</label>
          <select
            className="form-select form-select-sm border-secondary border-opacity-25"
            value={statusFilter}
            onChange={(e) => { setStatus(e.target.value as PlayerStatus | ''); setPage(1); }}
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div style={{ minWidth: 120 }}>
          <label className="fs-9 fw-900 text-uppercase opacity-50 mb-1 d-block">Gender</label>
          <select
            className="form-select form-select-sm border-secondary border-opacity-25"
            value={genderFilter}
            onChange={(e) => { setGender(e.target.value as Gender | ''); setPage(1); }}
          >
            <option value="">All</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        {(search || divisionFilter || academyFilter || statusFilter || genderFilter) && (
          <button className="btn btn-sm btn-outline-secondary align-self-end" onClick={clearFilters}>
            <span className="material-symbols-outlined align-middle" style={{ fontSize: '0.9rem' }}>close</span>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Academy</th>
              <th>Division</th>
              <th>Position</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="fs-7">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-5 fw-bold">No players found.</td>
              </tr>
            ) : (
              paginated.map((player) => {
                const isOwnAcademy = player.academyId === myAcademy;
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
                    <td className="text-muted fw-bold">{player.academy}</td>
                    <td><DivisionBadge division={player.division} /></td>
                    <td className="text-muted">{player.position}</td>
                    <td><StatusBadge status={player.status} /></td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2 flex-wrap">
                        {/* View opens modal for everyone */}
                        <button
                          className="btn btn-sm btn-light rounded-0 border fw-bold"
                          onClick={() => setViewPlayer(player)}
                        >
                          View
                        </button>
                        {/* Edit: only member for own academy (never admin) */}
                        {!isAdmin && isOwnAcademy && (
                          <button
                            className="btn btn-sm btn-light rounded-0 border fw-bold"
                            onClick={() => setEditPlayer(player)}
                          >
                            Edit
                          </button>
                        )}
                        {/* Approve/Reject: admin only */}
                        {isAdmin && player.status === 'Pending' && (
                          <>
                            <button
                              className="btn btn-sm btn-success rounded-0 fw-bold"
                              onClick={() => approvePlayer(player.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-danger rounded-0 fw-bold"
                              onClick={() => setRejectTarget({ id: player.id, name: `${player.firstName} ${player.lastName}` })}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center bg-light p-3 mt-1">
        <span className="fs-8 fw-bold text-uppercase opacity-50">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} Ãƒâ€šÃ‚· Page {page} of {totalPages}
        </span>
        <div className="d-flex gap-3">
          <button
            className="btn btn-link text-dark p-0 text-decoration-none fw-bold text-uppercase fs-8 border-bottom border-dark border-2"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <button
            className="btn btn-link text-mid-green p-0 text-decoration-none fw-bold text-uppercase fs-8 border-bottom border-secondary border-2"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next Page
          </button>
        </div>
      </div>

      {/* Player view modal ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â admin can approve/reject inline */}
      {viewPlayer && (
        <PlayerViewModal
          player={viewPlayer}
          onClose={() => setViewPlayer(null)}
          onApprove={isAdmin ? (id) => { approvePlayer(id); setViewPlayer(null); } : undefined}
          onReject={isAdmin ? (p) => {
            setRejectTarget({ id: p.id, name: `${p.firstName} ${p.lastName}` });
            setViewPlayer(null);
          } : undefined}
        />
      )}

      {/* Player edit modal (member, own academy only) */}
      {editPlayer && (
        <EditPlayerModal
          player={editPlayer}
          academyName={editPlayer.academy}
          getCount={(d) => getAcademyPlayerCount(editPlayer.academyId, d)}
          onSave={(updates) => {
            updatePlayer(editPlayer.id, updates);
            setEditPlayer(null);
          }}
          onClose={() => setEditPlayer(null)}
        />
      )}

      {/* Rejection modal */}
      {rejectTarget && (
        <RejectModal
          playerName={rejectTarget.name}
          onConfirm={handleReject}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </main>
  );
}
