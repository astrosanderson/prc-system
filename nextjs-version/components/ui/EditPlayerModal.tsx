'use client';

import { useState, useEffect } from 'react';
import type { Player, Division, Gender, PlayerGrade } from '@/lib/types';
import { DIVISIONS, POSITIONS, GENDERS, PLAYER_GRADES } from '@/lib/types';

const MAX_PER_DIVISION = 15;

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

function getMinAllowedDivisionIndex(age: number, currentDivision: Division): number {
  const ageIdx = DIVISIONS.indexOf(ageToDefaultDivision(age));
  const curIdx = DIVISIONS.indexOf(currentDivision);
  return Math.max(ageIdx, curIdx);
}

export function EditPlayerModal({
  player,
  academyName,
  getCount,
  onSave,
  onClose,
}: {
  player: Player;
  academyName: string;
  getCount: (division: Division) => number;
  onSave: (updates: Partial<Player>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    firstName:    player.firstName,
    lastName:     player.lastName,
    dob:          player.dob,
    gender:       player.gender as Gender,
    grade:        (player.grade ?? '') as PlayerGrade | '',
    jerseyNumber: player.jerseyNumber === undefined ? '' : String(player.jerseyNumber),
    division:     player.division as Division,
    position:     player.position,
    nationality:  player.nationality ?? '',
    photo:        player.photo ?? '',
  });
  const [photoPreview, setPhotoPreview] = useState(player.photo ?? '');
  const [error, setError] = useState('');

  const age = form.dob ? calcAge(form.dob) : 0;
  const minDivIdx = form.dob
    ? getMinAllowedDivisionIndex(age, player.division)
    : DIVISIONS.indexOf(player.division);

  useEffect(() => {
    if (!form.dob) return;
    const computedAge = calcAge(form.dob);
    const defaultDiv = ageToDefaultDivision(computedAge);
    const defaultIdx = DIVISIONS.indexOf(defaultDiv);
    const currentIdx = DIVISIONS.indexOf(form.division);
    if (currentIdx < defaultIdx) {
      setForm((p) => ({ ...p, division: defaultDiv }));
    }
  }, [form.dob]);

  function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setForm((p) => ({ ...p, photo: url }));
  }

  function handleSave() {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First and last name are required.'); return;
    }
    if (!form.dob)      { setError('Date of birth is required.'); return; }
    if (!form.grade)    { setError('Player grade is required.'); return; }
    if (!form.division) { setError('Division is required.'); return; }
    if (!form.position) { setError('Position is required.'); return; }

    onSave({
      firstName:    form.firstName.trim(),
      lastName:     form.lastName.trim(),
      dob:          form.dob,
      gender:       form.gender,
      grade:        form.grade as PlayerGrade,
      jerseyNumber: form.jerseyNumber === '' ? undefined : Number(form.jerseyNumber),
      division:     form.division,
      position:     form.position,
      nationality:  form.nationality.trim() || undefined,
      photo:        form.photo || undefined,
    });
  }

  function set(key: string, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    setError('');
  }

  return (
    <div className="kpp-modal-backdrop is-open" onClick={onClose}>
      <div
        className="kpp-modal kpp-modal--light kpp-modal--wide"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640 }}
      >
        <div className="kpp-modal-header">
          <span className="kpp-modal-title">Edit Player — {player.firstName} {player.lastName}</span>
          <button className="kpp-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="kpp-modal-body">
          <div className="row g-3">
            {/* Photo */}
            <div className="col-12 d-flex align-items-center gap-3 mb-2">
              <div
                className="d-flex align-items-center justify-content-center bg-light rounded flex-shrink-0"
                style={{ width: 70, height: 70, overflow: 'hidden' }}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="material-symbols-outlined text-muted" style={{ fontSize: '2rem' }}>person</span>
                )}
              </div>
              <div className="flex-grow-1">
                <label className="form-label fw-bold fs-8 mb-1">Player Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control form-control-sm"
                  onChange={handlePhotoFile}
                />
                <div className="form-text">Upload a new photo (optional)</div>
              </div>
            </div>

            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">First Name *</label>
              <input className="form-control" value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)} />
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Last Name *</label>
              <input className="form-control" value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)} />
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Date of Birth *</label>
              <input type="date" className="form-control" value={form.dob}
                onChange={(e) => set('dob', e.target.value)} />
              {form.dob && <div className="form-text">Age: {calcAge(form.dob)} years → default {ageToDefaultDivision(calcAge(form.dob))}</div>}
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Nationality</label>
              <input className="form-control" value={form.nationality}
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
                onChange={(e) => set('grade', e.target.value)}>
                <option value="">Select grade…</option>
                {PLAYER_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Jersey Number</label>
              <input type="number" min={1} max={99} className="form-control"
                value={form.jerseyNumber}
                onChange={(e) => set('jerseyNumber', e.target.value)}
                placeholder="1–99" />
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Division *</label>
              <select className="form-select" value={form.division}
                onChange={(e) => set('division', e.target.value)}>
                {DIVISIONS.map((d, idx) => {
                  const below = idx < minDivIdx;
                  const count = getCount(d);
                  const full = count >= MAX_PER_DIVISION && d !== player.division;
                  return (
                    <option key={d} value={d} disabled={below || full}>
                      {d}
                      {below ? ' (too low for age)' : full ? ' (Full)' : count > 0 ? ` — ${count}/${MAX_PER_DIVISION}` : ''}
                    </option>
                  );
                })}
              </select>
              {minDivIdx > 0 && (
                <div className="form-text text-muted">
                  Min. allowed: {DIVISIONS[minDivIdx]} (cannot move down)
                </div>
              )}
            </div>
            <div className="col-sm-6">
              <label className="form-label fw-bold fs-8">Position *</label>
              <select className="form-select" value={form.position}
                onChange={(e) => set('position', e.target.value)}>
                <option value="">Select position…</option>
                {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold fs-8">Academy</label>
              <input type="text" className="form-control bg-light" value={academyName} disabled />
            </div>
          </div>

          {error && <div className="alert alert-danger py-2 mt-3 fw-bold fs-8">{error}</div>}
        </div>

        <div className="kpp-modal-footer">
          <button className="kpp-btn kpp-btn--outline" onClick={onClose}>Cancel</button>
          <button className="kpp-btn kpp-btn--primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
