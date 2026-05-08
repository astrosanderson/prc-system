'use strict';

const DIVISIONS = ['U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18'];

document.addEventListener('DOMContentLoaded', async () => {
  const seedAcademies = await readJsonFile('../data/academies.json');
  const data = getAdminData();
  data.academies = mergeById(seedAcademies, readArray('zfAcademies'));
  persistAdminData(data);
  bindForms(data);
  renderAll(data);
});

function bindForms(data) {
  document.getElementById('teamMemberForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    upsert(data.teamMembers, {
      id: value('teamMemberId') || `tm-${Date.now()}`,
      name: value('teamMemberName'),
      email: value('teamMemberEmail'),
      academy: value('teamMemberAcademy')
    });
    finishForm(event.target, 'teamMemberId', data);
  });

  document.getElementById('adminUserForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    upsert(data.adminUsers, {
      id: value('adminUserId') || `ad-${Date.now()}`,
      name: value('adminUserName'),
      email: value('adminUserEmail'),
      role: value('adminUserRole')
    });
    finishForm(event.target, 'adminUserId', data);
  });

  document.getElementById('academyForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    upsert(data.academies, {
      id: value('academyId') || `academy_${Date.now()}`,
      name: value('academyName'),
      location: value('academyLocation'),
      logo: value('academyLogo'),
      representativeId: data.academies.find((academy) => academy.id === value('academyId'))?.representativeId || '',
      divisions: DIVISIONS,
      teams: DIVISIONS.map((division) => ({ name: division, division }))
    });
    finishForm(event.target, 'academyId', data);
  });

  document.getElementById('registrationSettingsForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('zfSettings', JSON.stringify({
      registrationOpen: value('registrationOpen'),
      registrationClose: value('registrationClose')
    }));
    showMessage('Registration window saved.');
  });

  document.getElementById('gameForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    upsert(data.games, {
      id: value('gameId') || `gm-${Date.now()}`,
      fixture: value('gameFixture'),
      date: value('gameDate'),
      score: value('gameScore')
    });
    finishForm(event.target, 'gameId', data);
  });

  document.getElementById('teamMemberReset')?.addEventListener('click', () => resetForm('teamMemberForm', 'teamMemberId', data));
  document.getElementById('adminUserReset')?.addEventListener('click', () => resetForm('adminUserForm', 'adminUserId', data));

  document.body.addEventListener('click', (event) => {
    const edit = event.target.closest('[data-edit]');
    if (!edit) return;
    const [collection, id] = edit.dataset.edit.split(':');
    const record = data[collection].find((item) => item.id === id);
    if (record) hydrateForm(collection, record, data);
  });
}

function renderAll(data) {
  renderMemberOptions(data);
  renderTeamMembers(data);
  renderAdmins(data);
  renderAcademies(data);
  renderGames(data);
  renderSettings();
}

function renderMemberOptions(data, currentAcademy = '') {
  const select = document.getElementById('teamMemberAcademy');
  if (!select) return;
  const assigned = new Set(data.teamMembers.map((member) => member.academy).filter((academy) => academy && academy !== currentAcademy));
  select.innerHTML = '<option value="">Assign Team Member</option>' + data.academies
    .filter((academy) => !assigned.has(academy.name) || academy.name === currentAcademy)
    .map((academy) => `<option value="${escapeAttr(academy.name)}">${escapeHtml(academy.name)}</option>`)
    .join('');
  if (currentAcademy) select.value = currentAcademy;
}

function renderTeamMembers(data) {
  const target = document.getElementById('teamMembersTable');
  if (!target) return;
  target.innerHTML = data.teamMembers.map((member) => `
    <tr>
      <td class="fw-bold text-primary">${escapeHtml(member.name)}</td>
      <td>${escapeHtml(member.academy)}</td>
      <td>${escapeHtml(member.email)}</td>
      <td class="text-end"><button class="btn btn-sm btn-light border" data-edit="teamMembers:${escapeAttr(member.id)}">Edit</button></td>
    </tr>
  `).join('');
}

function renderAdmins(data) {
  const target = document.getElementById('adminsTable');
  if (!target) return;
  target.innerHTML = data.adminUsers.map((admin) => `
    <tr>
      <td class="fw-bold text-primary">${escapeHtml(admin.name)}</td>
      <td>${escapeHtml(admin.role)}</td>
      <td>${escapeHtml(admin.email)}</td>
      <td class="text-end"><button class="btn btn-sm btn-light border" data-edit="adminUsers:${escapeAttr(admin.id)}">Edit</button></td>
    </tr>
  `).join('');
}

