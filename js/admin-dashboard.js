/* ================================================================
   Choolwe_admin.js — Admin Dashboard Backend
   Zambezi Futures Youth Soccer Academy
   Handles: stat counters, enrollments table, search/filter,
            pagination, action menus, live feed, critical dates,
            progress bar animations, scroll animations, nav state.
   ================================================================ */

'use strict';

// ----------------------------------------------------------------
// DATA — mirrored from data/players.json (static file support)
// ----------------------------------------------------------------
const PLAYERS = [
    {
        id: 'p001',
        name: 'Marcus Thorne',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa5fu9wZHoapvONTP-xVSTeFJcSHcmte9vTGoo0RbXUfz6B5XW6tFKJHvMK-rCrppgB3D7fIYKfKx5p3jxLOenM4T93SrYHGCYTiqnsf-SKOycrCeij1cdnGEhk_LWxfzbtad9Nyh4oDxO1Lze59xqpvwU0gI_3kW3yIJMqMOfMEN4HXqk3RJAQCFCVYtEV8y_c6f1WdrQUSh9vERpgcV-lZuKYoxuRPOATGG1t2qH8itA1f3Tv0WJvl0jiRtWVz9Vw27eklZnv-c',
        academy: 'Victoria Falls FC',
        category: 'U-14',
        status: 'Approved',
        date: '2024-10-08',
    },
    {
        id: 'p002',
        name: 'Leo Hernandez',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-MkJR6gEU812qeoDx4Udnz-6D4syFwE33QhcyDKy5Omz7ccdWQ8rDop78Oh_YHgxfiEo3tY9szG4VqqOexAmL-kb_lZGHsSjkx64sfuskqdTVJcaXFc9SinKeStVmY_DkukXc2DvgFNM8MmaGL6gMTx-FiN6xjb6I5UH-DT2o66pPY3NWQrwAUGPK2PLQaG625Y5cM59qwcNv1qVuvGzvgKi_ivlyjMq1WlYE0CYCdJmrRQKcLwb2m59jmxIOQz2vzJVSz0cuhUA',
        academy: 'Zambezi Lions Academy',
        category: 'U-12',
        status: 'Pending',
        date: '2024-10-07',
    },
    {
        id: 'p003',
        name: 'Samuel Okoro',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtgTJU_gsV5ahToEgrvbV7yE3lIJRVYX1zAR5P79jokKeRkgSQt1Tq4vi8JFSvBZsDmPIU0Xhi_isUfs8FKKYFlvPq3vGEhcRvRKgKGDTOHojKdLDK7J4xTvwVHDQ81iYOSc073VuJv4Cetj0kdS1eL98FHcpqNi_pwZtiuMEPpMj0foCrULUIJVC04CdXS2e5XrwJPf9qR309HntN206KvyWFdQwxBQJsibLTZtJGMmMm3sbxQTM6VGA9IK0FVzYbNe61wBqAKu8',
        academy: 'Riverside United',
        category: 'U-14',
        status: 'Approved',
        date: '2024-10-06',
    },
    {
        id: 'p004',
        name: 'Amara Diallo',
        avatar: 'https://i.pravatar.cc/40?img=10',
        academy: 'Copperbelt Athletic',
        category: 'U-10',
        status: 'Pending',
        date: '2024-10-05',
    },
    {
        id: 'p005',
        name: 'Kelechi Mensah',
        avatar: 'https://i.pravatar.cc/40?img=12',
        academy: 'Lusaka City FC',
        category: 'U-12',
        status: 'Approved',
        date: '2024-10-04',
    },
    {
        id: 'p006',
        name: 'Tendai Mwangi',
        avatar: 'https://i.pravatar.cc/40?img=15',
        academy: 'Southern Stars Academy',
        category: 'U-14',
        status: 'Rejected',
        date: '2024-10-03',
    },
    {
        id: 'p007',
        name: 'Blessing Nkosi',
        avatar: 'https://i.pravatar.cc/40?img=17',
        academy: 'Victoria Falls FC',
        category: 'U-10',
        status: 'Approved',
        date: '2024-10-02',
    },
    {
        id: 'p008',
        name: 'Fatou Camara',
        avatar: 'https://i.pravatar.cc/40?img=20',
        academy: 'Zambezi Lions Academy',
        category: 'U-12',
        status: 'Pending',
        date: '2024-10-01',
    },
    {
        id: 'p009',
        name: 'Emeka Okafor',
        avatar: 'https://i.pravatar.cc/40?img=22',
        academy: 'Riverside United',
        category: 'U-14',
        status: 'Approved',
        date: '2024-09-30',
    },
    {
        id: 'p010',
        name: 'Zanele Dube',
        avatar: 'https://i.pravatar.cc/40?img=25',
        academy: 'Copperbelt Athletic',
        category: 'U-10',
        status: 'Pending',
        date: '2024-09-29',
    },
    {
        id: 'p011',
        name: 'Chidi Eze',
        avatar: 'https://i.pravatar.cc/40?img=28',
        academy: 'Lusaka City FC',
        category: 'U-14',
        status: 'Approved',
        date: '2024-09-28',
    },
    {
        id: 'p012',
        name: 'Simone Banda',
        avatar: 'https://i.pravatar.cc/40?img=30',
        academy: 'Southern Stars Academy',
        category: 'U-12',
        status: 'Pending',
        date: '2024-09-27',
    },
];

// ----------------------------------------------------------------
// STATE
// ----------------------------------------------------------------
const state = {
    players: [...PLAYERS],        // current (possibly filtered) list
    currentPage: 1,
    rowsPerPage: 3,
    searchQuery: '',
    filterStatus: 'all',
    filterCategory: 'all',
    activeContextMenu: null,      // currently open context row menu
};

