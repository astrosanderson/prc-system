/**
 * Elizaberth_database.js
 * High-performance Academy Registry Database Module
 * Features: Live Search, Staged Filters, URL Sync, Async API w/ Race Condition Handling, Event Delegation
 */
const AcademyRegistry = (() => {
    // --- STATE MANAGEMENT ---
    const state = {
        searchTerm: '',
        stagedFilters: { province: '', ageCategory: '', status: '' },
        activeFilters: { province: '', ageCategory: '', status: '' },
        pagination: { page: 1, limit: 12, total: 0 },
        isFetching: false
    };

    // --- DOM ACCESS STRATEGY ---
    // Cached DOM elements to avoid expensive repeated queries
    const DOM = {};

    const initDOM = () => {
        // Selectors optimized for Joanna_database.html DOM structure
        DOM.searchInput = document.querySelector('input[placeholder*="Search"]');
        const selects = document.querySelectorAll('select.form-select');
        if (selects.length >= 3) {
            DOM.provinceSelect = selects[0];
            DOM.ageSelect = selects[1];
            DOM.statusSelect = selects[2];
        }

        // Ensure we are inside the correct card
        const filterButtonsContainer = document.querySelector('.card.p-4.mb-5 .d-flex.gap-2');
        if (filterButtonsContainer) {
            DOM.applyBtn = filterButtonsContainer.querySelector('.btn-primary');
            DOM.resetBtn = filterButtonsContainer.querySelector('.btn-light');
        }

        DOM.cardsContainer = document.querySelector('.row.g-4');
        DOM.countDisplay = document.querySelector('.card h2.display-4');
        DOM.paginationContainer = document.querySelector('.pagination');

        const countDisplayContext = document.querySelector('.d-flex.justify-content-between.align-items-center.mb-4');
        if (countDisplayContext) {
            DOM.statsDisplay = countDisplayContext.querySelector('.fw-bold.text-muted');
        }

        const showingContext = document.querySelector('.d-flex.flex-column.flex-md-row');
        if (showingContext) {
            DOM.showingDisplay = showingContext.querySelector('p.text-muted.fw-medium');
        }
    };

    // --- UTILITIES ---
    const debounce = (func, wait) => {
        let timeoutId = null;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => func(...args), wait);
        };
    };

    const buildQueryString = () => {
        const params = new URLSearchParams();
        if (state.searchTerm) params.set('q', state.searchTerm);
        if (state.activeFilters.province) params.set('province', state.activeFilters.province);
        if (state.activeFilters.ageCategory) params.set('age', state.activeFilters.ageCategory);
        if (state.activeFilters.status) params.set('status', state.activeFilters.status);
        if (state.pagination.page > 1) params.set('page', state.pagination.page);
        return params.toString();
    };

    const updateURL = () => {
        const qs = buildQueryString();
        const newUrl = window.location.pathname + (qs ? `?${qs}` : '');
        window.history.pushState({ path: newUrl }, '', newUrl);
    };

    const readURL = () => {
        const params = new URLSearchParams(window.location.search);
        state.searchTerm = params.get('q') || '';
        state.activeFilters.province = params.get('province') || '';
        state.activeFilters.ageCategory = params.get('age') || '';
        state.activeFilters.status = params.get('status') || '';
        state.pagination.page = parseInt(params.get('page'), 10) || 1;

        // Sync staged with active immediately upon load/back-nav
        state.stagedFilters = { ...state.activeFilters };
    };

    // --- API SERVICE ---
    let abortController = null;

    const fetchAcademies = async () => {
        // Handling race conditions with AbortController
        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();

        state.isFetching = true;
        renderLoading();

        try {
            // For production, replace `mockFetchData` with the standard fetch implementation:
            // const response = await fetch(`/api/academies?${buildQueryString()}`, { signal: abortController.signal });
            // const data = await response.json();

            const responseData = await mockFetchData(state.searchTerm, state.activeFilters, state.pagination, abortController.signal);

            state.pagination.total = responseData.total;
            renderUI(responseData.data);
            renderPagination(responseData.total);
            updateStats(responseData.total);

        } catch (err) {
            if (err.name === 'AbortError') {
                // Silently safely ignore logic flow aborts when fetching a newer request
            } else {
                console.error('API Error:', err);
                renderError();
            }
        } finally {
            state.isFetching = false;
        }
    };

    // Fallback simulator acting as network backend matching Joanna_database specs.
    const mockFetchData = (searchTerm, filters, pagination, signal) => {
        return new Promise((resolve, reject) => {
            const ms = 250 + Math.random() * 300;
            const timeoutId = setTimeout(() => {
                resolve({
                    data: Array.from({ length: 3 }).map((_, i) => ({
                        id: `acad-${Date.now()}-${i}`,
                        name: (searchTerm ? `[${searchTerm}] ` : '') + (i === 0 ? 'Zambezi North Elite' : i === 1 ? 'Victoria Falls FC' : 'Copperbelt High Flyers'),
                        location: filters.province || (i === 1 ? 'Livingstone, Zambia' : i === 2 ? 'Ndola, Zambia' : 'Lusaka, Zambia'),
                        status: filters.status || (i === 2 ? 'Inactive' : 'Active'),
                        age: filters.ageCategory || 'U16-U18',
                        players: [48, 112, 24][i],
                        tier: ['PRO-ELITE', 'ACADEMY-1', 'DEVELOPMENT'][i],
                        img: i === 0 ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsdZNnGqsYLwebPNSKtxtQJiN0NkeptlLmtv96fttksPboKiEK6BrxrcCOA6NIc1qwoNgTW1NYZYJXPQHvTXmrjSbtywVjPtwnTA_X5zXX4hClZWADlhXWmbrpnvGCEtB5Y5KnhRJHuS5MhxrSM8m_W6BFtGIpahknWWL_ESHr-gQ7-3x78rFFpdxSeUN8C7oefk8BKfbDwZc4l17x2G2FozxkMFBTisijbGbbSvLwm5rDul6qU17rg5LF7IcetJz7DtO50GZC5yb6' : i === 1 ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY03rwUQ6UNDI3QRAxl-uwriofqC-Os0xs0XN6vPYaCIde0xsZ2vmV7KiCryDLIPyO0AzUByQ9TYJHZp0wnk9G7uT1FROgcXThOvix4g3kGbx5ru8hCA61nlrSV2EtAkypNux_r8DeOKI-CX64rtPAmq_fGXsPfp6zHmG48W430BLTDDUccg5PFOgEpd0PIQBhiLSBFbP_e4JzupRCjjoW_LEbXrjDJnV9T9FgYY7winWyzktBw02lUylj7aUlnCeT2S1VrUMmx8EB' : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAe5sbSN0bjG7oiSDTVYGmUQI1cz9grZSeIZvDvCfcChPxgBbth2mnOzIakNIvKk8ygK3o_E-QGfhKXlXx1-CZh5Xr4DrJNx4rjeRnQFIjOBsjcyg9vzAy5YooPXcf8eY721bsJLLgjH9laHDvDi4ofQu_6Iz-B-QrPWqOO9OWy_eg381sLNFnXQ34rbAtRgQSa7eZK1PVElxVnzsRokN1TD6LKubDvnTFizsgeNv7ct9lsotFXpjqykFuxqcZJwKVP6zBhJFrKegZZ'
                    })),
                    total: 124
                });
            }, ms);

            signal.addEventListener('abort', () => {
                clearTimeout(timeoutId);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        });
    };

    // --- RENDERING ---
    const renderLoading = () => {
        if (!DOM.cardsContainer) return;
        DOM.cardsContainer.innerHTML = `
      <div class="col-12 py-5 d-flex justify-content-center align-items-center">
         <div class="spinner-border" style="color:var(--primary-color);" role="status">
             <span class="visually-hidden">Loading...</span>
         </div>
      </div>
    `;
    };

    const renderError = () => {
        if (!DOM.cardsContainer) return;
        DOM.cardsContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-danger fw-bold">An error occurred while fetching the registry data.</p>
      </div>
    `;
    };

    const renderUI = (data) => {
        if (!DOM.cardsContainer) return;

        if (data.length === 0) {
            DOM.cardsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-muted fw-bold">No academies matched your search filters.</p>
        </div>
      `;
            return;
        }

        const fragment = document.createDocumentFragment();

        data.forEach(item => {
            const isInactive = item.status === 'Inactive';

            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            col.innerHTML = `
        <div class="card overflow-hidden p-0 h-100 border-0 shadow-sm">
            <div class="position-relative">
                <img src="${item.img}" class="card-img-top w-100" style="height:180px; object-fit:cover;" alt="Academy">
                <span class="position-absolute top-0 end-0 m-3 badge bg-white shadow-sm px-3 py-2 d-flex align-items-center gap-2 ${isInactive ? 'text-danger' : ''}" style="${!isInactive ? 'color:var(--primary-color);' : ''}">
                    <span class="${isInactive ? 'bg-danger' : 'bg-success'} rounded-circle" style="width:8px;height:8px;"></span>
                    <span class="small fw-bold text-uppercase">${item.status}</span>
                </span>
            </div>
            <div class="p-4 d-flex flex-column h-100">
                <h3 class="h6 fw-black mb-1" style="color:var(--primary-color);">${item.name}</h3>
                <p class="small text-muted mb-3"><span class="material-symbols-outlined fs-6 align-middle">location_on</span> ${item.location}</p>
                
                <div class="p-3 rounded-3 d-flex justify-content-between mb-4 mt-auto" style="background:var(--bg-color);">
                    <div>
                      <span class="d-block small text-muted fw-bold text-uppercase mb-1">Players</span>
                      <span class="h5 fw-black mb-0" style="color:var(--primary-color);">${item.players}</span>
                    </div>
                    <div class="text-end">
                      <span class="d-block small text-muted fw-bold text-uppercase mb-1">Tier</span>
                      <span class="small fw-bold" style="color:var(--accent-color);">${item.tier}</span>
                    </div>
                </div>
                
                <button class="btn btn-primary w-100 fw-bold mt-auto pointer-event" data-academy-id="${item.id}">View Academy</button>
            </div>
        </div>
      `;
            fragment.appendChild(col);
        });

        DOM.cardsContainer.replaceChildren(fragment); // High-performance DOM reset/insertion
    };

    const renderPagination = (total) => {
        if (!DOM.paginationContainer) return;
        const totalPages = Math.ceil(total / state.pagination.limit) || 1;
        DOM.paginationContainer.innerHTML = '';

        // Previous Page Button
        const prevDisabled = state.pagination.page === 1;
        DOM.paginationContainer.insertAdjacentHTML('beforeend', `
        <li class="page-item ${prevDisabled ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${state.pagination.page - 1}">
               <span class="material-symbols-outlined align-middle">chevron_left</span>
            </a>
        </li>
    `);

        // Visible Pages
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            const isActive = state.pagination.page === i;
            DOM.paginationContainer.insertAdjacentHTML('beforeend', `
           <li class="page-item ${isActive ? 'active' : ''}">
               <a class="page-link ${isActive ? 'border-0 shadow-sm' : ''}" href="#" data-page="${i}" ${isActive ? 'style="background:var(--primary-color);"' : ''}>${i}</a>
           </li>
        `);
        }

        // Next Page Button
        const nextDisabled = state.pagination.page >= totalPages;
        DOM.paginationContainer.insertAdjacentHTML('beforeend', `
        <li class="page-item ${nextDisabled ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${state.pagination.page + 1}">
               <span class="material-symbols-outlined align-middle">chevron_right</span>
            </a>
        </li>
    `);
    };

    const updateStats = (total) => {
        if (DOM.countDisplay) {
            DOM.countDisplay.textContent = total;
        }

        if (DOM.statsDisplay) {
            DOM.statsDisplay.textContent = `Found ${total} Academies`;
        }

        if (DOM.showingDisplay) {
            const start = total === 0 ? 0 : ((state.pagination.page - 1) * state.pagination.limit) + 1;
            const end = Math.min(state.pagination.page * state.pagination.limit, total);
            DOM.showingDisplay.innerHTML = `Showing <span class="fw-bold" style="color:var(--primary-color);">${start} to ${end}</span> of ${total} entries`;
        }
    };

    const syncUIFromState = () => {
        if (DOM.searchInput) DOM.searchInput.value = state.searchTerm;

        const applySelectMatch = (selNode, activeVal) => {
            if (!selNode) return;
            if (!activeVal) {
                selNode.options[0].selected = true;
                return;
            }
            Array.from(selNode.options).forEach(opt => {
                if (opt.value === activeVal || opt.text === activeVal) {
                    opt.selected = true;
                }
            });
        };

        applySelectMatch(DOM.provinceSelect, state.activeFilters.province);
        applySelectMatch(DOM.ageSelect, state.activeFilters.ageCategory);
        applySelectMatch(DOM.statusSelect, state.activeFilters.status);
    };

    // --- EVENT HANDLERS ---
    const handleSearch = debounce((e) => {
        const newVal = e.target.value.trim();
        if (newVal !== state.searchTerm) {
            state.searchTerm = newVal;
            state.pagination.page = 1;
            updateURL();
            fetchAcademies();
        }
    }, 300);

    const handleStageSelect = (filterKey) => (e) => {
        let rawVal = e.target.value;
        // Discard placeholder defaults
        if (['Province', 'Age Category', 'Status'].includes(rawVal)) rawVal = '';
        state.stagedFilters[filterKey] = rawVal;
    };

    const handleApply = (e) => {
        if (e) e.preventDefault();
        state.activeFilters = { ...state.stagedFilters };
        state.pagination.page = 1;
        updateURL();
        fetchAcademies();
    };

    const handleReset = (e) => {
        if (e) e.preventDefault();
        state.searchTerm = '';
        state.stagedFilters = { province: '', ageCategory: '', status: '' };
        state.activeFilters = { province: '', ageCategory: '', status: '' };
        state.pagination.page = 1;
        syncUIFromState();
        updateURL();
        fetchAcademies();
    };

    const handlePaginationDelegation = (e) => {
        const link = e.target.closest('.page-link');
        if (!link) return;

        e.preventDefault();
        // Ignore clicks on disabled or currently active references
        if (link.parentElement.classList.contains('disabled') || link.parentElement.classList.contains('active')) return;

        const targetedPage = parseInt(link.getAttribute('data-page'), 10);
        if (!isNaN(targetedPage)) {
            state.pagination.page = targetedPage;
            updateURL();
            fetchAcademies();

            // Scroll slightly up for better UX experience 
            window.scrollTo({ top: DOM.searchInput ? DOM.searchInput.offsetTop - 150 : 0, behavior: 'smooth' });
        }
    };

    const handleRoutePop = () => {
        readURL();
        syncUIFromState();
        fetchAcademies();
    };

    // --- LIFECYCLE ---
    const bindEvents = () => {
        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('input', handleSearch);
        }

        if (DOM.provinceSelect) DOM.provinceSelect.addEventListener('change', handleStageSelect('province'));
        if (DOM.ageSelect) DOM.ageSelect.addEventListener('change', handleStageSelect('ageCategory'));
        if (DOM.statusSelect) DOM.statusSelect.addEventListener('change', handleStageSelect('status'));

        if (DOM.applyBtn) DOM.applyBtn.addEventListener('click', handleApply);
        if (DOM.resetBtn) DOM.resetBtn.addEventListener('click', handleReset);

        // Pagination event delegation
        if (DOM.paginationContainer) {
            DOM.paginationContainer.addEventListener('click', handlePaginationDelegation);
        }

        // Intercept Back/Forward navigations
        window.addEventListener('popstate', handleRoutePop);
    };

    const boot = () => {
        initDOM();
        bindEvents();

        // First load execution sync constraints
        readURL();
        syncUIFromState();
        fetchAcademies();
    };

    return { boot };
})();

// Execution setup natively aligned with HTML execution stream
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', AcademyRegistry.boot);
} else {
    AcademyRegistry.boot();
}