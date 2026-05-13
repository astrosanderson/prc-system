'use client';

import Link from 'next/link';
import type { Player } from '@/lib/types';
import { StatusBadge, DivisionBadge, GenderBadge } from '@/components/ui';
import { useSession } from '@/context/SessionContext';

function calcAge(dob: string): number {
  if (!dob) return 0;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export interface PlayerViewModalProps {
  player: Player | null;
  onClose: () => void;
  /** When provided and player is Pending, an Approve button appears. */
  onApprove?: (id: string) => void;
  /** When provided and player is Pending, a Reject button appears. */
  onReject?: (player: Player) => void;
}

export function PlayerViewModal({ player, onClose, onApprove, onReject }: PlayerViewModalProps) {
  const { session } = useSession();
  const isAdmin = session?.role === 'admin';
  if (!player) return null;

  const age          = player.dob ? calcAge(player.dob) : '–';
  const isPending    = player.status === 'Pending';
  const showActions  = isPending && (onApprove || onReject);

  return (
    <div className="kpp-modal-backdrop is-open" onClick={onClose}>
      <div
        className="kpp-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 540 }}
      >
        {/* Header */}
        <div className="kpp-modal-header">
          <span className="kpp-modal-title">Player Profile</span>
          <button className="kpp-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="kpp-modal-body p-0" style={{ overflowY: 'auto' }}>
          {/* Photo */}
          {player.photo ? (
            <img
              src={player.photo}
              alt={`${player.firstName} ${player.lastName}`}
              className="player-modal-photo"
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: 180, background: 'linear-gradient(135deg, #f5f3ee 0%, #edeeed 100%)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'rgba(27, 58, 45,0.25)' }}>
                person
              </span>
            </div>
          )}

          <div className="p-4">
            {/* Name + badges */}
            <div className="mb-4">
              <h4 className="fw-900 text-dark-green mb-2">
                {player.firstName} <span className="text-mid-green">{player.lastName}</span>
              </h4>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <DivisionBadge division={player.division} />
                <GenderBadge gender={player.gender} />
                <span className="badge-elite">{player.position}</span>
                <StatusBadge status={player.status} />
              </div>
            </div>

            {/* Details grid */}
            <div className="row g-3 fs-8">
              <div className="col-6">
                <div className="fw-900 text-uppercase opacity-50 mb-1" style={{ fontSize: '0.65rem' }}>Academy</div>
                <div className="fw-bold text-dark-green">{player.academy}</div>
              </div>
              <div className="col-6">
                <div className="fw-900 text-uppercase opacity-50 mb-1" style={{ fontSize: '0.65rem' }}>Age</div>
                <div className="fw-bold">{age} years</div>
              </div>
              <div className="col-6">
                <div className="fw-900 text-uppercase opacity-50 mb-1" style={{ fontSize: '0.65rem' }}>Date of Birth</div>
                <div className="fw-bold">{player.dob || '–'}</div>
              </div>
              <div className="col-6">
                <div className="fw-900 text-uppercase opacity-50 mb-1" style={{ fontSize: '0.65rem' }}>Nationality</div>
                <div className="fw-bold">{player.nationality || '–'}</div>
              </div>
              <div className="col-6">
                <div className="fw-900 text-uppercase opacity-50 mb-1" style={{ fontSize: '0.65rem' }}>Player Grade</div>
                <div className="fw-bold">{player.grade || '–'}</div>
              </div>
              <div className="col-6">
                <div className="fw-900 text-uppercase opacity-50 mb-1" style={{ fontSize: '0.65rem' }}>Jersey #</div>
                <div className="fw-bold">{player.jerseyNumber ?? '–'}</div>
              </div>
              <div className="col-12">
                <div className="fw-900 text-uppercase opacity-50 mb-1" style={{ fontSize: '0.65rem' }}>PRC Registration ID</div>
                <div className="fw-bold text-dark-green" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  {player.prcId}
                </div>
              </div>
            </div>

            {/* Documents */}
            {player.documents && player.documents.length > 0 && (
              <div className="mt-4">
                <div className="fw-900 text-uppercase opacity-50 mb-2" style={{ fontSize: '0.65rem' }}>Documents on file</div>
                <div className="d-flex flex-column gap-2">
                  {player.documents.map((d) => (
                    <div key={d.id} className="d-flex align-items-center gap-2 stat-tile" style={{ padding: '0.5rem 0.7rem' }}>
                      <span className="material-symbols-outlined text-warm-muted" style={{ fontSize: '1rem' }}>description</span>
                      <span className="fw-bold text-dark-green fs-9 text-uppercase" style={{ minWidth: 140 }}>{d.type}</span>
                      <span className="text-muted fs-9 flex-grow-1 text-truncate">{d.fileName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rejection note */}
            {player.rejectionNote && (
              <div
                className="mt-4 p-3 fs-8"
                style={{ background: 'rgba(220,53,69,0.06)', border: '1px solid rgba(220,53,69,0.18)', borderRadius: 10 }}
              >
                <div className="fw-900 mb-1" style={{ color: '#b3273a' }}>Rejection Note</div>
                <div style={{ color: '#5a1924' }}>{player.rejectionNote.note}</div>
                <div className="opacity-75 mt-1 fs-9" style={{ color: '#5a1924' }}>
                  by {player.rejectionNote.by} · {player.rejectionNote.date}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="kpp-modal-footer">
          <button className="kpp-btn kpp-btn--outline" onClick={onClose}>Close</button>
          {isAdmin && (
            <Link
              href={`/admin/player-card/${player.id}`}
              target="_blank"
              className="kpp-btn kpp-btn--gold"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>print</span>
              Print Player Card
            </Link>
          )}
          {showActions && onReject && (
            <button
              className="kpp-btn kpp-btn--danger"
              onClick={() => onReject(player)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>cancel</span>
              Reject
            </button>
          )}
          {showActions && onApprove && (
            <button
              className="kpp-btn kpp-btn--success"
              onClick={() => { onApprove(player.id); onClose(); }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>check_circle</span>
              Approve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
