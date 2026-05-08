'use strict';

const DIVISIONS = ['U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18'];

document.addEventListener('DOMContentLoaded', async () => {
  const session = window.zfApp?.getSession?.() || { academyName: 'North Star Elite' };
  const academyName = session.academyName || 'North Star Elite';
  const displayName = session.displayName || 'Team Representative';
  const players = await getPlayers();
  const myPlayers = players.filter((player) => (player.academy || '').toLowerCase() === academyName.toLowerCase());
  const games = getPastGames();

  document.getElementById('memberAcademyTitle').textContent = academyName;
  document.getElementById('memberAcademyLabel').textContent = `Academy: ${academyName}`;
  document.getElementById('memberIdentityLabel').textContent = `Welcome, ${displayName}`;
  document.getElementById('memberPlayerCount').textContent = String(myPlayers.length);
  document.getElementById('memberDivisionCount').textContent = String(new Set(myPlayers.map((p) => normaliseDivision(p.division || p.team))).size || 0);
  renderRegistrationStatus();
  renderPlayers(myPlayers);
  renderDivisionMix(myPlayers);
  renderGames(games);
});

async function getPlayers() {
  const stored = readJson('zfPlayers');
  const seedPlayers = await readJsonFile('../data/players.json');
  const academies = await readJsonFile('../data/academies.json');
  return [...seedPlayers, ...stored].map((player) => {
    const academy = academies.find((item) => item.id === player.academyId);
    const name = player.name || `${player.firstName || ''} ${player.lastName || ''}`.trim();
    return {
      id: player.id,
      name,
      firstName: player.firstName || name.split(' ')[0] || 'Player',
      lastName: player.lastName || name.split(' ').slice(1).join(' '),
      academy: player.academy || academy?.name || 'North Star Elite',
      division: normaliseDivision(player.division || player.team || player.ageGroup),
      age: player.age || '',
      position: player.position || 'Midfielder',
      photo: player.photo || '',
      status: titleCase(player.status || 'pending'),
      rejectionFeedback: player.rejectionFeedback || player.rejectionComment || ''
    };
  });
}

function renderPlayers(players) {
  const tbody = document.getElementById('memberPlayersTable');
  if (!tbody) return;
  if (!players.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted fw-bold py-5">No players registered for your academy yet.</td></tr>';
    return;
  }

  tbody.innerHTML = players.map((player) => {
    const avatar = player.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=0b3d2e&color=fff&size=88`;
    return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${escapeAttr(avatar)}" class="avatar" alt="${escapeAttr(player.name)}">
            <span class="fw-bold text-primary">${escapeHtml(player.name)}</span>
          </div>
        </td>
        <td class="fw-bold text-muted">${escapeHtml(player.position)}</td>
        <td><span class="badge-elite">${escapeHtml(player.division)}</span></td>
        <td>${statusHtml(player.status)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-light border" data-player='${escapeAttr(JSON.stringify(player))}'>View</button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('[data-player]').forEach((button) => {
    button.addEventListener('click', () => openPlayerModal(JSON.parse(button.dataset.player)));
  });
}

function renderDivisionMix(players) {
  const target = document.getElementById('memberDivisionMix');
  if (!target) return;
  const total = Math.max(players.length, 1);
  target.innerHTML = DIVISIONS.map((division) => {
    const count = players.filter((player) => player.division === division).length;
    const percent = Math.round((count / total) * 100);
    return `
      <div class="mb-4">
        <div class="d-flex justify-content-between fs-8 fw-bold mb-1"><span>${division}</span><span>${count}/15</span></div>
        <div class="progress"><div class="progress-bar" style="width:${percent}%;"></div></div>
      </div>
    `;
  }).join('');
}

function renderGames(games) {
  const target = document.getElementById('memberPastGames');
  if (!target) return;
  target.innerHTML = games.slice(0, 4).map((game) => `
    <div class="notice-item">
      <p class="fs-8 fw-bold text-secondary text-uppercase mb-1">${escapeHtml(game.date || 'Past game')}</p>
      <p class="fs-7 fw-bold mb-1">${escapeHtml(game.fixture)}</p>
      <p class="fs-9 opacity-50">${escapeHtml(game.score || 'Score pending')}</p>
    </div>
  `).join('') || '<p class="opacity-75 fw-bold mb-0">No past games have been added yet.</p>';
}

function renderRegistrationStatus() {
  const settings = readJson('zfSettings');
  const label = document.getElementById('memberRegistrationStatus');
  if (!label) return;
  if (!settings.registrationOpen || !settings.registrationClose) {
    label.textContent = 'REGISTRATION OPEN';
    return;
  }
  const now = Date.now();
  const open = new Date(settings.registrationOpen).getTime();
  const close = new Date(settings.registrationClose).getTime();
  label.textContent = now >= open && now <= close ? 'REGISTRATION OPEN' : 'REGISTRATION CLOSED';
}

function openPlayerModal(player) {
  document.getElementById('memberPlayerModal')?.remove();
  const avatar = player.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=0b3d2e&color=fff&size=160`;
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'memberPlayerModal';
  modal.tabIndex = -1;
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold text-primary">Player Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex gap-3 align-items-center mb-4">
            <img src="${escapeAttr(avatar)}" class="rounded-circle" width="88" height="88" style="object-fit:cover;" alt="${escapeAttr(player.name)}">
            <div>
              <h3 class="h5 fw-black mb-1 text-primary">${escapeHtml(player.name)}</h3>
              <div class="badge-gold">${escapeHtml(player.division)}</div>
            </div>
          </div>
          ${detailRow('Age', player.age || 'Not captured')}
          ${detailRow('Academy', player.academy)}
          ${detailRow('Position', player.position)}
          ${detailRow('Status', player.status)}
          ${player.rejectionFeedback ? `<div class="alert alert-warning mt-3 mb-0"><strong>Rejection feedback:</strong> ${escapeHtml(player.rejectionFeedback)}</div>` : ''}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  bootstrap.Modal.getOrCreateInstance(modal).show();
}

function detailRow(label, value) {
  return `<div class="d-flex justify-content-between border-bottom py-2"><span class="text-muted fw-bold">${label}</span><span class="fw-bold">${escapeHtml(String(value))}</span></div>`;
}

function statusHtml(status) {
  const text = titleCase(status);
  const cls = text === 'Approved' ? 'text-success' : text === 'Rejected' ? 'text-danger' : 'text-warning';
  const dot = text === 'Approved' ? 'bg-success' : text === 'Rejected' ? 'bg-danger' : 'bg-warning';
  return `<span class="fw-bold ${cls}"><span class="status-dot ${dot}"></span>${escapeHtml(text)}</span>`;
}

function getPastGames() {
  const adminData = readJson('zfAdminData');
  return adminData.games || [
    { id: 'gm-1', fixture: 'North Star Elite vs Vortex Youth', date: '2026-03-12', score: '2-1' },
    { id: 'gm-2', fixture: 'Lionheart FC vs Phoenix Rising', date: '2026-03-04', score: '1-1' }
  ];
}

async function readJsonFile(path) {
  try {
    const response = await fetch(path);
    return response.ok ? response.json() : [];
  } catch (error) {
    return [];
  }
}

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function normaliseDivision(raw) {
  const value = String(raw || 'U-14').toUpperCase().replace(/\s+/g, '').replace('UNDER', 'U');
  const match = value.match(/U-?(\d+)/);
  return match ? `U-${match[1]}` : 'U-14';
}

function titleCase(value) {
  const text = String(value || '');
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#096;');
}
