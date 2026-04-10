/* ============================================================
   Kondwani_PlayerProfile.js
   Player Profile Management – Plain JavaScript (no frameworks)
   Features:
     1. Player Profile Management (edit details + photo upload)
     2. Medical Reports panel
     3. Match History + Radar (spider) chart
     4. Print / Download with PRC ID + season rating
   ============================================================ */

'use strict';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let playerData       = null;   // loaded from players.json
let currentSeason    = null;   // the active season object
let radarChart       = null;   // canvas rendering context ref (for redraw)
let photoDataURL     = null;   // base-64 of uploaded photo (if changed)

// ─────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadPlayerData();
});

// ─────────────────────────────────────────────
// 1. DATA LOADING
// ─────────────────────────────────────────────
function loadPlayerData() {
    fetch('../data/players.json')
        .then(r => {
            if (!r.ok) throw new Error('Failed to load players.json');
            return r.json();
        })
        .then(data => {
            /* Grab first player (extend later to support query-param ?id=) */
            const params = new URLSearchParams(window.location.search);
            const targetId = params.get('id');
            playerData = targetId
                ? data.find(p => p.id === targetId) || data[0]
                : data[0];

            currentSeason = playerData.seasons[0];
            renderPage();
            wireButtons();
        })
        .catch(err => {
            console.error(err);
            showToast('Could not load player data. Using static page.', 'error');
        });
}

// ─────────────────────────────────────────────
// 2. PAGE RENDER (hydrate static HTML with data)
// ─────────────────────────────────────────────
function renderPage() {
    if (!playerData) return;

    /* Header */
    setTextContent('#player-name-heading',    `${playerData.firstName} ${playerData.lastName}`);
    setTextContent('#player-name-breadcrumb', `${playerData.firstName} ${playerData.lastName}`);
    setTextContent('#player-division-badge',  `Division ${playerData.division}`);
    setTextContent('#player-academy-label',   playerData.academy);

    /* Hero photo */
    const heroImg = document.getElementById('player-hero-img');
    if (heroImg) heroImg.src = playerData.photo;

    /* Hero overlay */
    setTextContent('#player-overlay-status', `Status: ${playerData.status}`);
    setTextContent('#player-overlay-name',   `${playerData.firstName[0]}. ${playerData.lastName.toUpperCase()}`);

    /* Personal details card */
    setTextContent('#detail-dob',         formatDate(playerData.dob));
    setTextContent('#detail-prc-id',      playerData.id);
    setTextContent('#detail-nationality', playerData.nationality);
    setTextContent('#detail-position',    playerData.position);

    /* ID card */
    setTextContent('#id-card-name-first', playerData.firstName.toUpperCase());
    setTextContent('#id-card-name-last',  playerData.lastName.toUpperCase());
    setTextContent('#id-card-id',         playerData.id);
    const idCardImg = document.getElementById('id-card-thumb');
    if (idCardImg) idCardImg.src = playerData.photo;

    /* Assigned Officials */
    setTextContent('#coach-name',   playerData.coach.name);
    setTextContent('#manager-name', playerData.manager.name);

    /* Season rating */
    updateSeasonRating();

    /* Season selector */
    populateSeasonSelector();
}

