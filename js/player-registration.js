'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const firstNameInput = document.getElementById('firstName');
  const middleNameInput = document.getElementById('middleName');
  const lastNameInput = document.getElementById('lastName');
  const dobInput = document.getElementById('dob');
  const ageGroupInput = document.getElementById('ageGroup');
  const academyInput = document.getElementById('academy');
  const submitLabel = document.getElementById('submitLabel');
  const submitButton = document.getElementById('submitBtn');
  const subtitle = document.querySelector('.lead.mb-0');
  const params = new URLSearchParams(window.location.search);
  const session = window.zfApp?.getSession?.() || null;
  const editingPlayerId = params.get('id');
  const existingPlayers = getStoredPlayers();
  const editingPlayer = editingPlayerId
    ? existingPlayers.find((player) => player.id === editingPlayerId)
    : null;

  if (!form) return;

  if (session?.role === 'member' && academyInput) {
    academyInput.value = session.academyName || academyInput.value;
    academyInput.readOnly = true;
    academyInput.classList.add('bg-light');
  }

  prefillForm(params, editingPlayer);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const playerRecord = buildPlayerRecord({
      editingPlayerId,
      previousRecord: editingPlayer,
      firstNameInput,
      middleNameInput,
      lastNameInput,
      dobInput,
      ageGroupInput,
      academyInput,
      session
    });

    if (!playerRecord) {
      window.alert('Members can only edit players in their own academy.');
      return;
    }

    const mergedPlayers = mergePlayerRecord(existingPlayers, playerRecord);
    persistPlayers(mergedPlayers);

    submitButton.disabled = true;
    submitLabel.textContent = editingPlayer ? 'SAVED' : 'REGISTERED';

    window.setTimeout(() => {
      window.location.href = `player-profile.html?id=${encodeURIComponent(playerRecord.id)}`;
    }, 500);
  });

  function prefillForm(queryParams, currentPlayer) {
    const player = currentPlayer || mapQueryParamsToPlayer(queryParams);
    if (!player) return;

    firstNameInput.value = player.firstName || '';
    middleNameInput.value = player.middleName || '';
    lastNameInput.value = player.lastName || '';
    dobInput.value = player.dob || '';
    academyInput.value = player.academy || academyInput.value;

    if (player.division || player.ageGroup) {
      ageGroupInput.value = player.division || player.ageGroup;
    }

    if (submitLabel) {
      submitLabel.textContent = 'UPDATE PLAYER';
    }

    if (subtitle) {
      subtitle.textContent = `Editing: ${player.firstName || ''} ${player.lastName || ''}`.trim();
    }
  }
});

function getStoredPlayers() {
  try {
    const rawPlayers = localStorage.getItem('zfPlayers');
    return rawPlayers ? JSON.parse(rawPlayers) : [];
  } catch (error) {
    console.warn('[player-registration] Failed to parse zfPlayers:', error);
    return [];
  }
}

function persistPlayers(players) {
  localStorage.setItem('zfPlayers', JSON.stringify(players));
  localStorage.setItem('prc_players', JSON.stringify(players));
}

function buildPlayerRecord({ editingPlayerId, previousRecord, firstNameInput, middleNameInput, lastNameInput, dobInput, ageGroupInput, academyInput, session }) {
  const currentAcademy = academyInput.value.trim();

  if (session?.role === 'member' && previousRecord && previousRecord.academy !== session.academyName) {
    return null;
  }

  const firstName = firstNameInput.value.trim();
  const middleName = middleNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const division = ageGroupInput.value;
  const dob = dobInput.value;
  const age = calculateAge(dob);
  const academy = session?.role === 'member' ? session.academyName : currentAcademy;
  const position = previousRecord?.position || 'Midfielder';
  const id = editingPlayerId || previousRecord?.id || createPlayerId(firstName, lastName);

  return {
    id,
    firstName,
    middleName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    dob,
    age,
    division,
    ageGroup: division,
    academy,
    academyId: academy.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    position,
    status: previousRecord?.status || 'Active',
    nationality: previousRecord?.nationality || 'Zambian',
    photo: previousRecord?.photo || 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80',
    coach: previousRecord?.coach || { name: 'Victor Mwembe' },
    manager: previousRecord?.manager || { name: 'Sarah Lungu' },
    medical: previousRecord?.medical || {
      clearance: 'Cleared',
      lastCheck: '2026-01-18',
      conditions: []
    },
    seasons: previousRecord?.seasons || [
      {
        season: '2025/2026',
        matchesPlayed: 12,
        goals: 4,
        assists: 3,
        performance: {
          touches: 78,
          chancesCreated: 68,
          aerialDuelsWon: 54,
          defensiveContributions: 60,
          goals: 65,
          shotAttempts: 58
        },
        matchHistory: [
          { date: '2026-03-17', opponent: 'Copperbelt High Flyers', result: 'Win', score: '3-1', rating: 8.1 },
          { date: '2026-03-10', opponent: 'North Valley Academy', result: 'Draw', score: '1-1', rating: 7.4 }
        ]
      }
    ],
    ownerRole: session?.role || 'member',
    ownerAcademy: academy
  };
}

function mergePlayerRecord(players, nextRecord) {
  const existingIndex = players.findIndex((player) => player.id === nextRecord.id);
  if (existingIndex === -1) {
    return [...players, nextRecord];
  }

  const updatedPlayers = [...players];
  updatedPlayers[existingIndex] = {
    ...updatedPlayers[existingIndex],
    ...nextRecord
  };
  return updatedPlayers;
}

function mapQueryParamsToPlayer(params) {
  if (!params.toString()) return null;

  return {
    firstName: params.get('first') || '',
    middleName: params.get('middle') || '',
    lastName: params.get('last') || '',
    division: params.get('age') || '',
    academy: params.get('academy') || '',
    dob: params.get('dob') || ''
  };
}

function calculateAge(dob) {
  if (!dob) return 0;

  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

function createPlayerId(firstName, lastName) {
  const initials = `${firstName[0] || 'P'}${lastName[0] || 'R'}`.toUpperCase();
  const randomDigits = String(Date.now()).slice(-4);
  return `PRC-${randomDigits}-${initials}`;
}
