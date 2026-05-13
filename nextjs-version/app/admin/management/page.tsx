'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppData } from '@/context/AppDataContext';
import { useSession } from '@/context/SessionContext';
import type { RegistrationWindow, Division, MockUser } from '@/lib/types';
import { DIVISIONS } from '@/lib/types';

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ User Modal (add/edit admin or member) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
function UserModal({
  user,
  role,
  onSave,
  onClose,
  academies,
}: {
  user: Partial<MockUser> | null;
  role: 'admin' | 'member';
  onSave: (u: Partial<MockUser>) => void;
  onClose: () => void;
  academies: { id: string; name: string }[];
}) {
  const [form, setForm] = useState({
    name:      user?.name      ?? '',
    email:     user?.email     ?? '',
    academyId: user?.academyId ?? '',
  });

  function handleSave() {
    if (!form.name.trim() || !form.email.trim()) return;
    const academy = academies.find((a) => a.id === form.academyId);
    onSave({
      name:        form.name.trim(),
      email:       form.email.trim(),
      role,
      academyId:   form.academyId,
      academyName: academy?.name ?? '',
    });
  }

  return (
    <div className="kpp-modal-backdrop is-open" onClick={onClose}>
      <div className="kpp-modal kpp-modal--light" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="kpp-modal-header">
          <span className="kpp-modal-title">
            {user?.id ? 'Edit' : 'Add'} {role === 'admin' ? 'Admin' : 'Member'}
          </span>
          <button className="kpp-modal-close" onClick={onClose}>ÃƒÂ¢Ã…“Ã¢â‚¬Â¢</button>
        </div>
        <div className="kpp-modal-body">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-bold fs-8">Full Name *</label>
              <input className="form-control" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold fs-8">Email *</label>
              <input type="email" className="form-control" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            {role === 'member' && (
              <div className="col-12">
                <label className="form-label fw-bold fs-8">Assigned Academy</label>
                <select className="form-select" value={form.academyId}
                  onChange={(e) => setForm((p) => ({ ...p, academyId: e.target.value }))}>
                  <option value="">ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Unassigned ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â</option>
                  {academies.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        <div className="kpp-modal-footer">
          <button className="kpp-btn kpp-btn--outline" onClick={onClose}>Cancel</button>
          <button className="kpp-btn kpp-btn--primary" onClick={handleSave}
            disabled={!form.name.trim() || !form.email.trim()}>
            {user?.id ? 'Save Changes' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Registration Window Panel ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
function RegistrationWindowPanel() {
  const { data, setRegistrationWindow } = useAppData();
  const [form, setForm] = useState<RegistrationWindow>({ ...data.registrationWindow });
  const [saved, setSaved] = useState(false);

  function flash() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  function handleToggle() {
    const updated = { ...form, isOpen: !form.isOpen };
    setForm(updated);
    setRegistrationWindow(updated);
    flash();
  }

  function handleSaveDates() {
    setRegistrationWindow(form);
    flash();
  }

  return (
    <div className="bg-white p-4 mb-4 border" style={{ borderColor: 'rgba(27, 58, 45,0.1)' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="fw-900 text-uppercase text-dark-green fs-7 mb-0">Registration Window</h5>
        <div className="d-flex align-items-center gap-3">
          {saved && (
            <span className="text-mid-green fw-bold fs-8">
              <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '0.9rem' }}>check_circle</span>
              Saved
            </span>
          )}
          <span className={`badge fs-8 fw-bold px-3 py-2 ${data.registrationWindow.isOpen ? 'bg-success' : 'bg-danger'}`}>
            {data.registrationWindow.isOpen ? 'OPEN' : 'CLOSED'}
          </span>
          <button
            onClick={handleToggle}
            className={`btn btn-sm fw-bold rounded-0 ${data.registrationWindow.isOpen ? 'btn-danger' : 'btn-success'}`}
          >
            {data.registrationWindow.isOpen ? 'Close Registration' : 'Open Registration'}
          </button>
        </div>
      </div>

      {data.registrationWindow.isOpen ? (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-4">
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>lock_open</span>
          <span className="fw-bold fs-8">Members can currently register and add players.</span>
        </div>
      ) : (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-4">
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>lock</span>
          <span className="fw-bold fs-8">Registration is closed. Members cannot add new players.</span>
        </div>
      )}

      <div className="row g-3">
        <div className="col-sm-5">
          <label className="fw-bold fs-8 text-uppercase opacity-75 mb-1 d-block">Open Date</label>
          <input type="date" className="form-control" value={form.openDate}
            onChange={(e) => setForm((p) => ({ ...p, openDate: e.target.value }))} />
        </div>
        <div className="col-sm-5">
          <label className="fw-bold fs-8 text-uppercase opacity-75 mb-1 d-block">Close Date</label>
          <input type="date" className="form-control" value={form.closeDate}
            onChange={(e) => setForm((p) => ({ ...p, closeDate: e.target.value }))} />
        </div>
        <div className="col-sm-2 d-flex align-items-end">
          <button onClick={handleSaveDates} className="btn btn-dark rounded-0 fw-bold w-100 text-uppercase fs-8">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ User Management Panel ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
function UserManagementPanel() {
  const { data, addUser, updateUser, deleteUser } = useAppData();
  const [activeTab, setActiveTab] = useState<'admin' | 'member'>('admin');
  const [modal, setModal] = useState<{ user: Partial<MockUser> | null; role: 'admin' | 'member' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const admins  = data.users.filter((u) => u.role === 'admin');
  const members = data.users.filter((u) => u.role === 'member');
  const users   = activeTab === 'admin' ? admins : members;

  function handleSave(updates: Partial<MockUser>) {
    if (modal?.user?.id) {
      updateUser(modal.user.id, updates);
    } else {
      addUser({
        id: `u${Date.now()}`,
        name: updates.name!,
        email: updates.email!,
        role: modal!.role,
        academyId: updates.academyId ?? '',
        academyName: updates.academyName ?? '',
      });
    }
    setModal(null);
  }

  return (
    <div className="bg-white p-4 mb-4 border" style={{ borderColor: 'rgba(27, 58, 45,0.1)' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="fw-900 text-uppercase text-dark-green fs-7 mb-0">User Management</h5>
        <button
          className="btn-gold px-3 py-1 fw-900 text-uppercase fs-9"
          onClick={() => setModal({ user: null, role: activeTab })}
        >
          <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '0.9rem' }}>add</span>
          Add {activeTab === 'admin' ? 'Admin' : 'Member'}
        </button>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-0 mb-4 border-bottom" style={{ borderColor: 'var(--color-border)' }}>
        {(['admin', 'member'] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn rounded-0 fw-700 text-uppercase fs-8 px-4 py-2 border-0"
              style={{
                color: active ? 'var(--color-dark-green)' : 'var(--color-muted)',
                borderBottom: `3px solid ${active ? 'var(--color-gold)' : 'transparent'}`,
                marginBottom: -1,
                background: 'transparent',
              }}
            >
              {tab === 'admin' ? `Admins (${admins.length})` : `Members (${members.length})`}
            </button>
          );
        })}
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {activeTab === 'member' && <th>Academy</th>}
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="fs-7">
            {users.length === 0 ? (
              <tr>
                <td colSpan={activeTab === 'member' ? 4 : 3} className="text-center text-muted py-4 fw-bold">
                  No {activeTab}s found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="fw-bold text-dark-green">{user.name}</td>
                  <td className="text-muted">{user.email}</td>
                  {activeTab === 'member' && (
                    <td className="text-muted fw-bold">
                      {user.academyName || <span className="badge bg-warning text-dark fs-9">Unassigned</span>}
                    </td>
                  )}
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-light rounded-0 border fw-bold"
                        onClick={() => setModal({ user, role: activeTab })}
                      >
                        Edit
                      </button>
                      {confirmDelete === user.id ? (
                        <>
                          <button className="btn btn-sm btn-danger rounded-0 fw-bold"
                            onClick={() => { deleteUser(user.id); setConfirmDelete(null); }}>
                            Confirm
                          </button>
                          <button className="btn btn-sm btn-light rounded-0 border"
                            onClick={() => setConfirmDelete(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button className="btn btn-sm btn-outline-danger rounded-0 fw-bold"
                          onClick={() => setConfirmDelete(user.id)}>
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <UserModal
          user={modal.user}
          role={modal.role}
          onSave={handleSave}
          onClose={() => setModal(null)}
          academies={data.academies.map((a) => ({ id: a.id, name: a.name }))}
        />
      )}
    </div>
  );
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Academy Assignment Panel ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
function AcademyAssignmentPanel() {
  const { data, updateAcademy } = useAppData();
  const [search, setSearch] = useState('');

  const memberUsers = data.users.filter((u) => u.role === 'member');
  const assignedIds = data.academies.map((a) => a.assignedMemberId).filter(Boolean) as string[];
  const filtered    = data.academies.filter(
    (a) => !search || a.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAssign(academyId: string, memberId: string) {
    updateAcademy(academyId, { assignedMemberId: memberId || undefined });
  }

  return (
    <div className="bg-white p-4 mb-4 border" style={{ borderColor: 'rgba(27, 58, 45,0.1)' }}>
      <h5 className="fw-900 text-uppercase text-dark-green fs-7 mb-4">Member Assignments</h5>
      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search academies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Academy</th>
              <th>Location</th>
              <th>Assigned Member</th>
              <th>Players</th>
            </tr>
          </thead>
          <tbody className="fs-7">
            {filtered.map((academy) => {
              const playerCount = data.players.filter((p) => p.academyId === academy.id).length;
              const available   = memberUsers.filter(
                (u) => !assignedIds.includes(u.id) || u.id === academy.assignedMemberId
              );
              return (
                <tr key={academy.id}>
                  <td className="fw-bold text-dark-green">{academy.name}</td>
                  <td className="text-muted">{academy.location}</td>
                  <td>
                    <select className="form-select form-select-sm" value={academy.assignedMemberId ?? ''}
                      onChange={(e) => handleAssign(academy.id, e.target.value)}>
                      <option value="">ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Unassigned ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â</option>
                      {available.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="fw-bold">{playerCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Division Capacity Panel ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
function DivisionCapacityPanel() {
  const { data } = useAppData();
  const divisionStats = DIVISIONS.map((div) => {
    const players = data.players.filter((p) => p.division === div && p.status !== 'Rejected');
    return { division: div, total: players.length };
  });

  return (
    <div className="bg-white p-4 mb-4 border" style={{ borderColor: 'rgba(27, 58, 45,0.1)' }}>
      <h5 className="fw-900 text-uppercase text-dark-green fs-7 mb-4">Division Capacity Overview</h5>
      <div className="row g-3">
        {divisionStats.map(({ division, total }) => {
          const pct = Math.min(100, Math.round((total / 15) * 100));
          return (
            <div key={division} className="col-sm-6 col-lg-4">
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-bold fs-8">{division}</span>
                <span className="fs-8 text-muted fw-bold">{total} / 15 max</span>
              </div>
              <div className="progress" style={{ height: 6 }}>
                <div
                  className={`progress-bar ${pct > 80 ? 'bg-danger' : pct > 50 ? 'bg-warning' : 'bg-success'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Page ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
export default function ManagementPage() {
  const { data } = useAppData();

  const pendingPlayers  = data.players.filter((p) => p.status === 'Pending').length;
  const rejectedPlayers = data.players.filter((p) => p.status === 'Rejected').length;
  const unassigned      = data.academies.filter((a) => !a.assignedMemberId).length;

  return (
    <main className="container-xxl py-5">
      {/* Header */}
      <div className="row align-items-end mb-5 g-4">
        <div className="col-lg-8">
          <span className="badge-gold mb-3 d-inline-block">Administration</span>
          <h1 className="editorial-header display-4 fw-900 text-dark-green">
            Management <span className="text-warm-muted">Hub</span>
          </h1>
        </div>
        <div className="col-lg-4 text-lg-end">
          <Link href="/players" className="btn btn-dark rounded-0 fw-900 text-uppercase fs-8 px-4 py-2">
            <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>pending_actions</span>
            Review Queue ({pendingPlayers})
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="row g-3 mb-5">
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Total Players</div>
            <div className="fs-3 fw-900 text-dark-green">{data.players.length}</div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Pending</div>
            <div className="fs-3 fw-900 text-gold">{pendingPlayers}</div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Rejected</div>
            <div className="fs-3 fw-900 text-danger">{rejectedPlayers}</div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="stat-tile">
            <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">Unassigned Acad.</div>
            <div className="fs-3 fw-900 text-mid-green">{unassigned}</div>
          </div>
        </div>
      </div>

      {/* Panels */}
      <RegistrationWindowPanel />
      <TransferRequestsPanel />
      <UserManagementPanel />
      <AcademyAssignmentPanel />
      <DivisionCapacityPanel />
      <AuditLogPanel />
    </main>
  );
}

/* ── Transfer Requests Panel ── */
function TransferRequestsPanel() {
  const { data, decideTransfer } = useAppData();
  const { session } = useSession();
  const pending = data.transfers.filter((t) => t.status === 'Pending');
  const history = data.transfers.filter((t) => t.status !== 'Pending').slice(0, 10);

  function decide(id: string, decision: 'Approved' | 'Rejected', note?: string) {
    decideTransfer(id, decision, note, session ? {
      actorId: session.userId, actorName: session.displayName, actorRole: 'admin',
    } : undefined);
  }

  return (
    <div className="bg-white p-4 mb-4 border" style={{ borderColor: 'var(--color-border)', borderRadius: 12 }}>
      <h5 className="fw-900 text-uppercase text-dark-green fs-7 mb-3">Transfer Requests</h5>
      {pending.length === 0 ? (
        <p className="text-warm-muted fs-8 mb-0">No pending transfer requests.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Player</th><th>From</th><th>To</th><th>Requested by</th><th className="text-end">Decision</th>
              </tr>
            </thead>
            <tbody className="fs-7">
              {pending.map((t) => (
                <tr key={t.id}>
                  <td className="fw-bold text-dark-green">{t.playerName}</td>
                  <td>{t.fromAcademyName}</td>
                  <td className="fw-bold">{t.toAcademyName}</td>
                  <td className="text-muted">{t.requestedBy}</td>
                  <td className="text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-sm fw-bold"
                        style={{ background: 'var(--color-mid-green)', color: '#fff', borderRadius: 8 }}
                        onClick={() => decide(t.id, 'Approved')}>
                        Approve
                      </button>
                      <button className="btn btn-sm btn-outline-danger fw-bold" style={{ borderRadius: 8 }}
                        onClick={() => decide(t.id, 'Rejected')}>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {history.length > 0 && (
        <details className="mt-3">
          <summary className="fs-8 fw-bold text-warm-muted text-uppercase" style={{ cursor: 'pointer' }}>
            Recent decisions ({history.length})
          </summary>
          <div className="mt-2 d-flex flex-column gap-1">
            {history.map((t) => (
              <div key={t.id} className="fs-9 text-muted d-flex gap-2 align-items-center">
                <span className="fw-bold text-dark-green">{t.playerName}</span>
                <span>{t.fromAcademyName} → {t.toAcademyName}</span>
                <span className="ms-auto fw-bold" style={{ color: t.status === 'Approved' ? 'var(--color-mid-green)' : 'var(--color-danger)' }}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

/* ── Audit Log Panel ── */
function AuditLogPanel() {
  const { data } = useAppData();
  const entries  = data.audit.slice(0, 50);

  return (
    <div className="bg-white p-4 mb-4 border" style={{ borderColor: 'var(--color-border)', borderRadius: 12 }}>
      <h5 className="fw-900 text-uppercase text-dark-green fs-7 mb-3">Audit Log</h5>
      {entries.length === 0 ? (
        <p className="text-warm-muted fs-8 mb-0">No activity yet. Player edits, transfers, deletes, and approvals will appear here.</p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {entries.map((e) => {
            const ts = new Date(e.timestamp).toLocaleString();
            const color =
              e.action === 'player_deleted' || e.action === 'player_rejected' || e.action === 'transfer_rejected' ? 'var(--color-danger)'
              : e.action === 'player_approved' || e.action === 'transfer_approved' || e.action === 'player_activated' ? 'var(--color-mid-green)'
              : 'var(--color-warm-muted, var(--color-muted))';
            return (
              <div key={e.id} className="d-flex align-items-start gap-2 fs-9 py-1" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <span className="fw-bold text-uppercase" style={{ minWidth: 160, color, letterSpacing: '0.05em' }}>
                  {e.action.replace(/_/g, ' ')}
                </span>
                <div className="flex-grow-1">
                  {e.targetLabel && <span className="fw-bold text-dark-green">{e.targetLabel}</span>}
                  {e.detail && <span className="text-muted"> · {e.detail}</span>}
                  <div className="text-warm-muted">
                    by {e.actorName} ({e.actorRole}){e.academyName ? ` · ${e.academyName}` : ''} · {ts}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