function setTextContent(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─────────────────────────────────────────────
// 3. SEASON SELECTOR
// ─────────────────────────────────────────────
function populateSeasonSelector() {
    const sel = document.getElementById('season-selector');
    if (!sel || !playerData) return;
    sel.innerHTML = '';
    playerData.seasons.forEach((s, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = s.season;
        sel.appendChild(opt);
    });
    sel.addEventListener('change', () => {
        currentSeason = playerData.seasons[parseInt(sel.value, 10)];
        updateSeasonRating();
        renderMatchHistory();
        renderRadarChart();
    });
}

// ─────────────────────────────────────────────
// 4. SEASON RATING CALCULATION
// ─────────────────────────────────────────────
function calculateSeasonRating(season) {
    if (!season) return 0;
    const p = season.performance;
    const weights = {
        touches:                 0.10,
        chancesCreated:          0.20,
        aerialDuelsWon:          0.10,
        defensiveContributions:  0.10,
        goals:                   0.35,
        shotAttempts:            0.15
    };
    let score = 0;
    for (const key in weights) {
        score += ((p[key] || 0) / 100) * weights[key];
    }
    /* Scale to 0-10 with a small goals/matches bonus */
    const baseRating = score * 10;
    const goalBonus  = Math.min((season.goals / Math.max(season.matchesPlayed, 1)) * 0.5, 0.5);
    return Math.min(10, (baseRating + goalBonus)).toFixed(1);
}

function updateSeasonRating() {
    const rating = calculateSeasonRating(currentSeason);
    setTextContent('#season-rating-value', rating);

    /* Percentile badge */
    const badge = document.getElementById('season-rating-badge');
    if (badge) {
        const r = parseFloat(rating);
        if      (r >= 8.5) badge.textContent = '⬆ Top 5% in Division';
        else if (r >= 7.5) badge.textContent = '⬆ Top 15% in Division';
        else if (r >= 6.5) badge.textContent = '⬆ Top 30% in Division';
        else               badge.textContent = 'Keep improving!';
    }
}

// ─────────────────────────────────────────────
// 5. WIRE ALL BUTTONS
// ─────────────────────────────────────────────
function wireButtons() {
    /* Edit Info */
    const editBtn = document.getElementById('btn-edit-info');
    if (editBtn) editBtn.addEventListener('click', openEditModal);

    /* Medical Reports */
    const medBtn = document.getElementById('btn-medical-reports');
    if (medBtn) medBtn.addEventListener('click', openMedicalPanel);

    /* Match History */
    const histBtn = document.getElementById('btn-match-history');
    if (histBtn) histBtn.addEventListener('click', openMatchHistory);

    /* Print/Download */
    const printBtn  = document.getElementById('btn-print-id');
    const printBtn2 = document.getElementById('btn-download-id-card');
    if (printBtn)  printBtn.addEventListener('click',  openPrintModal);
    if (printBtn2) printBtn2.addEventListener('click', openPrintModal);

    /* Photo upload trigger */
    const photoUploadInput = document.getElementById('photo-upload-input');
    if (photoUploadInput) photoUploadInput.addEventListener('change', handlePhotoUpload);

    /* Modal close buttons */
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-modal-close');
            closeModal(targetId);
        });
    });

    /* Backdrop close */
    document.querySelectorAll('.kpp-modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', e => {
            if (e.target === backdrop) closeModal(backdrop.id);
        });
    });

    /* Edit form submit */
    const editForm = document.getElementById('edit-profile-form');
    if (editForm) editForm.addEventListener('submit', handleEditSubmit);
}

// ─────────────────────────────────────────────
// 6. MODAL HELPERS
// ─────────────────────────────────────────────
function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('is-open');
    document.body.style.overflow = '';
}

// ─────────────────────────────────────────────
// 7. PROFILE EDIT MODAL
// ─────────────────────────────────────────────
function openEditModal() {
    if (!playerData) return;

    /* Pre-fill form */
    setVal('edit-first-name',   playerData.firstName);
    setVal('edit-last-name',    playerData.lastName);
    setVal('edit-dob',          playerData.dob);
    setVal('edit-nationality',  playerData.nationality);
    setVal('edit-position',     playerData.position);
    setVal('edit-division',     playerData.division);
    setVal('edit-academy',      playerData.academy);
    setVal('edit-status',       playerData.status);

    /* Preview photo */
    const preview = document.getElementById('edit-photo-preview');
    if (preview) preview.src = photoDataURL || playerData.photo;

    openModal('modal-edit-profile');
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file.', 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
        photoDataURL = ev.target.result;
        const preview = document.getElementById('edit-photo-preview');
        if (preview) preview.src = photoDataURL;
    };
    reader.readAsDataURL(file);
}

