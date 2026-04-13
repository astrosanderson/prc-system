/* ============================================================
   Enos_academy.js — Academy Profile Page Logic
   Zambezi Futures | PRC System
   ============================================================
   Responsibilities:
   - Load and merge player data (static seed + localStorage registrations)
   - Render the player roster table dynamically
   - Division filter tabs (All / U-15 / U-17 / U-20) with active state
   - Live search filtering by player name or PRC ID
   - Dynamic metric cards (Total Players, U-17 count, Average Age)
   - Filter panel (sort by name / age / division)
   - Smooth row animations on filter/search
   - Highlight rows that match search term
   - 👁  Eye icon  → opens inline Player Profile modal
   - ✏  Pencil icon → opens inline Edit Player modal, pre-filled
   - ➕ Edit/Register header button → opens blank Register Player modal
   ============================================================ */

'use strict';

/* ============================================================
   SEED DATA — mirrors the two static rows already in the HTML.
   Any players registered via player-registration.html (saved in localStorage
   under the key "prc_players") are merged in at runtime so the
   table always shows the full, up-to-date roster.
   ============================================================ */
const SEED_PLAYERS = [
    {
        id: 'PRC-9921-X',
        firstName: 'Tendai',
        lastName: 'Mokoena',
        position: 'Forward',
        age: 16,
        division: 'U-17',
        academy: 'Zambezi Elite Academy',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7cYZwrMsasjbebsPBQIns0eUoP2WsxToHubdXKYqJ6rYzS24NZkRA4WGbLddRWTVlgH6keHvW_e7LG9b7UWjTjl-LXYw3X8NFgUkwdfFiLzr1lSmXaKbOl-6Qer6i9jlpOG04jyTPyxjRfSoAkfL1o28VI_omF5y1tI1WCU011xQiNHVgvS5Ismg0CENWSMsO9lRTmfY9TLxIpunADOpfjVGTTQvoX9dZqY_XuIoCWUEAIGrJl3YbOgIvQB8RHkBreI_8rQuWc9o'
    },
    {
        id: 'PRC-4452-A',
        firstName: 'Khensani',
        lastName: 'Dlamini',
        position: 'Midfielder',
        age: 14,
        division: 'U-15',
        academy: 'Zambezi Elite Academy',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnyqFRlciQ2JinHqw7fftSThmU2CrGcL7qKi88RkWlzVZmVNSCVm6AZHf2BtW5dfezOJSqlAe0W6GGJ-aeJMALzQZXscpYJcrzEEjXzuhGcfd7zybQj1B36YUXGdJ2NiqWDb4D6sjZEzHMWHefJGJVlwdP8Bf_sfl_IQQyVhIa2qvNr7hztzu9qegavuh88w_zVFdX7HrprucWidzdUoziD8_ho3oLFE5qqRxHZqfV8Pco821UZ2vysRRyvXpIb5e_FT4Dne1yEpw'
    }
];

/* ============================================================
   DIVISION BADGE CONFIG
   Maps a division string to Bootstrap badge classes.
   ============================================================ */
const DIVISION_BADGE = {
    'U-15': 'badge bg-warning bg-opacity-10 text-warning-emphasis rounded-pill px-3 py-2 fw-bold border border-warning border-opacity-25',
    'U-17': 'badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-bold border border-success border-opacity-25',
    'U-20': 'badge bg-info bg-opacity-10 text-info rounded-pill px-3 py-2 fw-bold border border-info border-opacity-25'
};

/* ============================================================
   STATE — single source of truth for the current view
   ============================================================ */
const state = {
    allPlayers: [],       // full merged roster
    filtered: [],         // players currently displayed
    activeDiv: 'All',     // active division tab
    searchQuery: '',      // current search string
    sortKey: 'name',      // 'name' | 'age' | 'division'
    sortDir: 'asc'        // 'asc' | 'desc'
};

/* ============================================================
   ENTRY POINT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    loadAcademyContext();
    injectModalStyles();
    loadPlayers();
    render();

    initDivisionTabs();
    initSearch();
    initFilterPanel();
    initSortableHeaders();
    initModals();
});

/* ============================================================
   DATA — load & merge seed + localStorage registrations
   ============================================================ */
function loadPlayers() {
    // Grab anything saved by the player registration flow
    let stored = [];
    try {
        const raw = localStorage.getItem('zfPlayers') || localStorage.getItem('prc_players');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) stored = parsed;
        }
    } catch (err) {
        console.warn('[Enos_academy] Could not parse prc_players from localStorage:', err);
    }

    // Merge: seed first, then stored (avoid duplicates by PRC ID)
    const seenIds = new Set();
    const merged = [];

    [...SEED_PLAYERS, ...stored].forEach(p => {
        const pid = (p.id || p.prcId || '').trim().toUpperCase();
        if (!pid || seenIds.has(pid)) return;
        seenIds.add(pid);

        // Normalise field names — registration flows may use different keys
        merged.push({
            id: pid,
            firstName: p.firstName || p.first || 'Unknown',
            lastName: p.lastName || p.last || '',
            position: p.position || '—',
            age: Number(p.age) || 0,
            division: normaliseDivision(p.division || p.ageGroup || p['age-group'] || ''),
            academy: p.academy || 'Zambezi Elite Academy',
            photo: p.photo || p.photoUrl || ''
        });
    });

    state.allPlayers = merged;
    applyFilters();
}