// ----------------------------------------------------------------
// BOOT
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initNavActiveState();
    initScrollAnimations();
    initStatCounters();
    initEnrollmentsTable();
    initSearchAndFilter();
    initReviewQueueButton();
    initLiveFeed();
    initCriticalDates();
    initProgressBars();
    closeContextMenuOnOutsideClick();
    initManagementHub();
    initRejectionWorkflow();
});

// ================================================================
// 1. NAV — highlight active link
// ================================================================
function initNavActiveState() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        if (link.textContent.trim() === 'Admin') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ================================================================
// 2. SCROLL ANIMATIONS — Intersection Observer on stat cards
// ================================================================
function initScrollAnimations() {
    const targets = document.querySelectorAll('.stat-card, .widget, .timeline-item');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    targets.forEach((el) => {
        // Only touch elements that don't already have a CSS animation-delay
        // (the stat cards use .animate-up with CSS delays — let CSS handle those)
        if (!el.classList.contains('animate-up')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(18px)';
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        }
        observer.observe(el);
    });
}

// ================================================================
// 3. STAT COUNTERS — animated count-up
// ================================================================
function initStatCounters() {
    const statMap = [
        { selector: '.stat-card-primary .stat-value', target: 5402, suffix: '', prefix: '' },
        { selector: '.stat-card-surface .stat-value', target: 52, suffix: '', prefix: '' },
        { selector: '.stat-card-secondary .stat-value', target: 124, suffix: '', prefix: '' },
    ];

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function animateCounter(el, target, prefix, suffix, duration = 1800) {
        const start = performance.now();
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(easeOutCubic(progress) * target);
            el.textContent = prefix + value.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const cfg = statMap.find((m) => entry.target.matches(m.selector));
                    if (cfg) animateCounter(entry.target, cfg.target, cfg.prefix, cfg.suffix);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statMap.forEach(({ selector }) => {
        const el = document.querySelector(selector);
        if (el) observer.observe(el);
    });
}

// ================================================================
// 4. ENROLLMENTS TABLE — dynamic render + pagination
// ================================================================

/** Build and inject the table rows + pagination from state */
function renderTable() {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    const { players, currentPage, rowsPerPage } = state;
    const totalPages = Math.max(1, Math.ceil(players.length / rowsPerPage));

    // clamp page
    if (state.currentPage > totalPages) state.currentPage = totalPages;

    const start = (state.currentPage - 1) * rowsPerPage;
    const pageRows = players.slice(start, start + rowsPerPage);

    // -- Render rows --
    tbody.innerHTML = pageRows.length
        ? pageRows.map(buildRow).join('')
        : `<tr><td colspan="5" class="text-center text-muted py-5 fw-bold opacity-50">No enrollments found.</td></tr>`;

    // attach action-menu triggers
    tbody.querySelectorAll('.action-trigger').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const playerId = btn.closest('tr').dataset.playerId;
            toggleContextMenu(btn, playerId);
        });
    });

    // -- Render pagination --
    const pageLabel = document.querySelector('.fs-8.fw-bold.text-uppercase.opacity-50');
    if (pageLabel) pageLabel.textContent = `Page ${state.currentPage} of ${totalPages}`;

    const [prevBtn, nextBtn] = document.querySelectorAll('.mt-4 button');
    if (prevBtn) {
        prevBtn.disabled = state.currentPage === 1;
        prevBtn.style.opacity = state.currentPage === 1 ? '0.35' : '1';
        prevBtn.style.cursor = state.currentPage === 1 ? 'default' : 'pointer';
    }
    if (nextBtn) {
        nextBtn.disabled = state.currentPage === totalPages;
        nextBtn.style.opacity = state.currentPage === totalPages ? '0.35' : '1';
        nextBtn.style.cursor = state.currentPage === totalPages ? 'default' : 'pointer';
    }

    // update pending stat card count
    updatePendingCount();
}

/** Generate an HTML string for a single player row */
function buildRow(player) {
    const statusConfig = {
        Approved: { textClass: 'text-success', dotClass: 'bg-success' },
        Pending: { textClass: 'text-warning', dotClass: 'bg-warning' },
        Rejected: { textClass: 'text-danger', dotClass: 'bg-danger' },
    };
    const cfg = statusConfig[player.status] || statusConfig.Pending;

    return `
    <tr data-player-id="${player.id}" style="position:relative;">
      <td>
        <div class="d-flex align-items-center gap-3">
          <img src="${player.avatar}" class="avatar" alt="Avatar"
               onerror="this.src='https://i.pravatar.cc/40?u=${player.id}'">
          <span class="fw-bold text-primary">${escHtml(player.name)}</span>
        </div>
      </td>
      <td class="text-muted fw-bold">${escHtml(player.academy)}</td>
      <td><span class="badge-elite">${escHtml(player.category)}</span></td>
      <td>
        <span class="fw-bold ${cfg.textClass}">
          <span class="status-dot ${cfg.dotClass}"></span>${escHtml(player.status)}
        </span>
      </td>
      <td class="text-end text-muted" style="position:relative;">
        <span class="material-symbols-outlined action-trigger"
              style="cursor:pointer;user-select:none;"
              title="Actions">more_horiz</span>
      </td>
    </tr>`;
}

/** Initialise the table and wire up pagination buttons */
function initEnrollmentsTable() {
    // Replace static tbody with dynamic version
    renderTable();

    // Pagination buttons (Previous / Next)
    const [prevBtn, nextBtn] = document.querySelectorAll('.mt-4 button');

    prevBtn?.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderTable();
            smoothScrollTo(document.querySelector('.table-responsive'), -80);
        }
    });

    nextBtn?.addEventListener('click', () => {
        const totalPages = Math.ceil(state.players.length / state.rowsPerPage);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderTable();
            smoothScrollTo(document.querySelector('.table-responsive'), -80);
        }
    });

    // Also keep the "Review Queue" pending count badge accurate
    updatePendingCount();
}