function handleEditSubmit(e) {
    e.preventDefault();

    /* Update in-memory player object */
    playerData.firstName   = getVal('edit-first-name');
    playerData.lastName    = getVal('edit-last-name');
    playerData.dob         = getVal('edit-dob');
    playerData.nationality = getVal('edit-nationality');
    playerData.position    = getVal('edit-position');
    playerData.division    = getVal('edit-division');
    playerData.academy     = getVal('edit-academy');
    playerData.status      = getVal('edit-status');

    if (photoDataURL) playerData.photo = photoDataURL;

    /* Re-render page */
    renderPage();

    closeModal('modal-edit-profile');
    showToast('Profile updated successfully!', 'success');
}

function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

// ─────────────────────────────────────────────
// 8. MEDICAL PANEL
// ─────────────────────────────────────────────
function openMedicalPanel() {
    if (!playerData) return;
    const m = playerData.medical;

    setTextContent('#med-blood-type',       m.bloodType   || '—');
    setTextContent('#med-height',           m.height      || '—');
    setTextContent('#med-weight',           m.weight      || '—');
    setTextContent('#med-allergies',        m.allergies   || 'None');
    setTextContent('#med-last-checkup',     formatDate(m.lastCheckup));
    setTextContent('#med-clearance',        m.clearanceStatus || '—');
    setTextContent('#med-notes',            m.notes       || 'No notes on record.');

    /* Colour-code clearance badge */
    const badge = document.getElementById('med-clearance');
    if (badge) {
        badge.className = 'kpp-status-badge';
        badge.classList.add(
            m.clearanceStatus === 'Cleared' ? 'kpp-badge--green' : 'kpp-badge--red'
        );
    }

    /* Conditions list */
    const condList = document.getElementById('med-conditions-list');
    if (condList) {
        condList.innerHTML = m.conditions && m.conditions.length
            ? m.conditions.map(c => `<li>${c}</li>`).join('')
            : '<li class="text-muted">No recorded conditions.</li>';
    }

    openModal('modal-medical');
}

// ─────────────────────────────────────────────
// 9. MATCH HISTORY + RADAR CHART
// ─────────────────────────────────────────────
function openMatchHistory() {
    renderMatchHistory();
    renderRadarChart();
    openModal('modal-match-history');
}