function renderAcademies(data) {
  const target = document.getElementById('academyTable');
  if (!target) return;
  target.innerHTML = data.academies.map((academy) => {
    const member = data.teamMembers.find((item) => item.academy === academy.name);
    const logo = academy.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(academy.name)}&background=0b3d2e&color=fff&size=88`;
    return `
      <tr>
        <td><img src="${escapeAttr(logo)}" width="44" height="44" class="rounded-circle" style="object-fit:cover;" alt="${escapeAttr(academy.name)}"></td>
        <td class="fw-bold text-primary">${escapeHtml(academy.name)}</td>
        <td>${escapeHtml(academy.location)}</td>
        <td>${member ? `${escapeHtml(member.name)}<br><span class="small text-muted">${escapeHtml(member.email)}</span>` : '<span class="text-muted">Unassigned</span>'}</td>
        <td class="text-end"><button class="btn btn-sm btn-light border" data-edit="academies:${escapeAttr(academy.id)}">Edit</button></td>
      </tr>
    `;
  }).join('');
}

function renderGames(data) {
  const target = document.getElementById('gamesList');
  if (!target) return;
  target.innerHTML = data.games.map((game) => `
    <div class="border-top border-light border-opacity-25 py-3">
      <div class="fw-bold">${escapeHtml(game.fixture)}</div>
      <div class="small opacity-75">${escapeHtml(game.date)} · ${escapeHtml(game.score)}</div>
      <button class="btn btn-sm btn-outline-light mt-2" data-edit="games:${escapeAttr(game.id)}">Edit</button>
    </div>
  `).join('') || '<p class="opacity-75 mb-0">No past games yet.</p>';
}

function renderSettings() {
  const settings = readJson('zfSettings');
  if (settings.registrationOpen) document.getElementById('registrationOpen').value = settings.registrationOpen;
  if (settings.registrationClose) document.getElementById('registrationClose').value = settings.registrationClose;
}

function hydrateForm(collection, record, data) {
  if (collection === 'teamMembers') {
    setValue('teamMemberId', record.id);
    setValue('teamMemberName', record.name);
    setValue('teamMemberEmail', record.email);
    renderMemberOptions(data, record.academy);
    setValue('teamMemberAcademy', record.academy);
  }
  if (collection === 'adminUsers') {
    setValue('adminUserId', record.id);
    setValue('adminUserName', record.name);
    setValue('adminUserEmail', record.email);
    setValue('adminUserRole', record.role);
  }
  if (collection === 'academies') {
    setValue('academyId', record.id);
    setValue('academyName', record.name);
    setValue('academyLocation', record.location);
    setValue('academyLogo', record.logo || '');
  }
  if (collection === 'games') {
    setValue('gameId', record.id);
    setValue('gameFixture', record.fixture);
    setValue('gameDate', record.date);
    setValue('gameScore', record.score);
  }
}

function finishForm(form, hiddenId, data) {
  persistAdminData(data);
  form.reset();
  setValue(hiddenId, '');
  renderAll(data);
  showMessage('Saved.');
}

function resetForm(formId, hiddenId, data) {
  document.getElementById(formId)?.reset();
  setValue(hiddenId, '');
  renderMemberOptions(data);
}

function getAdminData() {
  const stored = readJson('zfAdminData');
  return {
    teamMembers: stored.teamMembers || [
      { id: 'tm-1', name: 'Lillian Tembo', academy: 'North Star Elite', email: 'lillian@northstar.test' },
      { id: 'tm-2', name: 'Peter Daka', academy: 'Vortex Youth', email: 'peter@vortex.test' }
    ],
    adminUsers: stored.adminUsers || [
      { id: 'ad-1', name: 'Mary Phiri', role: 'League Admin', email: 'mary@zf.test' }
    ],
    academies: stored.academies || [],
    games: stored.games || [
      { id: 'gm-1', fixture: 'North Star Elite vs Vortex Youth', date: '2026-03-12', score: '2-1' }
    ]
  };
}

function persistAdminData(data) {
  localStorage.setItem('zfAdminData', JSON.stringify(data));
  localStorage.setItem('zfAcademies', JSON.stringify(data.academies));
}

function upsert(collection, record) {
  const index = collection.findIndex((item) => item.id === record.id);
  if (index === -1) collection.unshift(record);
  else collection[index] = { ...collection[index], ...record };
}

function mergeById(base, extra) {
  return [...new Map([...(Array.isArray(base) ? base : []), ...(Array.isArray(extra) ? extra : [])].map((item) => [item.id, item])).values()];
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
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch (error) {
    return {};
  }
}

function readArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function value(id) {
  return document.getElementById(id)?.value.trim() || '';
}

function setValue(id, valueText) {
  const el = document.getElementById(id);
  if (el) el.value = valueText || '';
}

function showMessage(message) {
  const toast = document.createElement('div');
  toast.className = 'position-fixed top-0 end-0 m-3 alert alert-success fw-bold shadow';
  toast.style.zIndex = '2000';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1600);
}

function escapeHtml(valueText) {
  return String(valueText || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
}

function escapeAttr(valueText) {
  return escapeHtml(valueText).replace(/`/g, '&#096;');
}