function loadAcademyContext() {
    const params = new URLSearchParams(window.location.search);
    const academyId = params.get('id');
    if (!academyId) return;

    fetch('../data/academies.json')
        .then((response) => response.ok ? response.json() : [])
        .then((academies) => {
            const academy = academies.find((item) => item.id === academyId);
            if (!academy) return;

            const heading = document.querySelector('h1.display-4');
            const summary = document.querySelector('.lead.text-muted');
            const breadcrumbs = document.querySelector('.breadcrumb-item.active');

            if (heading) {
                heading.innerHTML = `${academy.name} <span style="color:var(--accent-color);">Academy</span>`;
            }

            if (summary) {
                summary.textContent = `Comprehensive registry of academy talent across all regional divisions for ${academy.location}.`;
            }

            if (breadcrumbs) {
                breadcrumbs.textContent = academy.name;
            }
        })
        .catch((error) => {
            console.warn('[academies] Failed to load academy context:', error);
        });
}

/** Normalise raw division strings like "u17", "U 17", "under-17" → "U-17" */
function normaliseDivision(raw) {
    if (!raw) return 'U-17';
    const cleaned = raw.toString().toUpperCase().replace(/\s+/g, '').replace('UNDER', 'U');
    if (cleaned.includes('15')) return 'U-15';
    if (cleaned.includes('17')) return 'U-17';
    if (cleaned.includes('20')) return 'U-20';
    return raw; // keep as-is if unrecognised
}

/* ============================================================
   FILTER LOGIC
   ============================================================ */
function applyFilters() {
    let list = [...state.allPlayers];

    // 1. Division tab filter
    if (state.activeDiv !== 'All') {
        list = list.filter(p => p.division === state.activeDiv);
    }

    // 2. Search filter (name or PRC ID)
    const q = state.searchQuery.toLowerCase().trim();
    if (q) {
        list = list.filter(p => {
            const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
            return fullName.includes(q) || p.id.toLowerCase().includes(q);
        });
    }

    // 3. Sort
    list.sort((a, b) => {
        let valA, valB;
        if (state.sortKey === 'name') {
            valA = `${a.firstName} ${a.lastName}`.toLowerCase();
            valB = `${b.firstName} ${b.lastName}`.toLowerCase();
        } else if (state.sortKey === 'age') {
            valA = a.age;
            valB = b.age;
        } else if (state.sortKey === 'division') {
            valA = a.division;
            valB = b.division;
        } else {
            valA = a.id;
            valB = b.id;
        }
        if (valA < valB) return state.sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return state.sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    state.filtered = list;
}

/* ============================================================
   RENDER — update DOM without touching the HTML file
   ============================================================ */
function render() {
    renderTable();
    renderMetrics();
}

/** Re-render the <tbody> with current filtered list */
function renderTable() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    const q = state.searchQuery.toLowerCase().trim();

    if (state.filtered.length === 0) {
        tbody.innerHTML = `
      <tr id="empty-row">
        <td colspan="6" class="text-center py-5 text-muted fw-bold">
          <span class="material-symbols-outlined d-block mb-2" style="font-size:2.5rem;opacity:.35;">
            search_off
          </span>
          No players match your search.
        </td>
      </tr>`;
        return;
    }

    // Build rows, then fade them in
    tbody.innerHTML = state.filtered.map((p, idx) => buildRow(p, q, idx)).join('');

    // Staggered fade-in animation
    tbody.querySelectorAll('tr[data-player-row]').forEach((row, i) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(8px)';
        row.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        // Use requestAnimationFrame to ensure the initial state is painted first
        requestAnimationFrame(() => {
            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, i * 40);
        });
    });
}

