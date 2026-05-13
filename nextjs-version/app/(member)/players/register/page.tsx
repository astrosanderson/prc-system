'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';
import { DIVISIONS, POSITIONS, GENDERS, PLAYER_GRADES, DOCUMENT_TYPES, MAX_PLAYERS_PER_DIVISION } from '@/lib/types';
import type { Division, Gender, PlayerGrade, DocumentType, PlayerDocument } from '@/lib/types';

const MAX_PER_DIVISION = MAX_PLAYERS_PER_DIVISION;

function calcAge(dob: string): number {
  if (!dob) return 0;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function ageToDefaultDivision(age: number): Division {
  if (age <= 8)  return 'U-8';
  if (age <= 10) return 'U-10';
  if (age <= 12) return 'U-12';
  if (age <= 14) return 'U-14';
  if (age <= 16) return 'U-16';
  return 'U-18';
}

export default function PlayerRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useSession();
  const { data, addPlayer, updatePlayer, getAcademyPlayerCount } = useAppData();

  const editId = searchParams.get('id');
  const isEdit = !!editId;
  const existing = editId ? data.players.find((p) => p.id === editId) : null;

  /* Members can only add/edit their own academy */
  useEffect(() => {
    if (!session) return;
    if (session.role === 'admin') { router.replace('/players'); return; }
    if (isEdit && existing && existing.academyId !== session.academyId) {
      router.replace('/players');
    }
  }, [session, isEdit, existing, router]);

  const [form, setForm] = useState({
    firstName:   existing?.firstName    ?? '',
    lastName:    existing?.lastName     ?? '',
    dob:         existing?.dob          ?? '',
    gender:      (existing?.gender      ?? 'Male') as Gender,
    grade:       (existing?.grade       ?? '') as PlayerGrade | '',
    jerseyNumber:existing?.jerseyNumber ?? '',
    division:    (existing?.division    ?? '') as Division | '',
    position:    existing?.position     ?? '',
    nationality: existing?.nationality  ?? '',
  });
  const [documents, setDocuments] = useState<PlayerDocument[]>(existing?.documents ?? []);
  const [docType, setDocType]     = useState<DocumentType | ''>('');
  const [docFileName, setDocFileName] = useState('');
  const [photoPreview, setPhotoPreview] = useState(existing?.photo ?? '');
  const [photoUrl, setPhotoUrl]         = useState(existing?.photo ?? '');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const age      = form.dob ? calcAge(form.dob) : 0;
  const minDivIdx = form.dob
    ? DIVISIONS.indexOf(ageToDefaultDivision(age))
    : 0;

  /* Auto-assign division when DOB changes (only if not editing) */
  useEffect(() => {
    if (!form.dob || isEdit) return;
    const newDiv = ageToDefaultDivision(calcAge(form.dob));
    setForm((p) => ({ ...p, division: newDiv }));
  }, [form.dob, isEdit]);

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setPhotoUrl(url);
  }

  const academyId   = session?.academyId   ?? '';
  const academyName = session?.academyName ?? '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First and last name are required.'); return;
    }
    if (!form.dob) { setError('Date of birth is required.'); return; }
    if (!form.grade) { setError('Player grade is required.'); return; }
    if (!form.division) { setError('Division is required.'); return; }
    if (!form.position) { setError('Position is required.'); return; }

    /* Division cannot be lower than age minimum */
    const divIdx = DIVISIONS.indexOf(form.division as Division);
    if (divIdx < minDivIdx) {
      setError(`Players aged ${age} cannot be placed in ${form.division}. Minimum is ${DIVISIONS[minDivIdx]}.`);
      return;
    }

    if (!data.registrationWindow.isOpen) {
      setError('Registration is currently closed. Contact your administrator.'); return;
    }

    if (!isEdit) {
      const count = getAcademyPlayerCount(academyId, form.division);
      if (count >= MAX_PER_DIVISION) {
        setError(`Maximum of ${MAX_PER_DIVISION} players allowed per division. ${form.division} is full for ${academyName}.`);
        return;
      }

      const newId   = `p${Date.now()}`;
      const initials = `${form.firstName[0]}${form.lastName[0]}`.toUpperCase();
      const prcId   = `ZF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${initials}`;

      addPlayer({
        id: newId,
        prcId,
        firstName:   form.firstName.trim(),
        lastName:    form.lastName.trim(),
        dob:         form.dob,
        gender:      form.gender,
        grade:       form.grade as PlayerGrade,
        jerseyNumber: form.jerseyNumber === '' ? undefined : Number(form.jerseyNumber),
        division:    form.division as Division,
        academy:     academyName,
        academyId,
        position:    form.position,
        status:      'Pending',
        photo:       photoUrl || undefined,
        nationality: form.nationality.trim() || undefined,
        documents:   documents.length > 0 ? documents : undefined,
      }, session ? { actorId: session.userId, actorName: session.displayName, actorRole: 'member', academyId, academyName } : undefined);
    } else if (existing) {
      const existingDivIdx = DIVISIONS.indexOf(existing.division);
      if (divIdx < existingDivIdx) {
        setError(`Cannot move player down from ${existing.division} to ${form.division}.`);
        return;
      }
      updatePlayer(existing.id, {
        firstName:   form.firstName.trim(),
        lastName:    form.lastName.trim(),
        dob:         form.dob,
        gender:      form.gender,
        grade:       form.grade as PlayerGrade,
        jerseyNumber: form.jerseyNumber === '' ? undefined : Number(form.jerseyNumber),
        division:    form.division as Division,
        position:    form.position,
        photo:       photoUrl || undefined,
        nationality: form.nationality.trim() || undefined,
        documents:   documents.length > 0 ? documents : undefined,
      }, session ? { actorId: session.userId, actorName: session.displayName, actorRole: 'member', academyId, academyName } : undefined);
    }

    setSuccess(true);
    setTimeout(() => router.push(isEdit ? `/players/${existing?.id}` : '/players'), 1200);
  }

  const regClosed = !data.registrationWindow.isOpen;

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">

          <div className="mb-4">
            <Link href="/players" className="text-muted text-decoration-none fw-bold fs-8 text-uppercase">
              <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>arrow_back</span>
              All Players
            </Link>
          </div>

          <h1 className="editorial-header display-5 fw-900 text-dark-green mb-1">
            {isEdit ? 'Edit' : 'Register'} <span className="text-warm-muted">Player</span>
          </h1>
          <p className="text-muted fw-bold mb-4">
            {isEdit
              ? `Editing ${existing?.firstName} ${existing?.lastName}`
              : `Adding to ${academyName}`}
          </p>

          {regClosed && !isEdit && (
            <div className="alert alert-warning fw-bold mb-4">
              <span className="material-symbols-outlined align-middle me-2">lock</span>
              Registration window is currently closed.
            </div>
          )}

          {success && (
            <div className="alert alert-success fw-bold">
              <span className="material-symbols-outlined align-middle me-2">check_circle</span>
              Player {isEdit ? 'updated' : 'registered'} successfully. Redirecting…
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-4 p-lg-5">
            {/* Personal Info */}
            <h6 className="fw-900 text-uppercase text-dark-green fs-8 mb-3 pb-2 border-bottom">Personal Information</h6>
            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <label className="form-label fw-bold fs-8">First Name *</label>
                <input type="text" className="form-control" value={form.firstName}
                  onChange={(e) => set('firstName', e.target.value)} placeholder="First name" />
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-bold fs-8">Last Name *</label>
                <input type="text" className="form-control" value={form.lastName}
                  onChange={(e) => set('lastName', e.target.value)} placeholder="Last name" />
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-bold fs-8">Date of Birth *</label>
                <input type="date" className="form-control" value={form.dob}
                  onChange={(e) => set('dob', e.target.value)} />
                {form.dob && (
                  <div className="form-text">
                    Age: <strong>{calcAge(form.dob)}</strong> years
                    {!isEdit && ` Ã¢â€ ’ default division: ${ageToDefaultDivision(calcAge(form.dob))}`}
                  </div>
                )}
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-bold fs-8">Nationality</label>
                <input type="text" className="form-control" value={form.nationality}
                  onChange={(e) => set('nationality', e.target.value)} placeholder="e.g. Zambian" />
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-bold fs-8">Gender *</label>
                <select className="form-select" value={form.gender}
                  onChange={(e) => set('gender', e.target.value)}>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-bold fs-8">Player Grade *</label>
                <select className="form-select" value={form.grade}
                  onChange={(e) => set('grade', e.target.value)} required>
                  <option value="">Select grade…</option>
                  {PLAYER_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <div className="form-text">Academic year level — required for team-sheet eligibility.</div>
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-bold fs-8">Jersey Number</label>
                <input type="number" min={1} max={99} className="form-control"
                  value={form.jerseyNumber}
                  onChange={(e) => set('jerseyNumber', e.target.value)}
                  placeholder="1–99" />
              </div>
            </div>

            {/* Football Info */}
            <h6 className="fw-900 text-uppercase text-dark-green fs-8 mb-3 pb-2 border-bottom">Football Details</h6>
            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <label className="form-label fw-bold fs-8">Division *</label>
                <select className="form-select" value={form.division}
                  onChange={(e) => set('division', e.target.value)}>
                  <option value="">Select division…</option>
                  {DIVISIONS.map((d, idx) => {
                    const belowAge = idx < minDivIdx;
                    const belowCurrent = isEdit && existing && idx < DIVISIONS.indexOf(existing.division);
                    const disabled = belowAge || !!belowCurrent;
                    const count = getAcademyPlayerCount(academyId, d);
                    const full = !isEdit && count >= MAX_PER_DIVISION;
                    return (
                      <option key={d} value={d} disabled={disabled || full}>
                        {d}
                        {disabled ? ' (not allowed)' : full ? ' (Full)' : count > 0 ? ` — ${count}/${MAX_PER_DIVISION}` : ''}
                      </option>
                    );
                  })}
                </select>
                {form.dob && (
                  <div className="form-text text-muted">
                    {isEdit
                      ? `Min. division: ${existing ? existing.division : DIVISIONS[minDivIdx]} (cannot move down)`
                      : `Selections below ${DIVISIONS[minDivIdx]} are disabled for age ${age}`}
                  </div>
                )}
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-bold fs-8">Position *</label>
                <select className="form-select" value={form.position}
                  onChange={(e) => set('position', e.target.value)}>
                  <option value="">Select position…</option>
                  {POSITIONS.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold fs-8">Academy</label>
                <input type="text" className="form-control bg-light" value={academyName} disabled />
              </div>
            </div>

            {/* Photo */}
            <h6 className="fw-900 text-uppercase text-dark-green fs-8 mb-3 pb-2 border-bottom">Player Photo</h6>
            <div className="mb-4">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div
                  className="d-flex align-items-center justify-content-center bg-light rounded flex-shrink-0"
                  style={{ width: 80, height: 80, overflow: 'hidden' }}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="material-symbols-outlined text-muted" style={{ fontSize: '2.5rem' }}>person</span>
                  )}
                </div>
                <div className="flex-grow-1">
                  <label className="form-label fw-bold fs-8">Upload Photo</label>
                  <input type="file" accept="image/*" className="form-control" onChange={handlePhotoFile} />
                  <div className="form-text">Optional. Select an image file from your device.</div>
                </div>
              </div>
            </div>

            {/* Player Documents */}
            <h6 className="fw-900 text-uppercase text-dark-green fs-8 mb-3 pb-2 border-bottom">Player Documents</h6>
            <div className="mb-4">
              <div className="row g-2 align-items-end">
                <div className="col-sm-4">
                  <label className="form-label fw-bold fs-8">Document Type *</label>
                  <select className="form-select" value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType | '')}>
                    <option value="">Select type…</option>
                    {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-sm-5">
                  <label className="form-label fw-bold fs-8">File</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setDocFileName(e.target.files?.[0]?.name ?? '')}
                    disabled={!docType}
                  />
                  {!docType && <div className="form-text">Choose a document type before selecting a file.</div>}
                </div>
                <div className="col-sm-3">
                  <button
                    type="button"
                    className="btn btn-light border fw-bold w-100"
                    disabled={!docType || !docFileName}
                    onClick={() => {
                      if (!docType || !docFileName) return;
                      setDocuments((d) => [...d, {
                        id:         `doc${Date.now()}`,
                        type:       docType as DocumentType,
                        fileName:   docFileName,
                        uploadedAt: new Date().toISOString(),
                        uploadedBy: session?.displayName,
                      }]);
                      setDocType(''); setDocFileName('');
                    }}
                  >
                    Add Document
                  </button>
                </div>
              </div>
              {documents.length > 0 && (
                <div className="mt-3 d-flex flex-column gap-2">
                  {documents.map((d) => (
                    <div key={d.id} className="d-flex align-items-center gap-2 stat-tile" style={{ padding: '0.55rem 0.8rem' }}>
                      <span className="fw-bold text-dark-green fs-8 text-uppercase" style={{ minWidth: 140 }}>{d.type}</span>
                      <span className="text-muted fs-8 flex-grow-1 text-truncate">{d.fileName}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-light border"
                        onClick={() => setDocuments((all) => all.filter((x) => x.id !== d.id))}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <div className="alert alert-danger fw-bold py-2 mb-3">{error}</div>}

            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn-gold px-5 py-2 fw-900 text-uppercase"
                disabled={success || (regClosed && !isEdit)}
              >
                {isEdit ? 'Save Changes' : 'Register Player'}
              </button>
              <Link href="/players" className="btn btn-light rounded-0 border fw-bold text-uppercase fs-8 px-4">
                Cancel
              </Link>
            </div>
          </form>

        </div>
      </div>
    </main>
  );
}