/** Smooth-scroll a target element into view with an offset */
function smoothScrollTo(el, offset = 0) {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
}

// ================================================================
// 5. SEARCH & FILTER
// ================================================================
function initSearchAndFilter() {
    const [filterBtn, searchBtn] = document.querySelectorAll(
        '.d-flex.gap-2 .btn.btn-light'
    );

    if (searchBtn) buildSearchUI(searchBtn);
    if (filterBtn) buildFilterUI(filterBtn);
}

/** Inject a search input bar above the table */
function buildSearchUI(triggerBtn) {
    // Create search bar
    const searchBar = document.createElement('div');
    searchBar.id = 'admin-search-bar';
    searchBar.style.cssText = `
    display:none; align-items:center; gap:0.5rem;
    padding:0.75rem 1rem; background:#fff;
    border:1px solid #dee2e6; margin-bottom:0.5rem;
    animation: fadeInUp 0.3s ease forwards;
  `;
    searchBar.innerHTML = `
    <span class="material-symbols-outlined text-muted" style="font-size:1.1rem;">search</span>
    <input id="admin-search-input" type="text"
           placeholder="Search player or academy…"
           style="border:none;outline:none;flex:1;font-family:inherit;
                  font-size:0.875rem;font-weight:600;color:#191c1c;"
           autocomplete="off">
    <button id="admin-search-clear" title="Clear"
            style="background:none;border:none;cursor:pointer;padding:0;
                   display:none;color:#6b7280;">
      <span class="material-symbols-outlined" style="font-size:1rem;">close</span>
    </button>`;

    const tableSection = document.querySelector('.table-responsive');
    tableSection?.parentNode.insertBefore(searchBar, tableSection);

    let searchVisible = false;

    triggerBtn.addEventListener('click', () => {
        searchVisible = !searchVisible;
        searchBar.style.display = searchVisible ? 'flex' : 'none';
        if (searchVisible) document.getElementById('admin-search-input')?.focus();
    });

    const input = document.getElementById('admin-search-input');
    const clearBtn = document.getElementById('admin-search-clear');

    input?.addEventListener('input', () => {
        state.searchQuery = input.value.trim().toLowerCase();
        clearBtn.style.display = state.searchQuery ? 'block' : 'none';
        applyFilters();
    });

    clearBtn?.addEventListener('click', () => {
        input.value = '';
        state.searchQuery = '';
        clearBtn.style.display = 'none';
        applyFilters();
        input.focus();
    });
}

/** Inject a filter chip bar */
function buildFilterUI(triggerBtn) {
    const filterBar = document.createElement('div');
    filterBar.id = 'admin-filter-bar';
    filterBar.style.cssText = `
    display:none; flex-wrap:wrap; gap:0.5rem;
    padding:0.75rem 1rem; background:#f3f4f3;
    border:1px solid #dee2e6; margin-bottom:0.5rem;
  `;

    const statusOptions = ['all', 'Approved', 'Pending', 'Rejected'];
    const categoryOptions = ['all', 'U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18'];

    const makeChips = (options, key, label) => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;';
        wrap.innerHTML = `<span style="font-size:0.65rem;font-weight:900;
      text-transform:uppercase;letter-spacing:.08em;color:var(--on-surface-variant);
      margin-right:0.25rem;">${label}</span>`;

        options.forEach((opt) => {
            const chip = document.createElement('button');
            chip.textContent = opt === 'all' ? 'All' : opt;
            chip.dataset.value = opt;
            chip.style.cssText = `
        font-family:inherit;font-size:0.72rem;font-weight:700;
        border:1.5px solid var(--outline-variant);background:white;
        border-radius:99px;padding:0.25rem 0.75rem;cursor:pointer;
        transition:all 0.2s;color:#191c1c;`;

            if (state[key] === opt) applyActiveChip(chip);

            chip.addEventListener('click', () => {
                wrap.querySelectorAll('button').forEach(resetChip);
                applyActiveChip(chip);
                state[key] = opt;
                state.currentPage = 1;
                applyFilters();
            });
            wrap.appendChild(chip);
        });
        return wrap;
    };

    filterBar.appendChild(makeChips(statusOptions, 'filterStatus', 'Status'));
    filterBar.appendChild(makeChips(categoryOptions, 'filterCategory', 'Category'));

    const tableSection = document.querySelector('.table-responsive');
    tableSection?.parentNode.insertBefore(filterBar, tableSection);

    let filterVisible = false;
    triggerBtn.addEventListener('click', () => {
        filterVisible = !filterVisible;
        filterBar.style.display = filterVisible ? 'flex' : 'none';
    });
}

function applyActiveChip(chip) {
    chip.style.background = 'var(--primary)';
    chip.style.borderColor = 'var(--primary)';
    chip.style.color = '#fff';
}
function resetChip(chip) {
    chip.style.background = 'white';
    chip.style.borderColor = 'var(--outline-variant)';
    chip.style.color = '#191c1c';
}

/** Re-compute state.players based on active search + filters, then re-render */
function applyFilters() {
    state.players = PLAYERS.filter((p) => {
        const matchSearch =
            !state.searchQuery ||
            p.name.toLowerCase().includes(state.searchQuery) ||
            p.academy.toLowerCase().includes(state.searchQuery) ||
            p.category.toLowerCase().includes(state.searchQuery);

        const matchStatus =
            state.filterStatus === 'all' || p.status === state.filterStatus;

        const matchCategory =
            state.filterCategory === 'all' || p.category === state.filterCategory;

        return matchSearch && matchStatus && matchCategory;
    });

    state.currentPage = 1;
    renderTable();
}