/** Build a single <tr> HTML string for a player */
function buildRow(player, highlightQuery, idx) {
    const fullName = `${player.firstName} ${player.lastName}`;
    const divBadgeClass = DIVISION_BADGE[player.division] ||
        'badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-2 fw-bold';
    const canEdit = userCanEditPlayer(player);

    const displayName = highlightQuery
        ? highlight(fullName, highlightQuery)
        : escapeHtml(fullName);

    const avatarUrl = player.photo
        ? player.photo
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1a2e4a&color=fff&size=88&font-size=0.38&bold=true`;

    // Use data-player-id so JS can look up the player and open modals
    return `
    <tr data-player-row data-division="${escapeAttr(player.division)}" data-name="${escapeAttr(fullName)}" data-player-id="${escapeAttr(player.id)}">
      <td class="ps-4">
        <img src="${escapeAttr(avatarUrl)}"
             alt="${escapeAttr(fullName)}"
             class="player-img-table shadow-sm"
             onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1a2e4a&color=fff&size=88'">
      </td>
      <td>
        <h5 class="fw-black mb-0" style="color:var(--primary-color); font-size:0.95rem;">${displayName}</h5>
        <small class="text-muted fw-bold text-uppercase" style="font-size:0.65rem;">${escapeHtml(player.position)}</small>
      </td>
      <td class="fw-bold">${escapeHtml(String(player.age || '—'))}</td>
      <td><span class="${divBadgeClass}">${escapeHtml(player.division)}</span></td>
      <td class="font-monospace text-muted small">${escapeHtml(player.id)}</td>
      <td class="text-end pe-4">
        <div class="d-flex justify-content-end gap-3">
          <!-- Eye icon — opens Player Profile modal -->
          <button class="btn btn-link p-0 prc-view-btn"
                  data-player-id="${escapeAttr(player.id)}"
                  style="color:var(--primary-color,#1a2e4a);"
                  title="View Player Profile">
            <span class="material-symbols-outlined fs-5">visibility</span>
          </button>
          ${canEdit ? `<!-- Pencil icon — opens Edit Player modal pre-filled -->
          <button class="btn btn-link p-0 prc-edit-btn"
                  data-player-id="${escapeAttr(player.id)}"
                  style="color:var(--accent-color,#b68b2c);"
                  title="Edit Player Details">
            <span class="material-symbols-outlined fs-5">edit</span>
          </button>` : ''}
        </div>
      </td>
    </tr>`;
}

function userCanEditPlayer(player) {
    const session = window.zfApp?.getSession?.();
    if (!session) return false;
    if (session.role === 'admin') return true;
    return session.academyName === player.academy;
}

function userCanManageCurrentAcademy() {
    const session = window.zfApp?.getSession?.();
    if (!session) return false;
    if (session.role === 'admin') return true;

    const currentHeading = document.querySelector('h1.display-4')?.textContent || '';
    return currentHeading.toLowerCase().includes((session.academyName || '').toLowerCase());
}

/** Update the three metric cards dynamically based on the full roster */
function renderMetrics() {
    const all = state.allPlayers;
    const total = all.length;
    const u17Count = all.filter(p => p.division === 'U-17').length;
    const avgAge = total
        ? (all.reduce((sum, p) => sum + (Number(p.age) || 0), 0) / total).toFixed(1)
        : '0.0';

    // The metrics are in the three .card elements inside .row.g-4.mb-5 (first one)
    const metricCards = document.querySelectorAll('.row.g-4.mb-5 .card');
    if (!metricCards.length) return;

    // Card 0 — Total Players (display-4 h3)
    const totalEl = metricCards[0]?.querySelector('h3.display-4');
    if (totalEl) animateNumber(totalEl, total);

    // Card 1 — U-17 Division count
    const u17El = metricCards[1]?.querySelector('h3.display-4');
    if (u17El) animateNumber(u17El, u17Count);

    // Card 2 — Average Age (decimal, so no integer animation)
    const avgEl = metricCards[2]?.querySelector('h3.display-4');
    if (avgEl) {
        // Simple crossfade for decimal value
        avgEl.style.transition = 'opacity 0.3s';
        avgEl.style.opacity = '0';
        setTimeout(() => {
            avgEl.textContent = avgAge;
            avgEl.style.opacity = '1';
        }, 150);
    }
}

/** Count-up animation for metric numbers */
function animateNumber(el, target) {
    const duration = 700;
    const start = parseInt(el.textContent) || 0;
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(start + (target - start) * ease);
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

/* ============================================================
   DIVISION FILTER TABS
   ============================================================ */
function initDivisionTabs() {
    // The filter pill group: the first .rounded-pill container in .d-flex
    const tabGroup = document.querySelector('.bg-white.p-1.rounded-pill.shadow-sm');
    if (!tabGroup) return;

    const buttons = tabGroup.querySelectorAll('button');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const divText = btn.textContent.trim(); // "All", "U-15", "U-17", "U-20"

            // Update active state styling
            buttons.forEach(b => {
                b.style.background = '';
                b.style.color = '';
                b.classList.remove('btn-primary');
                b.classList.add('btn-light');
                b.classList.add('text-muted');
            });
            btn.style.background = 'var(--primary-color)';
            btn.style.color = 'white';
            btn.classList.remove('btn-light', 'text-muted');

            state.activeDiv = divText;
            applyFilters();
            render();
        });
    });
}

/* ============================================================
   LIVE SEARCH
   ============================================================ */
function initSearch() {
    const searchInput = document.querySelector('input[type="text"][placeholder]');
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            state.searchQuery = searchInput.value;
            applyFilters();
            renderTable(); // metrics stay the same during search
        }, 180); // 180ms debounce for smooth UX
    });

    // Clear on Escape
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            state.searchQuery = '';
            applyFilters();
            renderTable();
        }
    });
}

/* ============================================================
   FILTER PANEL (Sort popover)
   ============================================================ */
function initFilterPanel() {
    const filterBtn = document.querySelector('button.btn.btn-light.fw-bold');
    if (!filterBtn) return;

    // Build and inject the sort popover once
    const popover = buildFilterPopover();
    document.body.appendChild(popover);

    filterBtn.addEventListener('click', e => {
        e.stopPropagation();
        const open = popover.style.display === 'block';

        if (open) {
            closeFilterPopover(popover);
        } else {
            const rect = filterBtn.getBoundingClientRect();
            popover.style.top = `${rect.bottom + window.scrollY + 8}px`;
            popover.style.left = `${rect.left + window.scrollX}px`;
            popover.style.display = 'block';
            requestAnimationFrame(() => { popover.style.opacity = '1'; popover.style.transform = 'translateY(0)'; });
        }
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
        if (!popover.contains(e.target) && e.target !== filterBtn) {
            closeFilterPopover(popover);
        }
    });
}

function buildFilterPopover() {
    const panel = document.createElement('div');
    panel.id = 'filter-popover';
    panel.style.cssText = `
    position: absolute;
    z-index: 9999;
    display: none;
    opacity: 0;
    transform: translateY(-6px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
    padding: 1rem 1.2rem;
    min-width: 220px;
    font-family: 'Montserrat', sans-serif;
  `;

    panel.innerHTML = `
    <p class="fw-black text-uppercase mb-3" style="font-size:0.7rem;letter-spacing:0.12em;color:var(--primary-color,#1a2e4a);">
      Sort Roster By
    </p>
    <div id="sort-options" class="d-flex flex-column gap-2">
      ${buildSortOption('name', 'badge', 'Name (A – Z)')}
      ${buildSortOption('age', 'cake', 'Age')}
      ${buildSortOption('division', 'group', 'Division')}
      ${buildSortOption('id', 'tag', 'PRC ID')}
    </div>
    <hr class="my-3">
    <div class="d-flex gap-2">
      <button id="sort-asc"  class="btn btn-sm btn-outline-secondary flex-fill fw-bold" style="border-radius:8px;">↑ Asc</button>
      <button id="sort-desc" class="btn btn-sm btn-outline-secondary flex-fill fw-bold" style="border-radius:8px;">↓ Desc</button>
    </div>
  `;

    // Sort key buttons
    panel.querySelectorAll('.sort-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            panel.querySelectorAll('.sort-opt').forEach(b => b.classList.remove('active-sort'));
            btn.classList.add('active-sort');
            state.sortKey = btn.dataset.key;
            applyFilters();
            renderTable();
        });
    });

    // Direction buttons
    panel.querySelector('#sort-asc').addEventListener('click', () => {
        state.sortDir = 'asc';
        updateDirButtons(panel);
        applyFilters();
        renderTable();
    });
    panel.querySelector('#sort-desc').addEventListener('click', () => {
        state.sortDir = 'desc';
        updateDirButtons(panel);
        applyFilters();
        renderTable();
    });

    // Inject a tiny style block for active sort option
    const style = document.createElement('style');
    style.textContent = `
    .sort-opt {
      display: flex; align-items: center; gap: 0.5rem;
      background: none; border: none; cursor: pointer; text-align: left;
      padding: 0.4rem 0.6rem; border-radius: 8px;
      font-family: 'Montserrat', sans-serif; font-size: 0.82rem; font-weight: 700;
      color: #374151; transition: background 0.15s;
    }
    .sort-opt:hover { background: #f3f4f6; }
    .sort-opt.active-sort { background: color-mix(in srgb, var(--primary-color,#1a2e4a) 10%, white); color: var(--primary-color,#1a2e4a); }
    .sort-opt .material-symbols-outlined { font-size: 1rem; opacity: 0.6; }
    #sort-asc.dir-active, #sort-desc.dir-active {
      background: var(--primary-color,#1a2e4a); color: #fff; border-color: transparent;
    }
  `;
    document.head.appendChild(style);

    // Set default active
    setTimeout(() => {
        const defaultOpt = panel.querySelector('[data-key="name"]');
        if (defaultOpt) defaultOpt.classList.add('active-sort');
        const ascBtn = panel.querySelector('#sort-asc');
        if (ascBtn) ascBtn.classList.add('dir-active');
    }, 0);

    return panel;
}

function buildSortOption(key, icon, label) {
    return `
    <button class="sort-opt" data-key="${key}">
      <span class="material-symbols-outlined">${icon}</span>${label}
    </button>`;
}

function updateDirButtons(panel) {
    panel.querySelector('#sort-asc').classList.toggle('dir-active', state.sortDir === 'asc');
    panel.querySelector('#sort-desc').classList.toggle('dir-active', state.sortDir === 'desc');
}

function closeFilterPopover(panel) {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-6px)';
    setTimeout(() => { panel.style.display = 'none'; }, 200);
}

/* ============================================================
   SORTABLE TABLE HEADERS (click column header to sort)
   ============================================================ */
function initSortableHeaders() {
    const headerMap = {
        'Full Name': 'name',
        'Age': 'age',
        'Division': 'division',
        'PRC ID': 'id'
    };

    const ths = document.querySelectorAll('table thead th');
    ths.forEach(th => {
        const key = headerMap[th.textContent.trim()];
        if (!key) return;

        th.style.cursor = 'pointer';
        th.style.userSelect = 'none';
        th.title = `Sort by ${th.textContent.trim()}`;

        // Sort icon
        const icon = document.createElement('span');
        icon.className = 'material-symbols-outlined ms-1 align-middle';
        icon.style.cssText = 'font-size:0.9rem; opacity:0.4; vertical-align: middle;';
        icon.textContent = 'unfold_more';
        th.appendChild(icon);

        th.addEventListener('click', () => {
            if (state.sortKey === key) {
                state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortKey = key;
                state.sortDir = 'asc';
            }

            // Update all header icons
            ths.forEach(t => {
                const ic = t.querySelector('.material-symbols-outlined');
                if (!ic) return;
                ic.textContent = 'unfold_more';
                ic.style.opacity = '0.4';
            });
            icon.textContent = state.sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward';
            icon.style.opacity = '1';

            applyFilters();
            renderTable();
        });
    });
}

/* ============================================================
   UTILITIES
   ============================================================ */

/** Wrap matching substring in a highlight <mark> */
function highlight(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(
        new RegExp(`(${escapedQuery})`, 'gi'),
        '<mark style="background:rgba(255,193,7,0.35);border-radius:3px;padding:0 2px;">$1</mark>'
    );
}

/** Prevent XSS in table innerHTML */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** Escape for HTML attribute values */
function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ============================================================
   MODAL SYSTEM
   Three modals injected purely via JS:
     1. prc-profile-modal  — Player Profile (eye icon)
     2. prc-register-modal — Register / Edit Player (pencil + header btn)
   Current player profile and player registration layouts
   are NOT modified — their layout is reproduced inside these modals.
   ============================================================ */

/* ---- Shared styles (injected once into <head>) ------------ */
function injectModalStyles() {
    if (document.getElementById('prc-modal-styles')) return;
    const s = document.createElement('style');
    s.id = 'prc-modal-styles';
    s.textContent = `
    /* === Backdrop === */
    .prc-backdrop {
      position: fixed; inset: 0;
      background: rgba(10,20,40,0.72);
      backdrop-filter: blur(4px);
      z-index: 10500;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.25s ease;
      padding: 1rem;
    }
    .prc-backdrop.prc-open { opacity: 1; }

    /* === Modal shell === */
    .prc-modal {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.35);
      width: 100%; max-width: 780px;
      max-height: 90vh;
      display: flex; flex-direction: column;
      font-family: 'Montserrat', sans-serif;
      transform: translateY(24px) scale(0.97);
      transition: transform 0.28s cubic-bezier(.34,1.3,.64,1);
      overflow: hidden;
    }
    .prc-backdrop.prc-open .prc-modal { transform: translateY(0) scale(1); }

    /* === Header === */
    .prc-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.1rem 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      background: var(--primary-color, #1a2e4a);
      border-radius: 16px 16px 0 0;
      flex-shrink: 0;
    }
    .prc-modal-header .prc-modal-title {
      font-weight: 900; font-size: 0.95rem; letter-spacing: 0.04em;
      text-transform: uppercase; color: #fff; margin: 0;
    }
    .prc-modal-header .prc-modal-subtitle {
      font-size: 0.7rem; font-weight: 700;
      color: var(--accent-color, #b68b2c); margin: 0;
      letter-spacing: 0.06em; text-transform: uppercase;
    }
    .prc-modal-close {
      background: rgba(255,255,255,0.12); border: none; border-radius: 50%;
      width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #fff; transition: background 0.2s;
      flex-shrink: 0;
    }
    .prc-modal-close:hover { background: rgba(255,255,255,0.25); }

    /* === Body === */
    .prc-modal-body {
      overflow-y: auto; padding: 1.5rem;
      flex: 1;
    }

    /* === Profile card layout === */
    .prc-profile-hero {
      width: 100%; aspect-ratio: 4/3; object-fit: cover;
      border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      display: block; margin-bottom: 1rem;
    }
    .prc-id-card {
      background: #0a2e22;
      background-image: radial-gradient(circle at 2px 2px, rgba(182,139,44,0.12) 1px, transparent 0);
      background-size: 18px 18px;
      border-radius: 12px; padding: 1.25rem; color: #fff;
    }
    .prc-stat-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.55rem 0; border-bottom: 1px solid #f3f4f6;
      font-size: 0.85rem;
    }
    .prc-stat-row:last-child { border-bottom: none; }
    .prc-stat-label { font-weight: 700; color: #6b7280; }
    .prc-stat-value { font-weight: 900; color: var(--primary-color, #1a2e4a); }
    .prc-rating-box {
      background: var(--primary-color, #1a2e4a);
      border-radius: 12px; padding: 1.25rem;
      color: #fff; text-align: center;
    }
    .prc-section-title {
      font-size: 0.7rem; font-weight: 900; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--accent-color, #b68b2c);
      margin-bottom: 0.9rem;
    }

    /* === Register form layout === */
    .prc-form-section { margin-bottom: 1.4rem; }
    .prc-form-label {
      display: block; font-size: 0.72rem; font-weight: 700;
      text-transform: uppercase; color: #6b7280;
      letter-spacing: 0.05em; margin-bottom: 0.4rem;
    }
    .prc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .prc-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
    @media(max-width:580px) { .prc-grid-2, .prc-grid-3 { grid-template-columns: 1fr; } }
    .prc-submit-btn {
      width: 100%; padding: 0.85rem;
      background: var(--accent-color, #b68b2c);
      color: #fff; border: none; border-radius: 10px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 900; font-size: 1rem;
      letter-spacing: 0.04em; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      transition: opacity 0.2s, transform 0.15s;
    }
    .prc-submit-btn:hover { opacity: 0.88; transform: translateY(-1px); }
    .prc-success-banner {
      text-align: center; padding: 2rem 1rem;
    }
    .prc-success-banner .prc-success-icon {
      font-size: 3.5rem; color: #22c55e; display: block; margin-bottom: 0.75rem;
    }
  `;
    document.head.appendChild(s);
}

/* ---- Wire up all trigger elements ------------------------- */
function initModals() {
    // Use event delegation on tbody for dynamically rendered rows
    const tbody = document.querySelector('table tbody');
    if (tbody) {
        tbody.addEventListener('click', e => {
            const viewBtn = e.target.closest('.prc-view-btn');
            const editBtn = e.target.closest('.prc-edit-btn');
            if (viewBtn) {
                const pid = viewBtn.dataset.playerId;
                openProfileModal(pid);
            } else if (editBtn) {
                const pid = editBtn.dataset.playerId;
                openRegisterModal(pid); // pre-filled = edit mode
            }
        });
    }

    // Header "Edit / Register" button — opens blank register modal
    const headerEditBtn = document.querySelector('a.btn.btn-primary[href="player-registration.html"]');
    if (headerEditBtn) {
        if (!userCanManageCurrentAcademy()) {
            headerEditBtn.classList.add('disabled');
            headerEditBtn.setAttribute('aria-disabled', 'true');
            headerEditBtn.setAttribute('title', 'Members can only add players to their own academy.');
            return;
        }

        headerEditBtn.addEventListener('click', e => {
            e.preventDefault();
            openRegisterModal(null); // null = new player
        });
    }
}

/* ============================================================
   PROFILE MODAL
   ============================================================ */
function openProfileModal(playerId) {
    const player = state.allPlayers.find(p => p.id === playerId);
    if (!player) return;

    // Remove any stale modal first
    document.getElementById('prc-profile-modal')?.remove();

    const fullName = `${player.firstName} ${player.lastName}`;
    const avatarUrl = player.photo
        || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1a2e4a&color=fff&size=256&font-size=0.38&bold=true`;

    const divBadgeClass = DIVISION_BADGE[player.division] ||
        'badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-2 fw-bold';

    // Season rating — a fun computed value between 7.0–9.9
    const rating = (7 + ((player.id.charCodeAt(4) || 0) % 30) / 10).toFixed(1);

    const backdrop = document.createElement('div');
    backdrop.className = 'prc-backdrop';
    backdrop.id = 'prc-profile-modal';

    backdrop.innerHTML = `
    <div class="prc-modal" role="dialog" aria-modal="true" aria-label="Player Profile: ${escapeAttr(fullName)}">

      <!-- Header -->
      <div class="prc-modal-header">
        <div>
          <p class="prc-modal-subtitle">Player Profile</p>
          <h2 class="prc-modal-title">${escapeHtml(fullName)}</h2>
        </div>
        <button class="prc-modal-close" id="prc-profile-close" aria-label="Close">
          <span class="material-symbols-outlined" style="font-size:1.2rem;">close</span>
        </button>
      </div>

      <!-- Body -->
      <div class="prc-modal-body">
        <div style="display:grid; grid-template-columns:1.1fr 1fr; gap:1.25rem;">

          <!-- LEFT: details -->
          <div style="display:flex; flex-direction:column; gap:1rem;">

            <!-- Personal Details card -->
            <div class="card p-3">
              <p class="prc-section-title">Personal Details</p>
              <div class="prc-stat-row">
                <span class="prc-stat-label">Full Name</span>
                <span class="prc-stat-value">${escapeHtml(fullName)}</span>
              </div>
              <div class="prc-stat-row">
                <span class="prc-stat-label">Age</span>
                <span class="prc-stat-value">${escapeHtml(String(player.age || '—'))}</span>
              </div>
              <div class="prc-stat-row">
                <span class="prc-stat-label">Position</span>
                <span class="prc-stat-value">${escapeHtml(player.position)}</span>
              </div>
              <div class="prc-stat-row">
                <span class="prc-stat-label">PRC ID</span>
                <span class="prc-stat-value" style="color:var(--accent-color,#b68b2c); font-family:monospace;">${escapeHtml(player.id)}</span>
              </div>
              <div class="prc-stat-row">
                <span class="prc-stat-label">Division</span>
                <span><span class="${divBadgeClass}">${escapeHtml(player.division)}</span></span>
              </div>
              <div class="prc-stat-row">
                <span class="prc-stat-label">Academy</span>
                <span class="prc-stat-value">${escapeHtml(player.academy)}</span>
              </div>
            </div>

            <!-- Season rating -->
            <div class="prc-rating-box">
              <p class="prc-section-title" style="color:var(--accent-color,#b68b2c);">Season Rating</p>
              <div style="font-size:3.5rem; font-weight:900; line-height:1;">${rating}</div>
              <p style="font-size:0.75rem; font-weight:700; margin:0.5rem 0 0; color:var(--accent-color,#b68b2c);">
                <span class="material-symbols-outlined" style="font-size:0.9rem; vertical-align:middle; font-variation-settings:'FILL' 1;">trending_up</span>
                Top 5% in Division
              </p>
            </div>

            <!-- Quick links -->
            <div class="list-group shadow-sm border rounded-3 overflow-hidden">
              <div class="list-group-item d-flex justify-content-between align-items-center p-3 border-0 border-bottom">
                <span class="fw-bold small" style="color:var(--primary-color,#1a2e4a);">Medical Reports</span>
                <span class="material-symbols-outlined" style="color:var(--accent-color,#b68b2c);">medical_services</span>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-center p-3 border-0 border-bottom">
                <span class="fw-bold small" style="color:var(--primary-color,#1a2e4a);">Match History</span>
                <span class="material-symbols-outlined" style="color:var(--accent-color,#b68b2c);">sports_soccer</span>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-center p-3 border-0">
                <span class="fw-bold small" style="color:var(--primary-color,#1a2e4a);">Academic Standing</span>
                <span class="material-symbols-outlined" style="color:var(--accent-color,#b68b2c);">school</span>
              </div>
            </div>
          </div>

          <!-- RIGHT: photo + ID card -->
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <div class="card p-0 border-0 shadow overflow-hidden position-relative" style="border-radius:12px;">
              <img src="${escapeAttr(avatarUrl)}"
                   alt="${escapeAttr(fullName)}"
                   class="prc-profile-hero"
                   onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1a2e4a&color=fff&size=256'">
              <div style="position:absolute;bottom:0;left:0;width:100%;padding:1rem 1.25rem 1.1rem;
                          background:linear-gradient(transparent,rgba(11,61,46,0.92));">
                <p style="font-weight:900;font-size:0.65rem;text-transform:uppercase;color:var(--accent-color,#b68b2c);margin:0 0 0.15rem;">Status: Active</p>
                <h3 style="color:#fff;font-weight:900;margin:0;font-size:1.1rem;">${escapeHtml(player.lastName.toUpperCase())}</h3>
              </div>
            </div>

            <!-- ID Card -->
            <div class="prc-id-card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                <span style="font-size:0.65rem;font-weight:900;letter-spacing:0.1em;color:var(--accent-color,#b68b2c);">ZAMBEZI FUTURES</span>
                <span class="material-symbols-outlined" style="color:var(--accent-color,#b68b2c);">qr_code_2</span>
              </div>
              <div style="display:flex;gap:0.75rem;align-items:center;">
                <img src="${escapeAttr(avatarUrl)}"
                     alt="Thumb"
                     style="width:60px;height:72px;object-fit:cover;border-radius:6px;border:2px solid #fff;"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1a2e4a&color=fff&size=88'">
                <div>
                  <h4 style="color:#fff;font-weight:900;margin:0 0 0.2rem;font-size:0.95rem;line-height:1.2;">
                    ${escapeHtml(player.firstName.toUpperCase())}<br>${escapeHtml(player.lastName.toUpperCase())}
                  </h4>
                  <p style="font-size:0.58rem;color:var(--accent-color,#b68b2c);font-weight:700;margin:0;">ID: ${escapeHtml(player.id)}</p>
                  <p style="font-size:0.55rem;color:rgba(255,255,255,0.5);font-weight:700;margin:0;">EXP: 12/2026</p>
                </div>
              </div>
              <button
                style="width:100%;margin-top:1rem;padding:0.55rem;background:var(--accent-color,#b68b2c);color:#fff;
                       border:none;border-radius:8px;font-family:'Montserrat',sans-serif;font-weight:900;
                       font-size:0.8rem;letter-spacing:0.04em;cursor:pointer;display:flex;align-items:center;
                       justify-content:center;gap:0.4rem;"
                onclick="window.print()">
                <span class="material-symbols-outlined" style="font-size:1rem;">download</span> DOWNLOAD ID
              </button>
            </div>

            <!-- Edit from profile -->
            <button
              id="prc-profile-edit-btn"
              data-player-id="${escapeAttr(player.id)}"
              style="width:100%;padding:0.7rem;background:var(--primary-color,#1a2e4a);color:#fff;
                     border:none;border-radius:10px;font-family:'Montserrat',sans-serif;
                     font-weight:900;font-size:0.85rem;letter-spacing:0.04em;cursor:pointer;
                     display:flex;align-items:center;justify-content:center;gap:0.5rem;transition:opacity .2s;"
              onmouseover="this.style.opacity='.82'" onmouseout="this.style.opacity='1'">
              <span class="material-symbols-outlined" style="font-size:1rem;">edit</span> EDIT PLAYER INFO
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => backdrop.classList.add('prc-open'));

    // Close handlers
    const closeBtn = backdrop.querySelector('#prc-profile-close');
    closeBtn.addEventListener('click', () => closePrcModal(backdrop));
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closePrcModal(backdrop); });
    document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') { closePrcModal(backdrop); document.removeEventListener('keydown', onKey); }
    });

    // "Edit Player Info" button inside profile modal
    backdrop.querySelector('#prc-profile-edit-btn').addEventListener('click', () => {
        closePrcModal(backdrop);
        setTimeout(() => openRegisterModal(player.id), 250);
    });
}

/* ============================================================
   REGISTER / EDIT MODAL
   ============================================================ */
function openRegisterModal(playerId) {
    // playerId === null  → new player (Register mode)
    // playerId !== null  → existing player (Edit mode)
    const player = playerId ? state.allPlayers.find(p => p.id === playerId) : null;
    const isEdit = !!player;
    const title = isEdit ? 'Edit Player Info' : 'Register New Player';
    const subtitle = isEdit ? `Editing: ${player.firstName} ${player.lastName}` : 'Official Portal';

    document.getElementById('prc-register-modal')?.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'prc-backdrop';
    backdrop.id = 'prc-register-modal';

    const divOptions = ['U-10', 'U-12', 'U-14', 'U-15', 'U-16', 'U-17', 'U-18', 'U-20']
        .map(d => `<option value="${d}" ${player?.division === d ? 'selected' : ''}>${d}</option>`)
        .join('');

    backdrop.innerHTML = `
    <div class="prc-modal" style="max-width:680px;" role="dialog" aria-modal="true" aria-label="${escapeAttr(title)}">

      <!-- Header -->
      <div class="prc-modal-header">
        <div>
          <p class="prc-modal-subtitle">${escapeHtml(subtitle)}</p>
          <h2 class="prc-modal-title">${escapeHtml(title)}</h2>
        </div>
        <button class="prc-modal-close" id="prc-reg-close" aria-label="Close">
          <span class="material-symbols-outlined" style="font-size:1.2rem;">close</span>
        </button>
      </div>

      <!-- Body -->
      <div class="prc-modal-body">
        <form id="prc-reg-form" novalidate>

          <!-- Portrait row -->
          <div class="prc-form-section" style="display:flex;align-items:center;gap:1rem;
               background:#f8f9fa;padding:1rem;border-radius:12px;">
            <img id="prc-portrait-preview"
                 src="${escapeAttr(player?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(player ? `${player.firstName} ${player.lastName}` : 'New Player')}&background=1a2e4a&color=fff&size=120&bold=true`)}"
                 style="width:72px;height:72px;border-radius:50%;object-fit:cover;
                        border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.15);"
                 alt="Portrait preview">
            <div>
              <p style="font-size:0.78rem;font-weight:700;color:#6b7280;margin:0 0 0.5rem;">Player Portrait</p>
              <p style="font-size:0.7rem;color:#9ca3af;margin:0 0 0.6rem;">Upload a photo for the official Athlete ID card.</p>
              <input type="file" id="prc-photo-input" accept="image/*" style="display:none;">
              <button type="button" onclick="document.getElementById('prc-photo-input').click()"
                style="font-size:0.72rem;font-weight:700;padding:0.3rem 0.7rem;
                       border:1px solid #d1d5db;background:#fff;border-radius:6px;cursor:pointer;">
                <span class="material-symbols-outlined" style="font-size:0.85rem;vertical-align:middle;">refresh</span> Change
              </button>
            </div>
          </div>

          <!-- Name fields -->
          <div class="prc-form-section">
            <div class="prc-grid-3">
              <div>
                <label class="prc-form-label" for="prc-first">First Name *</label>
                <input type="text" id="prc-first" class="form-control"
                       placeholder="First name" value="${escapeAttr(player?.firstName || '')}" required>
              </div>
              <div>
                <label class="prc-form-label" for="prc-middle">Middle Name</label>
                <input type="text" id="prc-middle" class="form-control" placeholder="Middle name">
              </div>
              <div>
                <label class="prc-form-label" for="prc-last">Last Name *</label>
                <input type="text" id="prc-last" class="form-control"
                       placeholder="Last name" value="${escapeAttr(player?.lastName || '')}" required>
              </div>
            </div>
          </div>

          <!-- DOB + Division -->
          <div class="prc-form-section">
            <div class="prc-grid-2">
              <div>
                <label class="prc-form-label" for="prc-dob">Date of Birth *</label>
                <input type="date" id="prc-dob" class="form-control"
                       value="${escapeAttr(player?.dob || '')}" required>
              </div>
              <div>
                <label class="prc-form-label" for="prc-division">Age Group / Division *</label>
                <select id="prc-division" class="form-select" required>
                  <option value="" disabled ${!player ? 'selected' : ''}>Select Age Group</option>
                  ${divOptions}
                </select>
              </div>
            </div>
          </div>

          <!-- Position + Academy -->
          <div class="prc-form-section">
            <div class="prc-grid-2">
              <div>
                <label class="prc-form-label" for="prc-position">Position</label>
                <input type="text" id="prc-position" class="form-control"
                       placeholder="e.g. Forward" value="${escapeAttr(player?.position || '')}">
              </div>
              <div>
                <label class="prc-form-label" for="prc-academy">Academy *</label>
                <input type="text" id="prc-academy" class="form-control"
                       placeholder="Assigned facility"
                       value="${escapeAttr(player?.academy || 'Zambezi Elite Academy')}" required>
              </div>
            </div>
          </div>

          <!-- Attachment -->
          <div class="prc-form-section">
            <label class="prc-form-label" for="prc-attachment">Attachment Upload</label>
            <div class="input-group">
              <input type="file" id="prc-attachment" class="form-control" accept=".pdf,.jpg,.png">
              <label class="input-group-text bg-white" for="prc-attachment">
                <span class="material-symbols-outlined">upload_file</span>
              </label>
            </div>
            <div class="form-text small">Birth Certificate or Guardian Waiver</div>
          </div>

          <!-- Validation message -->
          <div id="prc-reg-error"
               style="display:none;background:#fef2f2;border:1px solid #fecaca;
                      border-radius:8px;padding:0.6rem 0.9rem;margin-bottom:1rem;
                      font-size:0.8rem;font-weight:700;color:#dc2626;">
          </div>

          <!-- Submit -->
          <button type="submit" class="prc-submit-btn">
            <span class="material-symbols-outlined">send</span>
            <span id="prc-reg-label">${isEdit ? 'UPDATE PLAYER' : 'REGISTER PLAYER'}</span>
          </button>
        </form>

        <!-- Success state (hidden initially) -->
        <div id="prc-reg-success" style="display:none;" class="prc-success-banner">
          <span class="prc-success-icon material-symbols-outlined" style="font-variation-settings:'FILL' 1;">check_circle</span>
          <h3 style="font-weight:900;color:var(--primary-color,#1a2e4a);margin-bottom:0.5rem;">
            ${isEdit ? 'Player Updated!' : 'Player Registered!'}
          </h3>
          <p style="color:#6b7280;font-size:0.85rem;margin-bottom:1.5rem;">
            ${isEdit ? 'The player record has been successfully updated.' : 'The new player has been added to the academy roster.'}
          </p>
          <button id="prc-reg-done"
            style="padding:0.7rem 2rem;background:var(--primary-color,#1a2e4a);color:#fff;
                   border:none;border-radius:10px;font-family:'Montserrat',sans-serif;
                   font-weight:900;cursor:pointer;font-size:0.9rem;">Done</button>
        </div>
      </div>
    </div>
  `;

    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => backdrop.classList.add('prc-open'));

    // Photo preview
    backdrop.querySelector('#prc-photo-input').addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            backdrop.querySelector('#prc-portrait-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Close handlers
    backdrop.querySelector('#prc-reg-close').addEventListener('click', () => closePrcModal(backdrop));
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closePrcModal(backdrop); });
    document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') { closePrcModal(backdrop); document.removeEventListener('keydown', onKey); }
    });

    // Done button in success state
    backdrop.querySelector('#prc-reg-done').addEventListener('click', () => closePrcModal(backdrop));

    // Form submit
    backdrop.querySelector('#prc-reg-form').addEventListener('submit', e => {
        e.preventDefault();
        savePlayer(backdrop, player);
    });
}

/* ---- Save / update player in localStorage + state --------- */
function savePlayer(backdrop, existingPlayer) {
    const first = backdrop.querySelector('#prc-first').value.trim();
    const last = backdrop.querySelector('#prc-last').value.trim();
    const dob = backdrop.querySelector('#prc-dob').value.trim();
    const division = backdrop.querySelector('#prc-division').value;
    const position = backdrop.querySelector('#prc-position').value.trim();
    const academy = backdrop.querySelector('#prc-academy').value.trim();
    const photoEl = backdrop.querySelector('#prc-portrait-preview');
    const errorBox = backdrop.querySelector('#prc-reg-error');

    // Basic validation
    const errors = [];
    if (!first) errors.push('First name is required.');
    if (!last) errors.push('Last name is required.');
    if (!division) errors.push('Please select an Age Group.');
    if (!academy) errors.push('Academy name is required.');

    if (errors.length) {
        errorBox.textContent = errors.join('  •  ');
        errorBox.style.display = 'block';
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    errorBox.style.display = 'none';

    // Compute age from DOB, or keep existing
    let age = existingPlayer?.age || 0;
    if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }
    }

    // Determine the photo: use data URL if changed, else keep existing
    const photoSrc = photoEl.src.startsWith('data:') ? photoEl.src : (existingPlayer?.photo || '');

    // Generate PRC ID for new players
    const newId = existingPlayer
        ? existingPlayer.id
        : `PRC-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

    const updatedPlayer = {
        id: newId,
        firstName: first,
        lastName: last,
        position: position || '—',
        age,
        dob,
        division: normaliseDivision(division),
        academy,
        photo: photoSrc
    };

    // Update state.allPlayers
    if (existingPlayer) {
        const idx = state.allPlayers.findIndex(p => p.id === existingPlayer.id);
        if (idx !== -1) state.allPlayers[idx] = updatedPlayer;
    } else {
        state.allPlayers.push(updatedPlayer);
    }

    // Persist to localStorage
    try {
        // Only store non-seed players (or update seed player overrides)
        const seedIds = new Set(SEED_PLAYERS.map(p => p.id.toUpperCase()));
        // All players (including updated seeds) go into localStorage
        localStorage.setItem('prc_players', JSON.stringify(state.allPlayers));
    } catch (err) {
        console.warn('[Enos_academy] Could not save to localStorage:', err);
    }

    // Re-render the table & metrics
    applyFilters();
    render();

    // Show success banner
    backdrop.querySelector('#prc-reg-form').style.display = 'none';
    backdrop.querySelector('#prc-reg-success').style.display = 'block';
}

/* ---- Close helper ----------------------------------------- */
function closePrcModal(backdrop) {
    backdrop.classList.remove('prc-open');
    setTimeout(() => {
        backdrop.remove();
        // Only restore scroll if no other modal is open
        if (!document.querySelector('.prc-backdrop')) {
            document.body.style.overflow = '';
        }
    }, 280);
}
