'use strict';

const AcademyRegistry = (() => {
  const state = {
    academies: [],
    filteredAcademies: [],
    searchTerm: '',
    filters: {
      province: '',
      ageCategory: '',
      status: ''
    },
    pagination: {
      page: 1,
      limit: 6
    }
  };

  const dom = {};

  async function boot() {
    cacheDom();
    bindEvents();
    await loadAcademies();
    applyFilters();
    render();
  }

  function cacheDom() {
    dom.searchInput = document.querySelector('input[placeholder*="Search academy"]');
    const selects = document.querySelectorAll('select.form-select');
    dom.provinceSelect = selects[0];
    dom.ageSelect = selects[1];
    dom.statusSelect = selects[2];
    dom.applyButton = document.querySelector('.card.p-4.mb-5 .btn.btn-primary');
    dom.resetButton = document.querySelector('.card.p-4.mb-5 .btn.btn-light');
    dom.cardsContainer = document.querySelector('.row.g-4');
    dom.liveCount = document.querySelector('.col-lg-4 .display-4');
    dom.foundLabel = document.querySelector('.d-flex.justify-content-between.align-items-center.mb-4 .fw-bold.text-muted');
    dom.showingLabel = document.querySelector('.d-flex.flex-column.flex-md-row p.text-muted.fw-medium');
    dom.pagination = document.querySelector('.pagination');
  }

  function bindEvents() {
    dom.searchInput?.addEventListener('input', handleSearch);
    dom.applyButton?.addEventListener('click', handleApply);
    dom.resetButton?.addEventListener('click', handleReset);
    dom.pagination?.addEventListener('click', handlePagination);
    dom.cardsContainer?.addEventListener('click', handleCardAction);
  }

  async function loadAcademies() {
    try {
      const [academiesResponse, playersResponse] = await Promise.all([
        fetch('../data/academies.json'),
        fetch('../data/players.json')
      ]);

      const academies = academiesResponse.ok ? await academiesResponse.json() : [];
      const playerSeeds = playersResponse.ok ? await playersResponse.json() : [];
      const storedPlayers = readStoredPlayers();

      state.academies = academies.map((academy) => normaliseAcademy(academy, playerSeeds, storedPlayers));
    } catch (error) {
      console.error('[database] Failed to load academy data:', error);
      state.academies = [];
    }
  }

  function normaliseAcademy(academy, playerSeeds, storedPlayers) {
    const academyPlayers = [
      ...playerSeeds.filter((player) => player.academyId === academy.id),
      ...storedPlayers.filter((player) => player.academyId === academy.id || player.academy === academy.name)
    ];

    const ageGroups = academy.teams?.map((team) => team.name) || [];
    const primaryAgeGroup = ageGroups[0] || 'U14';
    const isActive = academyPlayers.length === 0 ? 'Active' : 'Active';

    return {
      id: academy.id,
      name: academy.name,
      location: `${academy.location}, Zambia`,
      status: isActive,
      ageCategory: primaryAgeGroup,
      players: academyPlayers.length,
      tier: academy.teams?.length > 1 ? 'ACADEMY-1' : 'DEVELOPMENT',
      img: academy.logo || 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
      teams: academy.teams || []
    };
  }

  function readStoredPlayers() {
    try {
      const raw = localStorage.getItem('zfPlayers');
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.warn('[database] Failed to parse zfPlayers:', error);
      return [];
    }
  }

  function handleSearch(event) {
    state.searchTerm = event.target.value.trim().toLowerCase();
    state.pagination.page = 1;
    applyFilters();
    render();
  }

  function handleApply(event) {
    event.preventDefault();
    state.filters.province = sanitiseSelectValue(dom.provinceSelect?.value, 'Province');
    state.filters.ageCategory = sanitiseSelectValue(dom.ageSelect?.value, 'Age Category');
    state.filters.status = sanitiseSelectValue(dom.statusSelect?.value, 'Status');
    state.pagination.page = 1;
    applyFilters();
    render();
  }

  function handleReset(event) {
    event.preventDefault();
    state.searchTerm = '';
    state.filters = { province: '', ageCategory: '', status: '' };
    state.pagination.page = 1;

    if (dom.searchInput) dom.searchInput.value = '';
    if (dom.provinceSelect) dom.provinceSelect.selectedIndex = 0;
    if (dom.ageSelect) dom.ageSelect.selectedIndex = 0;
    if (dom.statusSelect) dom.statusSelect.selectedIndex = 0;

    applyFilters();
    render();
  }

  function applyFilters() {
    state.filteredAcademies = state.academies.filter((academy) => {
      const matchesSearch = !state.searchTerm
        || academy.name.toLowerCase().includes(state.searchTerm)
        || academy.id.toLowerCase().includes(state.searchTerm);
      const matchesProvince = !state.filters.province || academy.location.toLowerCase().includes(state.filters.province.toLowerCase());
      const matchesAge = !state.filters.ageCategory || academy.teams.some((team) => `${team.name}-${team.division}`.includes(state.filters.ageCategory.replace(/\s/g, '')) || team.name.includes(state.filters.ageCategory.replace(/\s/g, '')));
      const matchesStatus = !state.filters.status || academy.status.toLowerCase() === state.filters.status.toLowerCase();
      return matchesSearch && matchesProvince && matchesAge && matchesStatus;
    });
  }

  function render() {
    renderCards();
    renderSummary();
    renderPagination();
  }

  function renderCards() {
    if (!dom.cardsContainer) return;

    const startIndex = (state.pagination.page - 1) * state.pagination.limit;
    const pagedAcademies = state.filteredAcademies.slice(startIndex, startIndex + state.pagination.limit);

    if (pagedAcademies.length === 0) {
      dom.cardsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-muted fw-bold mb-0">No academies matched your current filters.</p>
        </div>
      `;
      return;
    }

    dom.cardsContainer.innerHTML = pagedAcademies.map((academy) => `
      <div class="col-md-6 col-lg-4">
        <div class="card overflow-hidden p-0 h-100 border-0 shadow-sm">
          <div class="position-relative">
            <img src="${academy.img}" class="card-img-top" style="height:180px; object-fit:cover;" alt="${academy.name}">
            <span class="position-absolute top-0 end-0 m-3 badge bg-white shadow-sm px-3 py-2 d-flex align-items-center gap-2" style="color:var(--primary-color);">
              <span class="bg-success rounded-circle" style="width:8px;height:8px;"></span>
              <span class="small fw-bold text-uppercase">${academy.status}</span>
            </span>
          </div>
          <div class="p-4 d-flex flex-column h-100">
            <h3 class="h6 fw-black mb-1" style="color:var(--primary-color);">${academy.name}</h3>
            <p class="small text-muted mb-3"><span class="material-symbols-outlined fs-6 align-middle">location_on</span> ${academy.location}</p>
            <div class="p-3 rounded-3 d-flex justify-content-between mb-4 mt-auto" style="background:var(--bg-color);">
              <div>
                <span class="d-block small text-muted fw-bold text-uppercase mb-1">Players</span>
                <span class="h5 fw-black mb-0" style="color:var(--primary-color);">${academy.players}</span>
              </div>
              <div class="text-end">
                <span class="d-block small text-muted fw-bold text-uppercase mb-1">Tier</span>
                <span class="small fw-bold" style="color:var(--accent-color);">${academy.tier}</span>
              </div>
            </div>
            <button class="btn btn-primary w-100 fw-bold mt-auto" data-academy-id="${academy.id}">View Academy</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderSummary() {
    if (dom.liveCount) {
      dom.liveCount.textContent = state.filteredAcademies.length;
    }

    if (dom.foundLabel) {
      dom.foundLabel.textContent = `Found ${state.filteredAcademies.length} Academies`;
    }

    if (dom.showingLabel) {
      const start = state.filteredAcademies.length === 0 ? 0 : ((state.pagination.page - 1) * state.pagination.limit) + 1;
      const end = Math.min(state.pagination.page * state.pagination.limit, state.filteredAcademies.length);
      dom.showingLabel.innerHTML = `Showing <span class="fw-bold" style="color:var(--primary-color);">${start} to ${end}</span> of ${state.filteredAcademies.length} entries`;
    }
  }

  function renderPagination() {
    if (!dom.pagination) return;

    const totalPages = Math.max(1, Math.ceil(state.filteredAcademies.length / state.pagination.limit));
    const items = [];

    items.push(pageItem(state.pagination.page - 1, 'chevron_left', state.pagination.page === 1));
    for (let page = 1; page <= totalPages; page += 1) {
      items.push(`
        <li class="page-item ${page === state.pagination.page ? 'active' : ''}">
          <a class="page-link ${page === state.pagination.page ? 'border-0 shadow-sm' : ''}" href="#" data-page="${page}" ${page === state.pagination.page ? 'style="background:var(--primary-color);"' : ''}>${page}</a>
        </li>
      `);
    }
    items.push(pageItem(state.pagination.page + 1, 'chevron_right', state.pagination.page === totalPages));

    dom.pagination.innerHTML = items.join('');
  }

  function pageItem(page, icon, disabled) {
    return `
      <li class="page-item ${disabled ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${page}">
          <span class="material-symbols-outlined align-middle">${icon}</span>
        </a>
      </li>
    `;
  }

  function handlePagination(event) {
    const link = event.target.closest('.page-link');
    if (!link) return;
    event.preventDefault();

    const targetPage = Number(link.dataset.page);
    const totalPages = Math.max(1, Math.ceil(state.filteredAcademies.length / state.pagination.limit));

    if (!targetPage || targetPage < 1 || targetPage > totalPages || targetPage === state.pagination.page) {
      return;
    }

    state.pagination.page = targetPage;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCardAction(event) {
    const button = event.target.closest('[data-academy-id]');
    if (!button) return;

    const academyId = button.dataset.academyId;
    window.location.href = `academies.html?id=${encodeURIComponent(academyId)}`;
  }

  function sanitiseSelectValue(value, placeholder) {
    if (!value || value === placeholder) return '';
    return value;
  }

  return { boot };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', AcademyRegistry.boot);
} else {
  AcademyRegistry.boot();
}