// ================================================================
// 6. REVIEW QUEUE BUTTON
// ================================================================
function initReviewQueueButton() {
    const reviewBtn = document.querySelector('.stat-card-secondary .btn');
    if (!reviewBtn) return;

    reviewBtn.addEventListener('click', () => {
        // Filter table to show only Pending registrations
        state.filterStatus = 'Pending';
        state.searchQuery = '';
        state.filterCategory = 'all';
        state.currentPage = 1;

        // Sync filter chips visually
        const chips = document.querySelectorAll('#admin-filter-bar button');
        chips.forEach((chip) => {
            if (chip.closest('div').previousElementSibling === null) return; // labels
            resetChip(chip);
            if (chip.dataset.value === 'Pending') applyActiveChip(chip);
        });

        // Show filter bar
        const filterBar = document.getElementById('admin-filter-bar');
        if (filterBar) filterBar.style.display = 'flex';

        applyFilters();
        smoothScrollTo(document.querySelector('.table-responsive'), -100);

        // Flash the table container to draw attention
        const container = document.querySelector('.table-responsive');
        if (container) {
            container.style.outline = '2px solid var(--secondary)';
            setTimeout(() => (container.style.outline = 'none'), 1500);
        }
    });
}

// ================================================================
// 7. CONTEXT MENU (more_horiz per row)
// ================================================================
function toggleContextMenu(triggerEl, playerId) {
    // Remove any existing menu
    const existing = document.getElementById('ctx-menu');
    if (existing) {
        existing.remove();
        if (state.activeContextMenu === playerId) {
            state.activeContextMenu = null;
            return;
        }
    }

    state.activeContextMenu = playerId;
    const player = PLAYERS.find((p) => p.id === playerId);
    if (!player) return;

    const menu = document.createElement('div');
    menu.id = 'ctx-menu';
    menu.style.cssText = `
    position:fixed; background:#fff; border:1px solid #e5e7eb;
    box-shadow:0 8px 24px rgba(0,0,0,0.12); z-index:9999;
    border-radius:0; min-width:180px; overflow:hidden;
    animation:fadeInUp 0.15s ease forwards;`;

    const menuItems = [
        { icon: 'visibility', label: 'View Profile', action: () => viewProfile(player) },
        { icon: 'check_circle', label: 'Approve', action: () => changeStatus(player, 'Approved'), disabled: player.status === 'Approved' },
        { icon: 'cancel', label: 'Reject', action: () => openRejectionModal(player), disabled: player.status === 'Rejected' },
        { icon: 'delete', label: 'Remove', action: () => removePlayer(player), danger: true },
    ];

    menu.innerHTML = menuItems
        .map((item) =>
            `<button
          class="ctx-item"
          style="display:flex;align-items:center;gap:0.6rem;width:100%;
                 padding:0.65rem 1rem;border:none;background:${item.danger ? '#fff0f0' : '#fff'
            };cursor:${item.disabled ? 'not-allowed' : 'pointer'};
                 font-family:inherit;font-size:0.8rem;font-weight:700;
                 color:${item.danger ? '#dc2626' : item.disabled ? '#aaa' : '#191c1c'};
                 transition:background 0.15s;"
          data-action="${item.label}"
          ${item.disabled ? 'disabled' : ''}>
        <span class="material-symbols-outlined"
              style="font-size:1rem;color:${item.danger ? '#dc2626' : item.disabled ? '#ccc' : 'var(--primary)'
            };">${item.icon}</span>
        ${item.label}
      </button>`
        )
        .join('');

    document.body.appendChild(menu);

    // Position below the trigger
    const rect = triggerEl.getBoundingClientRect();
    const menuW = 190;
    const left = Math.min(rect.right - menuW, window.innerWidth - menuW - 8);
    menu.style.left = `${left}px`;
    menu.style.top = `${rect.bottom + 4}px`;

    // Wire actions
    menu.querySelectorAll('.ctx-item:not([disabled])').forEach((btn) => {
        const item = menuItems.find((i) => i.label === btn.dataset.action);
        btn.addEventListener('click', () => {
            item?.action();
            menu.remove();
            state.activeContextMenu = null;
        });
        btn.addEventListener('mouseenter', () => {
            if (!btn.disabled) btn.style.background = item?.danger ? '#fee2e2' : '#f3f4f3';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = item?.danger ? '#fff0f0' : '#fff';
        });
    });
}

function closeContextMenuOnOutsideClick() {
    document.addEventListener('click', () => {
        const menu = document.getElementById('ctx-menu');
        if (menu) {
            menu.remove();
            state.activeContextMenu = null;
        }
    });
}

/** Simple profile toast */
function viewProfile(player) {
    showToast(
        `<strong>${escHtml(player.name)}</strong><br>
     <small>${escHtml(player.academy)} · ${escHtml(player.category)}</small>`,
        'info'
    );
}

/** Change a player's status in both PLAYERS array and state.players */
function changeStatus(player, newStatus, comment = '') {
    const masterPlayer = PLAYERS.find((p) => p.id === player.id);
    if (masterPlayer) {
        masterPlayer.status = newStatus;
        if (newStatus === 'Rejected' && comment) {
            masterPlayer.rejectionReason = comment;
        }
    }

    applyFilters();
    updatePendingCount();
    addLiveFeedEvent(
        newStatus === 'Approved' ? 'check_circle' : 'cancel',
        newStatus === 'Approved' ? 'bg-success-subtle' : 'bg-danger-subtle',
        newStatus === 'Approved' ? 'text-success' : 'text-danger',
        `${escHtml(player.name)} ${newStatus}`,
        newStatus === 'Rejected' ? `Reason: ${escHtml(truncate(comment, 30))}` : 'by Admin • just now'
    );
    showToast(
        `<strong>${escHtml(player.name)}</strong> marked as <strong>${newStatus}</strong>`,
        newStatus === 'Approved' ? 'success' : 'warning'
    );
}

/** Truncate helper for feedback display */
function truncate(str, n) {
    return (str.length > n) ? str.substr(0, n - 1) + '…' : str;
}

// ----------------------------------------------------------------
// REJECTION WORKFLOW LOGIC
// ----------------------------------------------------------------
let playerPendingRejection = null;

