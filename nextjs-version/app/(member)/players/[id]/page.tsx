'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';
import { StatusBadge, DivisionBadge, GenderBadge, EditPlayerModal } from '@/components/ui';

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center p-3 bg-white border-0">
      <div className="fs-3 fw-900 text-dark-green">{value}</div>
      <div className="fs-9 fw-900 text-uppercase opacity-50">{label}</div>
    </div>
  );
}

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

export default function PlayerProfilePage() {
  const params = useParams<{ id: string }>();
  const { session } = useSession();
  const { data, approvePlayer, rejectPlayer, updatePlayer, getAcademyPlayerCount } = useAppData();

  const [showReject, setShowReject] = useState(false);
  const [showEdit, setShowEdit]     = useState(false);

  const player = data.players.find((p) => p.id === params.id);

  if (!player) {
    return (
      <main className="container-xxl py-5">
        <div className="text-center py-5">
          <span className="material-symbols-outlined text-muted" style={{ fontSize: '4rem' }}>person_off</span>
          <h2 className="fw-900 text-dark-green mt-3">Player not found</h2>
          <Link href="/players" className="btn-gold px-4 py-2 mt-3 d-inline-block fw-900 text-uppercase fs-8">
            Back to Players
          </Link>
        </div>
      </main>
    );
  }

  const isAdmin      = session?.role === 'admin';
  const isOwnAcademy = player.academyId === session?.academyId;
  /* Members can edit only their own academy players; admins never edit directly */
  const canEdit      = !isAdmin && isOwnAcademy;
  const season       = player.seasons?.[0];

  function handleReject(note: string) {
    if (!player) return;
    rejectPlayer(player.id, note, session?.displayName ?? 'Admin');
    setShowReject(false);
  }

  return (
    <main className="container-xxl py-5">
      {/* Back */}
      <div className="mb-4">
        <Link href="/players" className="text-muted text-decoration-none fw-bold fs-8 text-uppercase">
          <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>arrow_back</span>
          All Players
        </Link>
      </div>

      <div className="row g-5">
        {/* Left: photo + id card */}
        <div className="col-lg-4">
          {player.photo ? (
            <img src={player.photo} alt={`${player.firstName} ${player.lastName}`} className="player-hero-img mb-4" />
          ) : (
            <div
              className="mb-4 d-flex align-items-center justify-content-center bg-light"
              style={{ aspectRatio: '4/5', borderRadius: 12 }}
            >
              <span className="material-symbols-outlined text-muted" style={{ fontSize: '5rem' }}>person</span>
            </div>
          )}

          {/* ID Card */}
          <div className="id-card">
            <div className="fs-9 fw-900 text-uppercase mb-1" style={{ color: 'var(--accent-color)', letterSpacing: '0.1em' }}>
              PRC Player ID
            </div>
            <div className="fw-900 text-white fs-6 mb-3" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              {player.prcId}
            </div>
            <div className="row g-2 fs-9">
              <div className="col-6">
                <div style={{ color: 'rgba(255,255,255,0.5)' }}>DOB</div>
                <div className="text-white fw-bold">{player.dob}</div>
              </div>
              <div className="col-6">
                <div style={{ color: 'rgba(255,255,255,0.5)' }}>Nationality</div>
                <div className="text-white fw-bold">{player.nationality || '–'}</div>
              </div>
              {player.coach && (
                <div className="col-12 mt-2 pt-2 border-top border-white border-opacity-10">
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>Coach</div>
                  <div className="text-white fw-bold">{player.coach.name}</div>
                </div>
              )}
              {player.manager && (
                <div className="col-12">
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>Manager</div>
                  <div className="text-white fw-bold">{player.manager.name}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div className="col-lg-8">
          <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
            <div>
              <h1 className="editorial-header display-5 fw-900 text-dark-green mb-1">
                {player.firstName} <span className="text-mid-green">{player.lastName}</span>
              </h1>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <DivisionBadge division={player.division} />
                <GenderBadge gender={player.gender} />
                <span className="badge-elite">{player.position}</span>
                <StatusBadge status={player.status} />
              </div>
              <div className="text-muted fw-bold fs-8">{player.academy}</div>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {/* Edit: member own academy only – opens modal */}
              {canEdit && (
                <button className="btn btn-light rounded-0 border fw-bold fs-8" onClick={() => setShowEdit(true)}>
                  <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>edit</span>
                  Edit
                </button>
              )}
              {/* Approve / Reject: admin only */}
              {isAdmin && player.status === 'Pending' && (
                <>
                  <button className="btn btn-success rounded-0 fw-bold fs-8" onClick={() => approvePlayer(player.id)}>
                    <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>check_circle</span>
                    Approve
                  </button>
                  <button className="btn btn-danger rounded-0 fw-bold fs-8" onClick={() => setShowReject(true)}>
                    <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>cancel</span>
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Rejection note */}
          {player.rejectionNote && (
            <div className="alert alert-danger mb-4">
              <div className="fw-900 mb-1">Rejection Note</div>
              <div>{player.rejectionNote.note}</div>
              <div className="fs-9 mt-1 opacity-75">by {player.rejectionNote.by} on {player.rejectionNote.date}</div>
            </div>
          )}

          {/* Season stats */}
          {season && (
            <>
              <h6 className="fw-900 text-uppercase fs-8 text-dark-green mb-3">2023/24 Season</h6>
              <div className="row g-2 mb-4">
                <div className="col-3"><StatBox label="Matches" value={season.matches} /></div>
                <div className="col-3"><StatBox label="Goals" value={season.goals} /></div>
                <div className="col-3"><StatBox label="Assists" value={season.assists} /></div>
                <div className="col-3"><StatBox label="Rating" value={season.rating?.toFixed(1) ?? '–'} /></div>
                {typeof season.cleanSheets === 'number' && season.cleanSheets > 0 && (
                  <div className="col-3"><StatBox label="Clean Sheets" value={season.cleanSheets} /></div>
                )}
                {typeof season.tackles === 'number' && (
                  <div className="col-3"><StatBox label="Tackles" value={season.tackles} /></div>
                )}
              </div>
            </>
          )}

          {/* Medical */}
          {player.medical && (
            <div className="bg-white p-4 mt-2">
              <h6 className="fw-900 text-uppercase fs-8 text-dark-green mb-3">Medical Clearance</h6>
              <div className="row g-3 fs-8">
                <div className="col-sm-4">
                  <div className="text-muted fw-bold text-uppercase fs-9 mb-1">Status</div>
                  <span className={`badge fw-bold ${
                    player.medical.clearance === 'Cleared' ? 'bg-success' :
                    player.medical.clearance === 'Restricted' ? 'bg-danger' : 'bg-warning text-dark'
                  }`}>
                    {player.medical.clearance}
                  </span>
                </div>
                {player.medical.bloodType && (
                  <div className="col-sm-4">
                    <div className="text-muted fw-bold text-uppercase fs-9 mb-1">Blood Type</div>
                    <div className="fw-bold">{player.medical.bloodType}</div>
                  </div>
                )}
                {player.medical.height && (
                  <div className="col-sm-4">
                    <div className="text-muted fw-bold text-uppercase fs-9 mb-1">Height</div>
                    <div className="fw-bold">{player.medical.height}</div>
                  </div>
                )}
                {player.medical.weight && (
                  <div className="col-sm-4">
                    <div className="text-muted fw-bold text-uppercase fs-9 mb-1">Weight</div>
                    <div className="fw-bold">{player.medical.weight}</div>
                  </div>
                )}
                {player.medical.lastCheckup && (
                  <div className="col-sm-4">
                    <div className="text-muted fw-bold text-uppercase fs-9 mb-1">Last Checkup</div>
                    <div className="fw-bold">{player.medical.lastCheckup}</div>
                  </div>
                )}
                {player.medical.conditions && (
                  <div className="col-12">
                    <div className="text-muted fw-bold text-uppercase fs-9 mb-1">Notes</div>
                    <div className="fw-bold">{player.medical.conditions}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showReject && (
        <RejectModal
          playerName={`${player.firstName} ${player.lastName}`}
          onConfirm={handleReject}
          onClose={() => setShowReject(false)}
        />
      )}

      {showEdit && (
        <EditPlayerModal
          player={player}
          academyName={player.academy}
          getCount={(d) => getAcademyPlayerCount(player.academyId, d)}
          onSave={(updates) => {
            updatePlayer(player.id, updates);
            setShowEdit(false);
          }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </main>
  );
}
