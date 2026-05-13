'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import { useAppData } from '@/context/AppDataContext';
import { Avatar, StatusBadge, DivisionBadge, GenderBadge, PlayerViewModal, EditPlayerModal } from '@/components/ui';
import { DIVISIONS, GENDERS } from '@/lib/types';
import type { Division, Gender, Player } from '@/lib/types';

export default function AcademyPlayersPage() {
  const params = useParams<{ id: string }>();
  const { session } = useSession();
  const { data, updatePlayer, getAcademyPlayerCount } = useAppData();

  const [search, setSearch]             = useState('');
  const [divFilter, setDivFilter]       = useState<Division | ''>('');
  const [genderFilter, setGenderFilter] = useState<Gender | ''>('');
  const [viewPlayer, setViewPlayer]     = useState<Player | null>(null);
  const [editPlayer, setEditPlayer]     = useState<Player | null>(null);

  const academy = data.academies.find((a) => a.id === params.id);
  const players = data.players.filter((p) => p.academyId === params.id);

  const isAdmin   = session?.role === 'admin';
  const isOwnAcademy = session?.academyId === params.id;
  const canEdit   = isOwnAcademy && !isAdmin;

  if (!academy) {
    return (
      <main className="container-xxl py-5">
        <div className="text-center py-5">
          <span className="material-symbols-outlined text-muted" style={{ fontSize: '4rem' }}>domain_disabled</span>
          <h2 className="fw-900 text-dark-green mt-3">Academy not found</h2>
          <Link href="/academies" className="btn-gold px-4 py-2 mt-3 d-inline-block fw-900 text-uppercase fs-8">
            Back to Academies
          </Link>
        </div>
      </main>
    );
  }

  const filtered = players.filter((p) => {
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    if (search && !name.includes(search.toLowerCase()) && !p.prcId.toLowerCase().includes(search.toLowerCase())) return false;
    if (divFilter && p.division !== divFilter) return false;
    if (genderFilter && p.gender !== genderFilter) return false;
    return true;
  });

  const divisionRows = DIVISIONS.map((d) => ({
    division: d,
    players: filtered.filter((p) => p.division === d),
  })).filter((row) => row.players.length > 0);

  const statsRows = [
    { label: 'Total',     value: players.length, color: 'var(--color-dark-green)' },
    { label: 'Active',    value: players.filter((p) => p.status === 'Active').length, color: 'var(--color-mid-green)' },
    { label: 'Pending',   value: players.filter((p) => p.status === 'Pending').length, color: 'var(--color-gold)' },
    { label: 'Divisions', value: new Set(players.map((p) => p.division)).size, color: 'var(--color-mid-green)' },
  ];

  return (
    <main className="container-xxl py-5">
      {/* Back */}
      <div className="mb-4">
        <Link href="/academies" className="text-muted text-decoration-none fw-bold fs-8 text-uppercase">
          <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>arrow_back</span>
          All Academies
        </Link>
      </div>

      {/* Academy header */}
      <div className="row align-items-end mb-5 g-4">
        <div className="col-lg-8">
          <span className="badge-gold mb-3 d-inline-block">
            {isOwnAcademy ? 'My Academy' : 'Academy Roster'}
          </span>
          <h1 className="editorial-header display-4 fw-900 text-dark-green">
            {academy.name}
          </h1>
          <div className="d-flex flex-wrap gap-3 align-items-center mt-2">
            {academy.location && (
              <span className="text-muted fw-bold fs-8">
                <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '0.9rem' }}>location_on</span>
                {academy.location}
              </span>
            )}
            {academy.rep && (
              <span className="text-muted fw-bold fs-8">
                <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '0.9rem' }}>person</span>
                {academy.rep}
              </span>
            )}
            {academy.email && (
              <span className="text-muted fw-bold fs-8">
                <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '0.9rem' }}>mail</span>
                {academy.email}
              </span>
            )}
          </div>
          {academy.divisions && academy.divisions.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mt-3">
              {academy.divisions.map((d) => <DivisionBadge key={d} division={d} />)}
            </div>
          )}
        </div>
        {isOwnAcademy && data.registrationWindow.isOpen && (
          <div className="col-lg-4 text-lg-end">
            <Link href="/players/register" className="btn-gold px-4 py-2 fw-900 text-uppercase fs-8">
              <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>person_add</span>
              Add Player
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {statsRows.map(({ label, value, color }) => (
          <div key={label} className="col-sm-3">
            <div className="stat-tile">
              <div className="fs-9 fw-900 text-uppercase opacity-50 mb-1">{label}</div>
              <div className="fs-3 fw-900" style={{ color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="inline-filter-bar">
        <div style={{ flex: '1 1 200px' }}>
          <label className="fs-9 fw-900 text-uppercase opacity-50 mb-1 d-block">Search</label>
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
          <button
            className="btn btn-sm btn-outline-secondary align-self-end"
            onClick={() => { setSearch(''); setDivFilter(''); setGenderFilter(''); }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Players by division */}
      {divisionRows.length === 0 ? (
        <div className="text-center py-5 bg-white">
          <span className="material-symbols-outlined text-muted d-block mb-3" style={{ fontSize: '3rem' }}>groups</span>
          <p className="fw-bold text-muted mb-0">
            {search || divFilter ? 'No players match your filters.' : 'No players registered yet.'}
          </p>
        </div>
      ) : (
        divisionRows.map(({ division, players: divPlayers }) => (
          <div key={division} className="mb-5">
            <div className="d-flex align-items-center gap-3 mb-3">
              <DivisionBadge division={division} />
              <span className="fw-900 text-dark-green">
                {divPlayers.length} player{divPlayers.length !== 1 ? 's' : ''}
              </span>
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
                  {divPlayers.map((player) => {
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
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              className="btn btn-sm btn-light rounded-0 border fw-bold"
                              onClick={() => setViewPlayer(player)}
                            >
                              View
                            </button>
                            {canEdit && (
                              <button
                                className="btn btn-sm btn-light rounded-0 border fw-bold"
                                onClick={() => setEditPlayer(player)}
                              >
                                Edit
                              </button>
                            )}
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
          academyName={academy.name}
          getCount={(d) => getAcademyPlayerCount(params.id, d)}
          onSave={(updates) => {
            updatePlayer(editPlayer.id, updates);
            setEditPlayer(null);
          }}
          onClose={() => setEditPlayer(null)}
        />
      )}
    </main>
  );
}