function initRejectionWorkflow() {
    const confirmBtn = document.getElementById('confirmRejectionBtn');
    const commentArea = document.getElementById('rejectionComment');
    const errorMsg = document.getElementById('rejectionError');
    const modalEl = document.getElementById('rejectionModal');

    if (!confirmBtn || !commentArea || !modalEl) return;

    confirmBtn.addEventListener('click', () => {
        const comment = commentArea.value.trim();
        if (!comment) {
            errorMsg.style.display = 'block';
            commentArea.classList.add('is-invalid');
            return;
        }

        if (playerPendingRejection) {
            changeStatus(playerPendingRejection, 'Rejected', comment);
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
        }
    });

    // Clear error on input
    commentArea.addEventListener('input', () => {
        errorMsg.style.display = 'none';
        commentArea.classList.remove('is-invalid');
    });

    // Reset when modal closes
    modalEl.addEventListener('hidden.bs.modal', () => {
        commentArea.value = '';
        errorMsg.style.display = 'none';
        commentArea.classList.remove('is-invalid');
        playerPendingRejection = null;
    });
}

function openRejectionModal(player) {
    playerPendingRejection = player;
    const modalEl = document.getElementById('rejectionModal');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

/** Remove player from both arrays */
function removePlayer(player) {
    const idx = PLAYERS.findIndex((p) => p.id === player.id);
    if (idx !== -1) PLAYERS.splice(idx, 1);
    applyFilters();
    updatePendingCount();
    showToast(
        `<strong>${escHtml(player.name)}</strong> removed from system.`,
        'danger'
    );
}

/** Keep the Pending Registrations stat card in sync */
function updatePendingCount() {
    const el = document.querySelector('.stat-card-secondary .stat-value');
    if (el) el.textContent = PLAYERS.filter((p) => p.status === 'Pending').length;
}

// ================================================================
// 8. LIVE FEED — relative timestamps + dynamic events
// ================================================================
const LIVE_EVENTS = [
    {
        iconName: 'check_circle',
        iconBg: 'bg-success-subtle',
        iconColor: 'text-success',
        title: 'Marcus Thorne Approved',
        meta: 'by Admin John D.',
        timestamp: Date.now() - 2 * 60 * 1000,          // 2 min ago
    },
    {
        iconName: 'edit',
        iconBg: 'bg-warning-subtle',
        iconColor: 'text-warning',
        title: 'Academy Profile Updated',
        meta: 'Victoria Falls FC',
        timestamp: Date.now() - 14 * 60 * 1000,         // 14 min ago
    },
    {
        iconName: 'person_add',
        iconBg: 'bg-light',
        iconColor: 'text-muted',
        title: 'New Registration: Leo Hernandez',
        meta: 'Pending Review',
        timestamp: Date.now() - 45 * 60 * 1000,         // 45 min ago
    },
];

function initLiveFeed() {
    renderLiveFeed();
    // Refresh relative times every 60 seconds
    setInterval(renderLiveFeed, 60 * 1000);
}

function renderLiveFeed() {
    const container = document.querySelector('.mt-5');  // Live Feed wrapper
    if (!container) return;

    const title = container.querySelector('h4');
    container.innerHTML = '';
    if (title) container.appendChild(title);

    LIVE_EVENTS.slice(0, 5).forEach((evt) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
      <div class="timeline-icon ${evt.iconBg}">
        <span class="material-symbols-outlined ${evt.iconColor} fs-9">${evt.iconName}</span>
      </div>
      <p class="fs-7 fw-bold mb-0">${evt.title}</p>
      <p class="fs-9 text-muted">${evt.meta} · ${relativeTime(evt.timestamp)}</p>`;
        container.appendChild(item);
    });
}

/** Add a new event to the top of the live feed */
function addLiveFeedEvent(iconName, iconBg, iconColor, title, meta) {
    LIVE_EVENTS.unshift({ iconName, iconBg, iconColor, title, meta, timestamp: Date.now() });
    if (LIVE_EVENTS.length > 8) LIVE_EVENTS.pop();
    renderLiveFeed();
}

/** Convert a timestamp to a human-readable relative string */
function relativeTime(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// ================================================================
// 9. CRITICAL DATES — dynamic countdown
// ================================================================
const CRITICAL_DATES = [
    { year: 2024, month: 9, day: 12, label: 'U-14 Regional Finals Registration', verb: 'Closes' },
    { year: 2024, month: 9, day: 28, label: 'Coaching Staff Certification', verb: 'Deadline' },
    { year: 2024, month: 10, day: 5, label: 'Summer Camp Early Bird', verb: 'Opens' },
];

function initCriticalDates() {
    const blocks = document.querySelectorAll('.date-block');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    blocks.forEach((block, i) => {
        const cfg = CRITICAL_DATES[i];
        if (!cfg) return;

        const eventDate = new Date(cfg.year, cfg.month, cfg.day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffMs = eventDate - today;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        const subEl = block.querySelector('.fs-9.text-muted');
        if (subEl) {
            if (diffDays < 0) {
                subEl.textContent = `${Math.abs(diffDays)} days ago`;
                subEl.style.color = '#dc2626';
            } else if (diffDays === 0) {
                subEl.textContent = 'Today!';
                subEl.style.color = 'var(--secondary)';
                subEl.style.fontWeight = '900';
            } else if (diffDays === 1) {
                subEl.textContent = 'Tomorrow';
                subEl.style.color = 'var(--secondary)';
            } else {
                subEl.textContent = `${cfg.verb} in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
            }
        }

        // Update month/day badges to match config
        const monthEl = block.querySelector('.date-month');
        const dayEl = block.querySelector('.date-day');
        if (monthEl) monthEl.textContent = monthNames[cfg.month].toUpperCase();
        if (dayEl) dayEl.textContent = String(cfg.day).padStart(2, '0');
    });
}