/* 9a. Stats summary + match table */
function renderMatchHistory() {
    if (!currentSeason) return;

    setTextContent('#stat-matches',  currentSeason.matchesPlayed);
    setTextContent('#stat-goals',    currentSeason.goals);
    setTextContent('#stat-assists',  currentSeason.assists);
    setTextContent('#stat-season-label', currentSeason.season);

    const tbody = document.getElementById('match-history-tbody');
    if (!tbody) return;

    if (!currentSeason.matches || !currentSeason.matches.length) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No match data available.</td></tr>`;
        return;
    }

    tbody.innerHTML = currentSeason.matches.map(m => {
        const resultClass = m.result.startsWith('W') ? 'kpp-result--win'
                          : m.result.startsWith('L') ? 'kpp-result--loss'
                          : 'kpp-result--draw';
        return `<tr>
            <td>${formatDate(m.date)}</td>
            <td>${m.opponent}</td>
            <td><span class="kpp-result-badge ${resultClass}">${m.result}</span></td>
            <td>${m.goals} / ${m.assists}</td>
            <td><span class="kpp-rating-chip" data-rating="${m.rating}">${m.rating}</span></td>
        </tr>`;
    }).join('');

    /* Colour-code rating chips */
    tbody.querySelectorAll('.kpp-rating-chip').forEach(chip => {
        const r = parseFloat(chip.dataset.rating);
        chip.style.background = r >= 8 ? '#1a7a4a' : r >= 6.5 ? '#b68b2c' : '#7a1a1a';
    });
}

/* 9b. Radar (spider) chart */
function renderRadarChart() {
    const canvas = document.getElementById('radar-chart-canvas');
    if (!canvas || !currentSeason) return;

    const ctx = canvas.getContext('2d');
    const W   = canvas.width;
    const H   = canvas.height;
    const cx  = W / 2;
    const cy  = H / 2;
    const R   = Math.min(W, H) * 0.38; // radius to 100%

    const labels = [
        'Touches',
        'Chances Created',
        'Aerial Duels Won',
        'Defensive\nContributions',
        'Goals',
        'Shot Attempts'
    ];

    const p    = currentSeason.performance;
    const vals = [
        p.touches               / 100,
        p.chancesCreated        / 100,
        p.aerialDuelsWon        / 100,
        p.defensiveContributions/ 100,
        p.goals                 / 100,
        p.shotAttempts          / 100
    ];

    const N     = labels.length;
    const step  = (2 * Math.PI) / N;
    const start = -Math.PI / 2; // top

    ctx.clearRect(0, 0, W, H);

    /* ── Background ── */
    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, 0, W, H);

    /* ── Grid rings (10 rings = 10% each) ── */
    const rings = 10;
    for (let ring = 1; ring <= rings; ring++) {
        const rr = (ring / rings) * R;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
            const angle = start + i * step;
            const x = cx + rr * Math.cos(angle);
            const y = cy + rr * Math.sin(angle);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = ring % 5 === 0
            ? 'rgba(255,255,255,0.25)'   // bolder at 50% and 100%
            : 'rgba(255,255,255,0.10)';
        ctx.lineWidth = ring % 5 === 0 ? 1.2 : 0.7;
        ctx.stroke();

        /* Percentage labels on right spoke at 20%, 40%, 60%, 80%, 100% */
        if (ring % 2 === 0) {
            const labelAngle = start;               // top spoke
            const lx = cx + rr * Math.cos(start + step * 0) + 6;
            const ly = cy + rr * Math.sin(start + step * 0);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '9px Montserrat, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`${ring * 10}%`, lx, ly + 3);
        }
    }

    /* ── Axis spokes ── */
    for (let i = 0; i < N; i++) {
        const angle = start + i * step;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth   = 1;
        ctx.stroke();
    }

    /* ── Filled player polygon ── */
    ctx.beginPath();
    vals.forEach((v, i) => {
        const angle = start + i * step;
        const x = cx + v * R * Math.cos(angle);
        const y = cy + v * R * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();

    /* Fill */
    ctx.fillStyle = 'rgba(26, 122, 74, 0.35)';
    ctx.fill();

    /* Stroke */
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth   = 2.5;
    ctx.stroke();

    /* Data point dots */
    vals.forEach((v, i) => {
        const angle = start + i * step;
        const x = cx + v * R * Math.cos(angle);
        const y = cy + v * R * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
        ctx.strokeStyle = '#0d1b2a';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    });

    /* ── Axis labels ── */
    ctx.fillStyle  = '#ffffff';
    ctx.font       = 'bold 11px Montserrat, sans-serif';

    labels.forEach((label, i) => {
        const angle  = start + i * step;
        const pad    = 24;
        const lx     = cx + (R + pad) * Math.cos(angle);
        const ly     = cy + (R + pad) * Math.sin(angle);

        /* Alignment based on position */
        if      (Math.cos(angle) > 0.5)  ctx.textAlign = 'left';
        else if (Math.cos(angle) < -0.5) ctx.textAlign = 'right';
        else                              ctx.textAlign = 'center';

        const lines = label.split('\n');
        lines.forEach((line, li) => {
            ctx.fillText(line, lx, ly + li * 13);
        });

        /* Value annotation */
        const pct   = Math.round(vals[i] * 100);
        const ax    = cx + (R + pad + (lines.length > 1 ? 2 : 0)) * Math.cos(angle);
        const ay    = ly + lines.length * 13;
        ctx.fillStyle  = '#22c55e';
        ctx.font       = 'bold 9px Montserrat, sans-serif';
        ctx.fillText(`${pct}%`, ax, ay);
        ctx.fillStyle  = '#ffffff';
        ctx.font       = 'bold 11px Montserrat, sans-serif';
    });
}

// ─────────────────────────────────────────────
// 10. PRINT / DOWNLOAD
// ─────────────────────────────────────────────
function openPrintModal() {
    if (!playerData) return;

    /* Generate unique PRC ID if not already fully set */
    const prcId = generatePRCId();

    /* Season rating */
    const rating = calculateSeasonRating(currentSeason);

    /* Populate print card */
    setTextContent('#print-player-name',  `${playerData.firstName} ${playerData.lastName}`);
    setTextContent('#print-prc-id',       prcId);
    setTextContent('#print-position',     playerData.position);
    setTextContent('#print-academy',      playerData.academy);
    setTextContent('#print-division',     `Division ${playerData.division}`);
    setTextContent('#print-season',       currentSeason ? currentSeason.season : '—');
    setTextContent('#print-rating',       rating);
    setTextContent('#print-matches',      currentSeason ? currentSeason.matchesPlayed : '—');
    setTextContent('#print-goals',        currentSeason ? currentSeason.goals : '—');
    setTextContent('#print-assists',      currentSeason ? currentSeason.assists : '—');
    setTextContent('#print-issued-date',  new Date().toLocaleDateString('en-GB'));

    const ratingBadge = document.getElementById('print-rating-badge');
    if (ratingBadge) {
        const r = parseFloat(rating);
        ratingBadge.textContent = r >= 8.5 ? 'ELITE'
                                : r >= 7   ? 'ADVANCED'
                                : r >= 5.5 ? 'DEVELOPING'
                                : 'BEGINNER';
        ratingBadge.className = 'kpp-print-tier-badge';
        ratingBadge.classList.add(
            r >= 8.5 ? 'kpp-tier--elite'
          : r >= 7   ? 'kpp-tier--advanced'
          : r >= 5.5 ? 'kpp-tier--developing'
          : 'kpp-tier--beginner'
        );
    }

    const printPhoto = document.getElementById('print-player-photo');
    if (printPhoto) printPhoto.src = playerData.photo;

    openModal('modal-print');

    /* Wire download button */
    const dlBtn = document.getElementById('btn-trigger-print');
    if (dlBtn) {
        dlBtn.onclick = triggerPrint;
    }
}

function generatePRCId() {
    /* Format: ZF-YYYY-NNNN-initials */
    if (playerData.id) return playerData.id;
    const year     = new Date().getFullYear();
    const num      = Math.floor(1000 + Math.random() * 9000);
    const initials = `${playerData.firstName[0]}${playerData.lastName[0]}`.toUpperCase();
    const newId    = `ZF-${year}-${num}-${initials}`;
    playerData.id  = newId;
    return newId;
}

function triggerPrint() {
    /* Hide modal chrome, print, restore */
    const modalChrome = document.querySelectorAll('.kpp-modal-header, .kpp-modal-footer');
    modalChrome.forEach(el => el.style.display = 'none');
    window.print();
    modalChrome.forEach(el => el.style.display = '');
}

// ─────────────────────────────────────────────
// 11. TOAST NOTIFICATIONS
// ─────────────────────────────────────────────
function showToast(message, type = 'info') {
    let container = document.getElementById('kpp-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'kpp-toast-container';
        container.style.cssText = `
            position:fixed; bottom:1.5rem; right:1.5rem;
            z-index:9999; display:flex; flex-direction:column; gap:0.5rem;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
        padding:0.75rem 1.25rem; border-radius:8px; color:#fff;
        font-weight:600; font-size:0.875rem; font-family:Montserrat,sans-serif;
        box-shadow:0 4px 16px rgba(0,0,0,0.3);
        background: ${type === 'success' ? '#1a7a4a' : type === 'error' ? '#7a1a1a' : '#0a2e22'};
        animation: kppSlideIn 0.3s ease;
        max-width: 300px;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
