'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';
import { DivisionBadge } from '@/components/ui';
import type { Academy, Division } from '@/lib/types';
import { DIVISIONS } from '@/lib/types';

function AcademyModal({
  academy,
  onSave,
  onClose,
  existingMemberIds,
  users,
}: {
  academy: Partial<Academy> | null;
  onSave: (data: Partial<Academy>) => void;
  onClose: () => void;
  existingMemberIds: string[];
  users: import('@/lib/types').MockUser[];
}) {
  const [form, setForm] = useState({
    name:     academy?.name     ?? '',
    location: academy?.location ?? '',
    rep:      academy?.rep      ?? '',
    email:    academy?.email    ?? '',
    assignedMemberId: academy?.assignedMemberId ?? '',
    divisions: academy?.divisions ?? [] as Division[],
  });

  function toggleDivision(d: Division) {
    setForm((prev) => ({
      ...prev,
      divisions: prev.divisions.includes(d)
        ? prev.divisions.filter((x) => x !== d)
        : [...prev.divisions, d],
    }));
  }

  const availableMembers = users.filter(
    (u) => u.role === 'member' && (!existingMemberIds.includes(u.id) || u.id === academy?.assignedMemberId)
  );

  function handleSave() {
    if (!form.name.trim() || !form.location.trim()) return;
    onSave({ ...form });
  }

  return (
    <div className="kpp-modal-backdrop is-open" onClick={onClose}>
      <div className="kpp-modal kpp-modal--light kpp-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="kpp-modal-header">
          <span className="kpp-modal-title">{academy?.id ? 'Edit Academy' : 'Create Academy'}</span>
          <button className="kpp-modal-close" onClick={onClose}>ÃƒÂ¢Ã…“Ã¢â‚¬Â¢</button>
        </div>
        <div className="kpp-modal-body">
          <div className="row g-3">
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Academy Name *</label>
              <input className="form-control" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Location *</label>
              <input className="form-control" value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Representative</label>
              <input className="form-control" value={form.rep}
                onChange={(e) => setForm((p) => ({ ...p, rep: e.target.value }))} />
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Email</label>
              <input type="email" className="form-control" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Assigned Member</label>
              <select className="form-select" value={form.assignedMemberId}
                onChange={(e) => setForm((p) => ({ ...p, assignedMemberId: e.target.value }))}>
                <option value="">ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Unassigned ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â</option>
                {availableMembers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold fs-8">Active Divisions</label>
              <div className="d-flex flex-wrap gap-2 mt-1">
                {DIVISIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDivision(d)}
                    className={`btn btn-sm rounded-pill fw-bold px-3 ${
                      form.divisions.includes(d)
                        ? 'btn-primary'
                        : 'btn-outline-secondary'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="kpp-modal-footer">
          <button className="kpp-btn kpp-btn--outline" onClick={onClose}>Cancel</button>
          <button className="kpp-btn kpp-btn--primary" onClick={handleSave}
            disabled={!form.name.trim() || !form.location.trim()}>
            {academy?.id ? 'Save Changes' : 'Create Academy'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AcademiesPage() {
  const { session } = useSession();
  const { data, addAcademy, updateAcademy } = useAppData();

  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState<Partial<Academy> | null | 'new'>(null);

  const isAdmin = session?.role === 'admin';

  const filtered = data.academies.filter((a) =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase())
  );

  const assignedIds = data.academies.map((a) => a.assignedMemberId).filter(Boolean) as string[];

  function handleSave(formData: Partial<Academy>) {
    if (modal && typeof modal === 'object' && modal.id) {
      updateAcademy(modal.id, formData);
    } else {
      const newId = `ac${Date.now()}`;
      addAcademy({
        id: newId,
        name: formData.name!,
        location: formData.location!,
        rep: formData.rep,
        email: formData.email,
        assignedMemberId: formData.assignedMemberId,
        divisions: formData.divisions ?? [],
        playerCount: 0,
        divisionCounts: {},
      });
    }
    setModal(null);
  }

  const totalPlayers = data.players.length;

  return (
    <main className="container-xxl py-5">
      {/* Header */}
      <div className="row align-items-end mb-5 g-4">
        <div className="col-lg-8">
          <span className="badge-gold mb-3 d-inline-block">Academy Directory</span>
          <h1 className="editorial-header display-4 fw-900 text-dark-green">
            Academy <span className="text-warm-muted">Database</span>
          </h1>
        </div>
        {isAdmin && (
          <div className="col-lg-4 text-lg-end">
            <button className="btn-gold px-4 py-2 fw-900 text-uppercase fs-8" onClick={() => setModal('new')}>
              <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>add</span>
              Create Academy
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Academies</div>
            <div className="fs-3 fw-900 text-dark-green">{data.academies.length}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Registered Players</div>
            <div className="fs-3 fw-900 text-mid-green">{totalPlayers}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Active Divisions</div>
            <div className="fs-3 fw-900 text-gold">
              {new Set(data.academies.flatMap((a) => a.divisions ?? [])).size}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3 mb-4">
        <div className="input-group input-group-sm" style={{ maxWidth: 340 }}>
          <span className="input-group-text bg-transparent border-end-0">
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>search</span>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search academies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of bordered cards */}
      <div className="row g-4">
        {filtered.map((academy) => {
          const myAcademy   = academy.id === session?.academyId;
          const playerCount = data.players.filter((p) => p.academyId === academy.id).length;

          const memberName = data.users.find((u) => u.id === academy.assignedMemberId)?.name;

          return (
            <div key={academy.id} className="col-sm-6 col-lg-4">
              <div className="academy-border-card h-100 d-flex flex-column">
                {/* Card header */}
                <div className="p-4">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: 56, height: 56, borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(27, 58, 45,0.08) 0%, rgba(201, 168, 76,0.12) 100%)',
                      }}
                    >
                      <span className="material-symbols-outlined text-dark-green" style={{ fontSize: '1.7rem' }}>sports_soccer</span>
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-900 text-dark-green text-truncate" style={{ fontSize: '1rem' }}>{academy.name}</div>
                      <div className="fs-8 text-muted fw-bold mt-1">
                        <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '0.85rem' }}>location_on</span>
                        {academy.location}
                      </div>
                    </div>
                    {myAcademy && <span className="badge-gold fs-9 flex-shrink-0">Mine</span>}
                  </div>
                </div>

                <div className="academy-card-divider" />

                {/* Card body */}
                <div className="p-4 flex-grow-1 d-flex flex-column">
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Players</div>
                      <div className="fs-4 fw-900 text-dark-green">{playerCount}</div>
                    </div>
                    <div className="col-6">
                      <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Representative</div>
                      <div className="fs-8 fw-bold text-truncate" title={memberName || academy.rep || 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â'}>
                        {memberName || academy.rep || <span className="text-muted">ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â</span>}
                      </div>
                    </div>
                  </div>

                  {/* Divisions */}
                  <div className="mb-3">
                    <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Divisions</div>
                    {academy.divisions && academy.divisions.length > 0 ? (
                      <div className="d-flex flex-wrap gap-1">
                        {academy.divisions.map((d) => <DivisionBadge key={d} division={d} />)}
                      </div>
                    ) : (
                      <div className="fs-8 text-muted">No divisions assigned</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2 mt-auto pt-2">
                    <Link
                      href={myAcademy ? '/academies/my' : `/academies/${academy.id}`}
                      className="btn btn-sm btn-light border fw-bold flex-grow-1 text-center"
                      style={{ borderRadius: 8 }}
                    >
                      {myAcademy ? 'My Roster' : 'View Players'}
                    </Link>
                    {isAdmin && (
                      <button
                        className="btn btn-sm btn-light border fw-bold"
                        onClick={() => setModal(academy)}
                        title="Edit Academy"
                        style={{ borderRadius: 8 }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>edit</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-12 text-center text-muted py-5 fw-bold">No academies found.</div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <AcademyModal
          academy={modal === 'new' ? {} : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          existingMemberIds={assignedIds}
          users={data.users}
        />
      )}
    </main>
  );
}