// ================================================================
// 10. PROGRESS BAR ANIMATIONS — Category Mix widget
// ================================================================
function initProgressBars() {
    const bars = document.querySelectorAll('.widget-dark .progress-bar');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const target = bar.style.width;   // already set inline in HTML
                    bar.style.width = '0%';

                    // re-trigger after a brief delay (CSS transition)
                    bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                    setTimeout(() => (bar.style.width = target), 80);

                    observer.unobserve(bar);
                }
            });
        },
        { threshold: 0.4 }
    );

    bars.forEach((bar) => observer.observe(bar));
}

// ================================================================
// 11. TOAST NOTIFICATION
// ================================================================
function showToast(htmlContent, type = 'info') {
    const colors = {
        success: { bg: '#166534', icon: 'check_circle' },
        warning: { bg: 'var(--secondary)', icon: 'warning' },
        danger: { bg: '#991b1b', icon: 'cancel' },
        info: { bg: 'var(--primary)', icon: 'info' },
    };
    const cfg = colors[type] || colors.info;

    // Ensure toast container exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
      position:fixed; bottom:1.5rem; right:1.5rem; z-index:99999;
      display:flex; flex-direction:column; gap:0.5rem;`;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
    display:flex; align-items:center; gap:0.75rem;
    background:${cfg.bg}; color:#fff;
    padding:0.85rem 1.25rem; min-width:260px; max-width:360px;
    box-shadow:0 8px 24px rgba(0,0,0,0.2);
    font-family:inherit; font-size:0.82rem; font-weight:600;
    opacity:0; transform:translateY(12px);
    transition:opacity 0.25s ease, transform 0.25s ease;`;
    toast.innerHTML = `
    <span class="material-symbols-outlined" style="font-size:1.1rem;flex-shrink:0;">${cfg.icon}</span>
    <span>${htmlContent}</span>`;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
    });

    // Dismiss after 3.5 s
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        setTimeout(() => toast.remove(), 280);
    }, 3500);
}

// ================================================================
// UTILITY — HTML escape helper
// ================================================================
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ================================================================
// 13. MANAGEMENT HUB — simple front-end admin tools
// ================================================================
async function initManagementHub() {
    const main = document.querySelector('main.container-xxl');
    if (!main || document.getElementById('admin-management-hub')) return;

    const [academies, players] = await Promise.all([
        readJsonFile('../data/academies.json'),
        readJsonFile('../data/players.json')
    ]);
    const storedPlayers = readLocalJson('zfPlayers');
    const adminData = getAdminData();

    const mergedPlayers = [...storedPlayers, ...players].map((player) => normaliseHubPlayer(player, academies));
    const academyRows = academies.map((academy) => {
        const academyPlayerCount = mergedPlayers.filter((player) => player.academyId === academy.id || player.academy === academy.name).length;
        return `
            <tr>
                <td class="fw-bold text-primary">${escHtml(academy.name)}</td>
                <td>${escHtml(academy.location)}</td>
                <td>${academy.teams?.length || 0}</td>
                <td>${academyPlayerCount}</td>
            </tr>
        `;
    }).join('');

    const playerRows = mergedPlayers.slice(0, 8).map((player) => `
        <tr>
            <td class="fw-bold text-primary">${escHtml(player.name)}</td>
            <td>${escHtml(player.academy)}</td>
            <td>${escHtml(player.division)}</td>
            <td>${escHtml(player.position)}</td>
        </tr>
    `).join('');

    const hub = document.createElement('section');
    hub.id = 'admin-management-hub';
    hub.className = 'mt-5 pt-4';
    hub.innerHTML = `
        <div class="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
            <div>
                <span class="text-secondary fw-bold text-uppercase fs-7 tracking-widest d-block mb-2">System Controls</span>
                <h2 class="editorial-header fs-1 fw-900 text-primary mb-0">Management <span class="text-secondary">Hub</span></h2>
            </div>
            <p class="mb-0 text-muted fw-bold">Front-end managed for the current dev phase. Ready to swap to Firebase later.</p>
        </div>

        <div class="row g-4">
            <div class="col-xl-6">
                <div class="widget">
                    <h3 class="widget-title text-primary">Team Members</h3>
                    <form id="teamMemberForm" class="row g-3 mb-4">
                        <input type="hidden" id="teamMemberId">
                        <div class="col-md-4"><input type="text" class="form-control" id="teamMemberName" placeholder="Representative name" required></div>
                        <div class="col-md-4"><input type="email" class="form-control" id="teamMemberEmail" placeholder="Email address" required></div>
                        <div class="col-md-4"><input type="text" class="form-control" id="teamMemberAcademy" placeholder="Academy" required></div>
                        <div class="col-12 d-flex gap-2">
                            <button class="btn btn-dark btn-sm px-4" type="submit">Save Member</button>
                            <button class="btn btn-light btn-sm px-4" type="button" id="teamMemberReset">Clear</button>
                        </div>
                    </form>
                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead><tr><th>Name</th><th>Academy</th><th>Email</th><th class="text-end">Action</th></tr></thead>
                            <tbody id="teamMembersTable"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-xl-6">
                <div class="widget">
                    <h3 class="widget-title text-primary">Admins</h3>
                    <form id="adminUserForm" class="row g-3 mb-4">
                        <input type="hidden" id="adminUserId">
                        <div class="col-md-4"><input type="text" class="form-control" id="adminUserName" placeholder="Admin name" required></div>
                        <div class="col-md-4"><input type="email" class="form-control" id="adminUserEmail" placeholder="Email address" required></div>
                        <div class="col-md-4"><input type="text" class="form-control" id="adminUserRole" placeholder="Role title" required></div>
                        <div class="col-12 d-flex gap-2">
                            <button class="btn btn-dark btn-sm px-4" type="submit">Save Admin</button>
                            <button class="btn btn-light btn-sm px-4" type="button" id="adminUserReset">Clear</button>
                        </div>
                    </form>
                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead><tr><th>Name</th><th>Role</th><th>Email</th><th class="text-end">Action</th></tr></thead>
                            <tbody id="adminsTable"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-xl-4">
                <div class="widget h-100">
                    <h3 class="widget-title text-primary">Divisions</h3>
                    <form id="divisionForm" class="d-flex gap-2 mb-3">
                        <input type="hidden" id="divisionId">
                        <input type="text" class="form-control" id="divisionName" placeholder="Division name" required>
                        <button class="btn btn-dark btn-sm px-4" type="submit">Save</button>
                    </form>
                    <ul class="list-group list-group-flush" id="divisionList"></ul>
                </div>
            </div>

            <div class="col-xl-4">
                <div class="widget h-100">
                    <h3 class="widget-title text-primary">Past Games</h3>
                    <form id="gameForm" class="row g-2 mb-3">
                        <input type="hidden" id="gameId">
                        <div class="col-12"><input type="text" class="form-control" id="gameFixture" placeholder="Fixture" required></div>
                        <div class="col-6"><input type="date" class="form-control" id="gameDate" required></div>
                        <div class="col-6"><input type="text" class="form-control" id="gameScore" placeholder="Score" required></div>
                        <div class="col-12"><button class="btn btn-dark btn-sm px-4" type="submit">Save Game</button></div>
                    </form>
                    <ul class="list-group list-group-flush" id="gamesList"></ul>
                </div>
            </div>

            <div class="col-xl-4">
                <div class="widget h-100">
                    <h3 class="widget-title text-primary">Snapshot</h3>
                    <div class="d-grid gap-3">
                        <div class="p-3 bg-white border">
                            <div class="small text-uppercase fw-bold text-muted mb-1">Academies</div>
                            <div class="fs-3 fw-900 text-primary">${academies.length}</div>
                        </div>
                        <div class="p-3 bg-white border">
                            <div class="small text-uppercase fw-bold text-muted mb-1">Players</div>
                            <div class="fs-3 fw-900 text-primary">${mergedPlayers.length}</div>
                        </div>
                        <div class="p-3 bg-white border">
                            <div class="small text-uppercase fw-bold text-muted mb-1">Team Members</div>
                            <div class="fs-3 fw-900 text-primary" id="teamMemberCount">${adminData.teamMembers.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-6">
                <div class="widget">
                    <h3 class="widget-title text-primary">All Academies</h3>
                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead><tr><th>Academy</th><th>Location</th><th>Teams</th><th>Players</th></tr></thead>
                            <tbody>${academyRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-xl-6">
                <div class="widget">
                    <h3 class="widget-title text-primary">Players Under Academies</h3>
                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead><tr><th>Player</th><th>Academy</th><th>Division</th><th>Position</th></tr></thead>
                            <tbody>${playerRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    main.appendChild(hub);
    bindManagementForms(adminData);
}

function getAdminData() {
    const stored = readLocalJson('zfAdminData');
    if (stored.teamMembers && stored.adminUsers && stored.divisions && stored.games) {
        return stored;
    }

    return {
        teamMembers: [
            { id: 'tm-1', name: 'Lillian Tembo', academy: 'North Star Elite', email: 'lillian@northstar.test' },
            { id: 'tm-2', name: 'Peter Daka', academy: 'Vortex Youth', email: 'peter@vortex.test' }
        ],
        adminUsers: [
            { id: 'ad-1', name: 'Mary Phiri', role: 'League Admin', email: 'mary@zf.test' },
            { id: 'ad-2', name: 'James Banda', role: 'Academy Admin', email: 'james@zf.test' }
        ],
        divisions: [
            { id: 'div-1', name: 'U12 Junior' },
            { id: 'div-2', name: 'U15 Youth' },
            { id: 'div-3', name: 'U17 Elite' }
        ],
        games: [
            { id: 'gm-1', fixture: 'North Star Elite vs Vortex Youth', date: '2026-03-12', score: '2-1' },
            { id: 'gm-2', fixture: 'Lionheart FC vs Phoenix Rising', date: '2026-03-04', score: '1-1' }
        ]
    };
}

function bindManagementForms(adminData) {
    persistAdminData(adminData);
    renderManagementLists(adminData);

    document.getElementById('teamMemberForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        upsertRecord(adminData.teamMembers, {
            id: document.getElementById('teamMemberId').value || `tm-${Date.now()}`,
            name: document.getElementById('teamMemberName').value.trim(),
            email: document.getElementById('teamMemberEmail').value.trim(),
            academy: document.getElementById('teamMemberAcademy').value.trim()
        });
        persistAdminData(adminData);
        renderManagementLists(adminData);
        event.target.reset();
        document.getElementById('teamMemberId').value = '';
        showToast('Team member record saved.', 'success');
    });

    document.getElementById('adminUserForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        upsertRecord(adminData.adminUsers, {
            id: document.getElementById('adminUserId').value || `ad-${Date.now()}`,
            name: document.getElementById('adminUserName').value.trim(),
            email: document.getElementById('adminUserEmail').value.trim(),
            role: document.getElementById('adminUserRole').value.trim()
        });
        persistAdminData(adminData);
        renderManagementLists(adminData);
        event.target.reset();
        document.getElementById('adminUserId').value = '';
        showToast('Admin record saved.', 'success');
    });

    document.getElementById('divisionForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        upsertRecord(adminData.divisions, {
            id: document.getElementById('divisionId').value || `div-${Date.now()}`,
            name: document.getElementById('divisionName').value.trim()
        });
        persistAdminData(adminData);
        renderManagementLists(adminData);
        event.target.reset();
        document.getElementById('divisionId').value = '';
        showToast('Division saved.', 'success');
    });

    document.getElementById('gameForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        upsertRecord(adminData.games, {
            id: document.getElementById('gameId').value || `gm-${Date.now()}`,
            fixture: document.getElementById('gameFixture').value.trim(),
            date: document.getElementById('gameDate').value,
            score: document.getElementById('gameScore').value.trim()
        });
        persistAdminData(adminData);
        renderManagementLists(adminData);
        event.target.reset();
        document.getElementById('gameId').value = '';
        showToast('Past game saved.', 'success');
    });

    document.getElementById('teamMemberReset')?.addEventListener('click', () => resetManagementForm('teamMember'));
    document.getElementById('adminUserReset')?.addEventListener('click', () => resetManagementForm('adminUser'));

    document.getElementById('admin-management-hub')?.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-collection][data-id]');
        if (!trigger) return;

        const { collection, id, action } = trigger.dataset;
        const targetCollection = adminData[collection];
        const record = targetCollection.find((item) => item.id === id);
        if (!record) return;

        if (action === 'edit') {
            hydrateManagementForm(collection, record);
            showToast('Record loaded into the form.', 'info');
            return;
        }

        adminData[collection] = targetCollection.filter((item) => item.id !== id);
        persistAdminData(adminData);
        renderManagementLists(adminData);
        showToast('Record removed.', 'warning');
    });
}

function renderManagementLists(adminData) {
    const teamMembersTable = document.getElementById('teamMembersTable');
    const adminsTable = document.getElementById('adminsTable');
    const divisionList = document.getElementById('divisionList');
    const gamesList = document.getElementById('gamesList');
    const teamMemberCount = document.getElementById('teamMemberCount');

    if (teamMembersTable) {
        teamMembersTable.innerHTML = adminData.teamMembers.map((member) => `
            <tr>
                <td class="fw-bold text-primary">${escHtml(member.name)}</td>
                <td>${escHtml(member.academy)}</td>
                <td>${escHtml(member.email)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light border" data-collection="teamMembers" data-id="${member.id}" data-action="edit">Edit</button>
                </td>
            </tr>
        `).join('');
    }

    if (adminsTable) {
        adminsTable.innerHTML = adminData.adminUsers.map((adminUser) => `
            <tr>
                <td class="fw-bold text-primary">${escHtml(adminUser.name)}</td>
                <td>${escHtml(adminUser.role)}</td>
                <td>${escHtml(adminUser.email)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light border" data-collection="adminUsers" data-id="${adminUser.id}" data-action="edit">Edit</button>
                </td>
            </tr>
        `).join('');
    }

    if (divisionList) {
        divisionList.innerHTML = adminData.divisions.map((division) => `
            <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                <span class="fw-bold text-primary">${escHtml(division.name)}</span>
                <button class="btn btn-sm btn-light border" data-collection="divisions" data-id="${division.id}" data-action="edit">Edit</button>
            </li>
        `).join('');
    }

    if (gamesList) {
        gamesList.innerHTML = adminData.games.map((game) => `
            <li class="list-group-item px-0">
                <div class="fw-bold text-primary">${escHtml(game.fixture)}</div>
                <div class="small text-muted">${escHtml(game.date)} · ${escHtml(game.score)}</div>
                <button class="btn btn-sm btn-light border mt-2" data-collection="games" data-id="${game.id}" data-action="edit">Edit</button>
            </li>
        `).join('');
    }

    if (teamMemberCount) {
        teamMemberCount.textContent = String(adminData.teamMembers.length);
    }
}

function hydrateManagementForm(collection, record) {
    if (collection === 'teamMembers') {
        document.getElementById('teamMemberId').value = record.id;
        document.getElementById('teamMemberName').value = record.name;
        document.getElementById('teamMemberEmail').value = record.email;
        document.getElementById('teamMemberAcademy').value = record.academy;
        return;
    }

    if (collection === 'adminUsers') {
        document.getElementById('adminUserId').value = record.id;
        document.getElementById('adminUserName').value = record.name;
        document.getElementById('adminUserEmail').value = record.email;
        document.getElementById('adminUserRole').value = record.role;
        return;
    }

    if (collection === 'divisions') {
        document.getElementById('divisionId').value = record.id;
        document.getElementById('divisionName').value = record.name;
        return;
    }

    if (collection === 'games') {
        document.getElementById('gameId').value = record.id;
        document.getElementById('gameFixture').value = record.fixture;
        document.getElementById('gameDate').value = record.date;
        document.getElementById('gameScore').value = record.score;
    }
}

function resetManagementForm(prefix) {
    if (prefix === 'teamMember') {
        document.getElementById('teamMemberForm')?.reset();
        document.getElementById('teamMemberId').value = '';
        return;
    }

    document.getElementById('adminUserForm')?.reset();
    document.getElementById('adminUserId').value = '';
}

function upsertRecord(collection, record) {
    const index = collection.findIndex((item) => item.id === record.id);
    if (index === -1) {
        collection.unshift(record);
        return;
    }

    collection[index] = record;
}

function persistAdminData(adminData) {
    localStorage.setItem('zfAdminData', JSON.stringify(adminData));
}

function readLocalJson(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        return [];
    }
}

async function readJsonFile(path) {
    try {
        const response = await fetch(path);
        return response.ok ? response.json() : [];
    } catch (error) {
        console.warn('[admin-dashboard] Failed to load', path, error);
        return [];
    }
}

function normaliseHubPlayer(player, academies) {
    const academyName = player.academy || academies.find((academy) => academy.id === player.academyId)?.name || 'Zambezi Futures Academy';

    return {
        id: player.id,
        name: player.name || `${player.firstName || ''} ${player.lastName || ''}`.trim(),
        academy: academyName,
        academyId: player.academyId || academies.find((academy) => academy.name === academyName)?.id || '',
        division: player.division || player.team || player.ageGroup || 'U-14',
        position: player.position || 'Midfielder'
    };
}
