/**
 * Mirriam_archive.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Backend logic for Mirriam_archive.html (Zambezi Futures – Historical Hub).
 *
 * Features implemented (zero HTML modifications):
 *  1. Sidebar active-highlight that tracks scroll position.
 *  2. Hall of Fame carousel with < / > nav buttons + auto-slideshow that
 *     kicks in when the section is fully scrolled into view.
 *  3. Tournament Records season-search bar (injected above the table).
 *  4. League Records age-group dropdown + dynamic stats panel (injected
 *     into the footer / #leagueRecords section).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ═══════════════════════════════════════════════════════════════════════════
   § 0 – SHARED DATA
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Tournament records dataset.
 * Each entry represents one season / tournament.
 */
const TOURNAMENT_DATA = [
    { season: "2024/25", tournament: "Continental Cup", winner: "Zambezi Futures", runnerUp: "East Africa Elite", topScorer: "K. Mwale (14)" },
    { season: "2023/24", tournament: "National Shield", winner: "Zambezi Futures", runnerUp: "Lusaka United SC", topScorer: "E. Vance (11)" },
    { season: "2022/23", tournament: "Continental Cup", winner: "Zambezi Futures", runnerUp: "Pacific Academy", topScorer: "A. Richards (12)" },
    { season: "2021/22", tournament: "Youth Pro Shield", winner: "Zambezi Futures", runnerUp: "London Youth FC", topScorer: "M. Reed (15)" },
    { season: "2020/21", tournament: "Founders Cup", winner: "Copperbelt Stars", runnerUp: "Zambezi Futures", topScorer: "T. Banda (9)" },
    { season: "2019/20", tournament: "National Youth Cup", winner: "Zambezi Futures", runnerUp: "Southern Lions", topScorer: "C. Phiri (10)" },
    { season: "2018/19", tournament: "Continental Cup", winner: "Southern Lions", runnerUp: "Zambezi Futures", topScorer: "J. Mutale (13)" },
    { season: "2017/18", tournament: "Youth Pro Shield", winner: "Zambezi Futures", runnerUp: "Northern Stars", topScorer: "M. Reed (8)" },
];

/**
 * Hall of Fame entries — richer dataset used by the carousel.
 */
const HOF_DATA = [
    {
        badge: "Player of the Season",
        name: "Marcus Reed",
        subtitle: "Forward | 24 Goals",
        year: "2021/22",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQgxEsy1xi4PFMTg0WZztIXCh8W3ZgA4D52mTi3pwDxlj7Fer1EQOUzr-Q-iiopCGC37MDJrA0igoaCHhqpkpP6-4XpsfYkDUHvfpY1HucPey26f4pWGtwHAslYiY4k4xKKh2m8ZBOsyPmWLDbRhrV9txO_Qf0Uk6mlHYJpIW44oNHidth2jB_Q12jVioFcv_9CXKCe0DiPitc0wpDVAM707BwUWa64su7Kn_Gcva-cTS3IzhzijB-qWufFvHYeLpSaFTgO429HxKt",
    },
    {
        badge: "Academy of the Year",
        name: "Zambezi U-17",
        subtitle: "National Champions",
        year: "2022/23",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAUEfWAvm7AECb4YjaXQf3l56zGzrPhkw8gwSb7IiJnE_2rM1p1D4zZwSPbheppgSe4ePDKy_5ug3wU7Mm1ZVlH7Ypm8VxKDRPmYuXuKMhv9zbXLyYi8jLDruhi1DvuKbaIPUYAKzoOu0nm12K8lm3kAAuCJbJmwLU-_Lv6pSPE1VdyNy-tm76wPGEwFhC_68Ift4CmgzB5IhvxD7mYFsksMMbsWzupRH0oXBvwsYNLqj1gGz3wc7GdSekkrU-qi8SO1nHsTyHRKH0",
    },
    {
        badge: "Player of the Season",
        name: "Elena Vance",
        subtitle: "Midfield | 18 Assists",
        year: "2023/24",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9wWK4Pq2ww4UffE44D3MjKqp5xWNe9l-shZ55PGZE5K3ereiO3qRryjxfR1T-korGv3GYlkWqwS_JbzU8Yqv9pG-AnQxHRrvKIM9zD0pFLLwxUuUTgINos6YtMmLAUs90H__T-ovpohwrGBafENw-of04L_-q56DGp8O6qm3tu3Go5_bJLc_nbxDUNnwx8BB08M9KaulpmTyKCiJSCsP7lFXo-ZQ8ds72nQDW_bOqxxl4zvOIvcS8hFNbKR1BF7EYbyV5o-KuWcid",
    },
    {
        badge: "Golden Boot",
        name: "Kelvin Mwale",
        subtitle: "Striker | 14 Goals",
        year: "2024/25",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQgxEsy1xi4PFMTg0WZztIXCh8W3ZgA4D52mTi3pwDxlj7Fer1EQOUzr-Q-iiopCGC37MDJrA0igoaCHhqpkpP6-4XpsfYkDUHvfpY1HucPey26f4pWGtwHAslYiY4k4xKKh2m8ZBOsyPmWLDbRhrV9txO_Qf0Uk6mlHYJpIW44oNHidth2jB_Q12jVioFcv_9CXKCe0DiPitc0wpDVAM707BwUWa64su7Kn_Gcva-cTS3IzhzijB-qWufFvHYeLpSaFTgO429HxKt",
    },
    {
        badge: "Best Goalkeeper",
        name: "Tendai Banda",
        subtitle: "GK | 18 Clean Sheets",
        year: "2020/21",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAUEfWAvm7AECb4YjaXQf3l56zGzrPhkw8gwSb7IiJnE_2rM1p1D4zZwSPbheppgSe4ePDKy_5ug3wU7Mm1ZVlH7Ypm8VxKDRPmYuXuKMhv9zbXLyYi8jLDruhi1DvuKbaIPUYAKzoOu0nm12K8lm3kAAuCJbJmwLU-_Lv6pSPE1VdyNy-tm76wPGEwFhC_68Ift4CmgzB5IhvxD7mYFsksMMbsWzupRH0oXBvwsYNLqj1gGz3wc7GdSekkrU-qi8SO1nHsTyHRKH0",
    },
];

/**
 * League records dataset indexed by age group.
 * Each age group has:
 *  - standings  : array of { pos, team, p, w, d, l, gf, ga, pts }
 *  - topScorers : array of { name, team, goals }
 *  - recentResults: array of { home, score, away }
 */
const LEAGUE_DATA = {
    U13: {
        standings: [
            { pos: 1, team: "Zambezi Futures U13", p: 18, w: 14, d: 3, l: 1, gf: 52, ga: 14, pts: 45 },
            { pos: 2, team: "Lusaka United U13", p: 18, w: 12, d: 2, l: 4, gf: 38, ga: 20, pts: 38 },
            { pos: 3, team: "Copperbelt Stars U13", p: 18, w: 10, d: 3, l: 5, gf: 34, ga: 22, pts: 33 },
            { pos: 4, team: "Southern Lions U13", p: 18, w: 8, d: 4, l: 6, gf: 29, ga: 28, pts: 28 },
            { pos: 5, team: "Northern Stars U13", p: 18, w: 6, d: 2, l: 10, gf: 22, ga: 38, pts: 20 },
        ],
        topScorers: [
            { name: "T. Chanda", team: "Zambezi Futures U13", goals: 18 },
            { name: "D. Phiri", team: "Lusaka United U13", goals: 14 },
            { name: "B. Mulenga", team: "Copperbelt Stars U13", goals: 11 },
        ],
        recentResults: [
            { home: "Zambezi Futures U13", score: "4–0", away: "Northern Stars U13" },
            { home: "Lusaka United U13", score: "2–1", away: "Southern Lions U13" },
            { home: "Copperbelt Stars U13", score: "1–1", away: "Zambezi Futures U13" },
        ],
    },
    U15: {
        standings: [
            { pos: 1, team: "Zambezi Futures U15", p: 20, w: 15, d: 4, l: 1, gf: 58, ga: 16, pts: 49 },
            { pos: 2, team: "East Africa Elite U15", p: 20, w: 13, d: 3, l: 4, gf: 44, ga: 24, pts: 42 },
            { pos: 3, team: "Lusaka United U15", p: 20, w: 9, d: 5, l: 6, gf: 36, ga: 30, pts: 32 },
            { pos: 4, team: "Pacific Academy U15", p: 20, w: 7, d: 3, l: 10, gf: 28, ga: 40, pts: 24 },
            { pos: 5, team: "Southern Lions U15", p: 20, w: 3, d: 2, l: 15, gf: 18, ga: 54, pts: 11 },
        ],
        topScorers: [
            { name: "A. Richards", team: "Zambezi Futures U15", goals: 22 },
            { name: "F. Obi", team: "East Africa Elite U15", goals: 17 },
            { name: "N. Sakala", team: "Lusaka United U15", goals: 13 },
        ],
        recentResults: [
            { home: "Zambezi Futures U15", score: "3–1", away: "Pacific Academy U15" },
            { home: "East Africa Elite U15", score: "2–2", away: "Lusaka United U15" },
            { home: "Southern Lions U15", score: "0–4", away: "Zambezi Futures U15" },
        ],
    },
    U17: {
        standings: [
            { pos: 1, team: "Zambezi Futures U17", p: 22, w: 18, d: 2, l: 2, gf: 66, ga: 20, pts: 56 },
            { pos: 2, team: "Copperbelt Stars U17", p: 22, w: 14, d: 4, l: 4, gf: 48, ga: 28, pts: 46 },
            { pos: 3, team: "London Youth FC U17", p: 22, w: 11, d: 5, l: 6, gf: 40, ga: 32, pts: 38 },
            { pos: 4, team: "Northern Stars U17", p: 22, w: 8, d: 3, l: 11, gf: 30, ga: 42, pts: 27 },
            { pos: 5, team: "Pacific Academy U17", p: 22, w: 4, d: 2, l: 16, gf: 22, ga: 58, pts: 14 },
        ],
        topScorers: [
            { name: "M. Reed", team: "Zambezi Futures U17", goals: 24 },
            { name: "C. Mumba", team: "Copperbelt Stars U17", goals: 19 },
            { name: "J. Mutale", team: "London Youth FC U17", goals: 15 },
        ],
        recentResults: [
            { home: "Zambezi Futures U17", score: "5–1", away: "Pacific Academy U17" },
            { home: "Copperbelt Stars U17", score: "2–1", away: "London Youth FC U17" },
            { home: "Northern Stars U17", score: "0–3", away: "Zambezi Futures U17" },
        ],
    },
    U19: {
        standings: [
            { pos: 1, team: "Zambezi Futures U19", p: 22, w: 16, d: 4, l: 2, gf: 60, ga: 18, pts: 52 },
            { pos: 2, team: "East Africa Elite U19", p: 22, w: 14, d: 2, l: 6, gf: 50, ga: 26, pts: 44 },
            { pos: 3, team: "Lusaka United U19", p: 22, w: 10, d: 6, l: 6, gf: 38, ga: 34, pts: 36 },
            { pos: 4, team: "Southern Lions U19", p: 22, w: 7, d: 3, l: 12, gf: 28, ga: 46, pts: 24 },
            { pos: 5, team: "Pacific Academy U19", p: 22, w: 2, d: 3, l: 17, gf: 16, ga: 62, pts: 9 },
        ],
        topScorers: [
            { name: "E. Vance", team: "Zambezi Futures U19", goals: 20 },
            { name: "K. Mwale", team: "East Africa Elite U19", goals: 16 },
            { name: "T. Phiri", team: "Lusaka United U19", goals: 12 },
        ],
        recentResults: [
            { home: "Zambezi Futures U19", score: "4–0", away: "Pacific Academy U19" },
            { home: "East Africa Elite U19", score: "3–1", away: "Lusaka United U19" },
            { home: "Southern Lions U19", score: "1–2", away: "Zambezi Futures U19" },
        ],
    },
};

/* ═══════════════════════════════════════════════════════════════════════════
   § 1 – UTILITY HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

/** Quick element creator with optional classes and attributes. */
function el(tag, classes = "", attrs = {}) {
    const e = document.createElement(tag);
    if (classes) e.className = classes;
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
}

/** Inject a <style> block once. */
function injectStyles(id, css) {
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 2 – SIDEBAR SCROLL-SPY
   Highlights the matching sidebar link as the user scrolls through sections.
   ═══════════════════════════════════════════════════════════════════════════ */

function initSidebarScrollSpy() {
    injectStyles("archive-sidebar-styles", `
    /* Active sidebar link override */
    #archiveSidebar .list-group-item.js-active {
      background: rgba(11,61,46,0.10) !important;
      color: var(--primary-color, #0b3d2e) !important;
      font-weight: 700;
      border-left: 3px solid var(--accent-color, #c9a84c) !important;
      padding-left: calc(1rem - 3px) !important;
    }
    #archiveSidebar .list-group-item {
      transition: background 0.25s, color 0.25s, border 0.25s, padding 0.25s;
    }
    #archiveSidebar .list-group-item .material-symbols-outlined {
      transition: color 0.25s;
    }
    #archiveSidebar .list-group-item.js-active .material-symbols-outlined {
      color: var(--accent-color, #c9a84c) !important;
    }
  `);

    const sidebarLinks = document.querySelectorAll("#archiveSidebar .list-group-item");
    const sections = Array.from(sidebarLinks).map(link => {
        const id = link.getAttribute("href");
        return id ? document.querySelector(id) : null;
    });

    const OFFSET = 120; // px from top – accounts for sticky navbar

    function updateActive() {
        const scrollY = window.scrollY;

        // Find the last section whose top is above our scroll threshold
        let activeIdx = 0;
        sections.forEach((section, i) => {
            if (!section) return;
            if (section.getBoundingClientRect().top + scrollY - OFFSET <= scrollY + 10) {
                activeIdx = i;
            }
        });

        sidebarLinks.forEach((link, i) => {
            link.classList.toggle("js-active", i === activeIdx);
        });
    }

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive(); // run once on load
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 3 – HALL OF FAME CAROUSEL
   - Injects < / > navigation arrows above the HOF cards row.
   - Shows one "featured" card at a time on narrow viewports, 3 at a time
     on wide viewports (mirrors the existing col-md-4 grid).
   - Auto-advances when the section is scrolled fully into view.
   ═══════════════════════════════════════════════════════════════════════════ */

function initHallOfFameCarousel() {
    const hofSection = document.getElementById("hallOfFame");
    if (!hofSection) return;

    injectStyles("hof-carousel-styles", `
    /* Carousel wrapper */
    #hofCarouselWrapper {
      position: relative;
      overflow: hidden;
    }

    /* Nav buttons */
    .hof-nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      background: var(--primary-color, #0b3d2e);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(0,0,0,0.18);
      transition: background 0.2s, transform 0.2s;
    }
    .hof-nav-btn:hover {
      background: var(--accent-color, #c9a84c);
      transform: translateY(-50%) scale(1.08);
    }
    #hofPrev { left: -6px; }
    #hofNext { right: -6px; }

    /* Slide track */
    #hofTrack {
      display: flex;
      transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
      will-change: transform;
    }
    .hof-slide {
      flex: 0 0 100%;
      max-width: 100%;
      padding: 0 4px;
      box-sizing: border-box;
    }
    @media (min-width: 768px) {
      .hof-slide { flex: 0 0 33.3333%; max-width: 33.3333%; }
    }

    /* Dot indicators */
    #hofDots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 1.4rem;
    }
    .hof-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #d0d0d0;
      border: none;
      cursor: pointer;
      transition: background 0.25s, transform 0.25s;
    }
    .hof-dot.active {
      background: var(--accent-color, #c9a84c);
      transform: scale(1.35);
    }

    /* "Spotlight" highlight for the active HOF card on mobile */
    .hof-slide.hof-spotlight .card {
      box-shadow: 0 8px 36px rgba(201,168,76,0.35), 0 2px 8px rgba(0,0,0,0.12);
      transform: translateY(-4px);
      transition: box-shadow 0.4s, transform 0.4s;
    }
  `);

    /* ── Build the carousel DOM ── */
    const headerRow = hofSection.querySelector(".d-flex.justify-content-between");
    const originalRow = hofSection.querySelector(".row.g-4");
    if (!originalRow) return;

    // Wrapper
    const wrapper = el("div", "", { id: "hofCarouselWrapper" });
    wrapper.style.position = "relative";

    // Track
    const track = el("div", "", { id: "hofTrack" });

    // Build slides from HOF_DATA
    HOF_DATA.forEach(entry => {
        const slide = el("div", "hof-slide");
        slide.innerHTML = `
      <div class="card hof-card overflow-hidden p-0 rounded-4" style="background:var(--bg-color,#f8f9fa);">
        <div class="p-4 pb-0">
          <span class="badge-gold d-inline-block mb-3">${entry.badge} &nbsp;·&nbsp; ${entry.year}</span>
          <h4 class="fw-black display-6 mb-1" style="font-size:1.4rem;">${entry.name}</h4>
          <p class="small fw-bold text-uppercase mb-3" style="color:var(--accent-color,#c9a84c);">${entry.subtitle}</p>
        </div>
        <img src="${entry.img}" alt="${entry.name}" style="height:220px;object-fit:cover;width:100%;">
      </div>`;
        track.appendChild(slide);
    });

    // Prev / Next buttons
    const prevBtn = el("button", "hof-nav-btn", { id: "hofPrev", "aria-label": "Previous" });
    prevBtn.innerHTML = "&#8249;";
    const nextBtn = el("button", "hof-nav-btn", { id: "hofNext", "aria-label": "Next" });
    nextBtn.innerHTML = "&#8250;";

    wrapper.appendChild(prevBtn);
    wrapper.appendChild(track);
    wrapper.appendChild(nextBtn);

    // Dot indicators
    const dotsContainer = el("div", "", { id: "hofDots" });
    HOF_DATA.forEach((_, i) => {
        const dot = el("button", `hof-dot${i === 0 ? " active" : ""}`, { "aria-label": `Slide ${i + 1}` });
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    // Replace the original cards row with the carousel
    originalRow.replaceWith(wrapper);
    wrapper.after(dotsContainer);

    /* ── Carousel state ── */
    let currentIndex = 0;
    let slidesPerView = window.innerWidth >= 768 ? 3 : 1;
    let autoTimer = null;
    const totalSlides = HOF_DATA.length;

    function maxIndex() {
        return Math.max(0, totalSlides - slidesPerView);
    }

    function goTo(idx) {
        currentIndex = Math.max(0, Math.min(idx, maxIndex()));
        const pct = (currentIndex / slidesPerView) * 100; // shift by one full "page"
        // Simpler: shift by currentIndex × (100 / slidesPerView)%
        const shiftPct = (currentIndex * (100 / slidesPerView));
        track.style.transform = `translateX(-${shiftPct}%)`;

        // Spotlight effect — highlight the first visible slide
        track.querySelectorAll(".hof-slide").forEach((s, i) => {
            s.classList.toggle("hof-spotlight", i === currentIndex);
        });

        // Update dots
        document.querySelectorAll(".hof-dot").forEach((d, i) => {
            d.classList.toggle("active", i === currentIndex);
        });
    }

    function next() { goTo(currentIndex >= maxIndex() ? 0 : currentIndex + 1); }
    function prev() { goTo(currentIndex <= 0 ? maxIndex() : currentIndex - 1); }

    nextBtn.addEventListener("click", () => { stopAuto(); next(); startAuto(); });
    prevBtn.addEventListener("click", () => { stopAuto(); prev(); startAuto(); });

    function startAuto() {
        stopAuto();
        autoTimer = setInterval(next, 3500);
    }
    function stopAuto() {
        clearInterval(autoTimer);
        autoTimer = null;
    }

    // Recalculate on resize
    window.addEventListener("resize", () => {
        slidesPerView = window.innerWidth >= 768 ? 3 : 1;
        goTo(currentIndex);
    }, { passive: true });

    // IntersectionObserver: start auto-slideshow when HOF section is in view
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAuto();
                } else {
                    stopAuto();
                }
            });
        },
        { threshold: 0.5 }
    );
    observer.observe(hofSection);

    // Initialise first slide
    goTo(0);
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 4 – TOURNAMENT RECORDS SEASON SEARCH
   Injects a season-selector search bar above the tournament table.
   ═══════════════════════════════════════════════════════════════════════════ */

function initTournamentSearch() {
    const section = document.getElementById("tournamentRecords");
    if (!section) return;

    const heading = section.querySelector("h2");
    const tableCard = section.querySelector(".card");
    if (!heading || !tableCard) return;

    injectStyles("tournament-search-styles", `
    #tournamentSearchWrap {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    #tournamentSearchWrap label {
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--primary-color, #0b3d2e);
      white-space: nowrap;
    }
    #tournamentSeasonSelect {
      border: 2px solid var(--primary-color, #0b3d2e);
      border-radius: 8px;
      padding: 0.45rem 1rem;
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--primary-color, #0b3d2e);
      background: #fff;
      cursor: pointer;
      min-width: 140px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    #tournamentSeasonSelect:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(201,168,76,0.3);
      border-color: var(--accent-color, #c9a84c);
    }
    #tournamentTableBody tr {
      transition: background 0.2s;
    }
    #tournamentTableBody tr.hidden-row {
      display: none;
    }
    #tournamentNoResults {
      display: none;
      padding: 2rem;
      text-align: center;
      color: #888;
      font-style: italic;
    }
  `);

    /* ── Search bar ── */
    const searchWrap = el("div", "", { id: "tournamentSearchWrap" });

    const label = el("label", "", { for: "tournamentSeasonSelect" });
    label.textContent = "Filter by Season:";

    const select = el("select", "", { id: "tournamentSeasonSelect" });

    // "All seasons" option
    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = "All Seasons";
    select.appendChild(allOpt);

    // One option per unique season
    const seasons = [...new Set(TOURNAMENT_DATA.map(d => d.season))];
    seasons.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        select.appendChild(opt);
    });

    searchWrap.appendChild(label);
    searchWrap.appendChild(select);

    // Insert between heading and table card
    heading.after(searchWrap);

    /* ── Re-build the table from TOURNAMENT_DATA ── */
    const tbody = tableCard.querySelector("tbody");
    if (tbody) {
        tbody.id = "tournamentTableBody";
        tbody.innerHTML = ""; // clear hard-coded rows

        const starIcon = `<span class="material-symbols-outlined fs-6" style="font-variation-settings:'FILL' 1;">stars</span>`;
        const isZambezi = w => w.toLowerCase().includes("zambezi");

        TOURNAMENT_DATA.forEach(row => {
            const tr = document.createElement("tr");
            tr.dataset.season = row.season;
            tr.innerHTML = `
        <td class="ps-4 fw-black">${row.season}</td>
        <td class="fw-bold">${row.tournament}</td>
        <td>${isZambezi(row.winner)
                    ? `<span class="badge rounded-2 fw-bold d-inline-flex align-items-center gap-1 p-2" style="background:var(--accent-color,#c9a84c);color:white;">${starIcon} ${row.winner}</span>`
                    : `<span class="fw-semibold">${row.winner}</span>`
                }</td>
        <td class="text-muted small">${row.runnerUp}</td>
        <td class="pe-4 small fw-bold">${row.topScorer}</td>`;
            tbody.appendChild(tr);
        });

        // No results message
        const noResults = el("tr", "", { id: "tournamentNoResults" });
        noResults.innerHTML = `<td colspan="5" style="text-align:center;padding:2rem;color:#aaa;font-style:italic;">No records found for this season.</td>`;
        tbody.appendChild(noResults);
    }

    /* ── Filter logic ── */
    select.addEventListener("change", () => {
        const val = select.value;
        let anyVisible = false;
        document.querySelectorAll("#tournamentTableBody tr[data-season]").forEach(row => {
            const match = val === "all" || row.dataset.season === val;
            row.classList.toggle("hidden-row", !match);
            if (match) anyVisible = true;
        });
        const noResults = document.getElementById("tournamentNoResults");
        if (noResults) noResults.style.display = anyVisible ? "none" : "table-row";
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 5 – LEAGUE RECORDS DROPDOWN + STATS PANEL
   Injects age-group selector and dynamic standings / top scorers /
   recent results into the #leagueRecords footer.
   ═══════════════════════════════════════════════════════════════════════════ */

function initLeagueRecords() {
    const footer = document.getElementById("leagueRecords");
    if (!footer) return;

    injectStyles("league-records-styles", `
    #leagueRecordsPanel {
      text-align: left;
      padding: 0;
      margin-bottom: 2rem;
    }
    #leagueRecordsPanel h2 {
      font-style: italic;
      font-weight: 900;
      text-transform: uppercase;
      font-size: clamp(1.5rem, 3vw, 2rem);
      margin-bottom: 1.2rem;
    }
    #leagueGroupWrap {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 1.8rem;
      flex-wrap: wrap;
    }
    #leagueGroupWrap label {
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--primary-color, #0b3d2e);
    }
    #leagueGroupSelect {
      border: 2px solid var(--primary-color, #0b3d2e);
      border-radius: 8px;
      padding: 0.45rem 1.2rem;
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--primary-color, #0b3d2e);
      background: #fff;
      cursor: pointer;
      min-width: 130px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    #leagueGroupSelect:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(201,168,76,0.3);
      border-color: var(--accent-color, #c9a84c);
    }

    /* Sub-section tabs */
    #leagueTabBar {
      display: flex;
      gap: 8px;
      margin-bottom: 1.2rem;
      border-bottom: 2px solid #e5e5e5;
      padding-bottom: 0;
    }
    .league-tab-btn {
      background: none;
      border: none;
      padding: 0.55rem 1.1rem 0.65rem;
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #888;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      transition: color 0.2s, border-color 0.2s;
    }
    .league-tab-btn.active {
      color: var(--primary-color, #0b3d2e);
      border-bottom-color: var(--accent-color, #c9a84c);
    }
    .league-tab-btn:hover { color: var(--primary-color, #0b3d2e); }

    /* Tables */
    .league-data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }
    .league-data-table thead th {
      background: var(--primary-color, #0b3d2e);
      color: #fff;
      padding: 0.6rem 0.8rem;
      font-weight: 700;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .league-data-table tbody tr:nth-child(even) { background: #f4f6f4; }
    .league-data-table tbody tr:hover { background: rgba(11,61,46,0.06); }
    .league-data-table tbody td { padding: 0.55rem 0.8rem; }
    .league-data-table .leader-row td:first-child {
      font-weight: 900;
      color: var(--accent-color, #c9a84c);
    }
    .pts-cell { font-weight: 900; color: var(--primary-color, #0b3d2e); }
    .result-badge {
      display: inline-block;
      padding: 0.25rem 0.7rem;
      border-radius: 20px;
      font-weight: 800;
      font-size: 0.9rem;
      background: var(--primary-color, #0b3d2e);
      color: white;
      letter-spacing: 0.04em;
    }

    /* League panel fade-in */
    #leagueDataContent {
      animation: leagueFadeIn 0.35s ease;
    }
    @keyframes leagueFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Divider before footer copyright */
    #leagueFooterDivider {
      border-top: 1px solid #e0e0e0;
      margin-top: 2rem;
      padding-top: 1.5rem;
    }
  `);

    /* ── Build the panel ── */
    const panel = el("div", "", { id: "leagueRecordsPanel" });

    // Heading
    const heading = el("h2");
    heading.innerHTML = `League <span style="color:var(--accent-color,#c9a84c);">Records</span>`;
    panel.appendChild(heading);

    // Age group select
    const groupWrap = el("div", "", { id: "leagueGroupWrap" });
    const groupLabel = el("label", "", { for: "leagueGroupSelect" });
    groupLabel.textContent = "Age Group:";

    const groupSelect = el("select", "", { id: "leagueGroupSelect" });
    Object.keys(LEAGUE_DATA).forEach(key => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = key;
        groupSelect.appendChild(opt);
    });
    // Default to U17
    groupSelect.value = "U17";

    groupWrap.appendChild(groupLabel);
    groupWrap.appendChild(groupSelect);
    panel.appendChild(groupWrap);

    // Tab bar
    const tabBar = el("div", "", { id: "leagueTabBar" });
    const TABS = [
        { id: "standings", label: "Standings" },
        { id: "topScorers", label: "Top Scorers" },
        { id: "recentResults", label: "Recent Results" },
    ];
    TABS.forEach(t => {
        const btn = el("button", `league-tab-btn${t.id === "standings" ? " active" : ""}`, { "data-tab": t.id });
        btn.textContent = t.label;
        tabBar.appendChild(btn);
    });
    panel.appendChild(tabBar);

    // Content area
    const dataContent = el("div", "", { id: "leagueDataContent" });
    panel.appendChild(dataContent);

    /* ── Wrap existing footer copyright in a divider div ── */
    const existingContent = Array.from(footer.childNodes);
    const divider = el("div", "", { id: "leagueFooterDivider" });
    existingContent.forEach(node => divider.appendChild(node));

    // Clear footer and rebuild
    footer.innerHTML = "";
    footer.style.textAlign = "left";
    footer.style.paddingTop = "3rem";
    footer.appendChild(panel);
    footer.appendChild(divider);

    /* ── Rendering functions ── */
    let activeTab = "standings";
    let activeGroup = "U17";

    function renderStandings(data) {
        const rows = data.standings
            .map((r, i) => `
        <tr class="${i === 0 ? "leader-row" : ""}">
          <td>${r.pos}</td>
          <td>${r.team}</td>
          <td>${r.p}</td>
          <td>${r.w}</td>
          <td>${r.d}</td>
          <td>${r.l}</td>
          <td>${r.gf}</td>
          <td>${r.ga}</td>
          <td>${r.gf - r.ga > 0 ? "+" : ""}${r.gf - r.ga}</td>
          <td class="pts-cell">${r.pts}</td>
        </tr>`)
            .join("");
        return `<div class="card p-0 overflow-hidden">
      <div class="table-responsive">
        <table class="league-data-table">
          <thead><tr>
            <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th>
            <th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
    }

    function renderTopScorers(data) {
        const rows = data.topScorers
            .map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${r.name}</strong></td>
          <td class="text-muted">${r.team}</td>
          <td class="pts-cell">${r.goals}</td>
        </tr>`)
            .join("");
        return `<div class="card p-0 overflow-hidden">
      <div class="table-responsive">
        <table class="league-data-table">
          <thead><tr><th>#</th><th>Player</th><th>Team</th><th>Goals</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
    }

    function renderRecentResults(data) {
        const rows = data.recentResults
            .map(r => `
        <tr>
          <td class="text-end fw-bold">${r.home}</td>
          <td class="text-center"><span class="result-badge">${r.score}</span></td>
          <td class="fw-bold">${r.away}</td>
        </tr>`)
            .join("");
        return `<div class="card p-0 overflow-hidden">
      <div class="table-responsive">
        <table class="league-data-table">
          <thead><tr>
            <th class="text-end">Home</th>
            <th class="text-center">Score</th>
            <th>Away</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
    }

    function render() {
        const data = LEAGUE_DATA[activeGroup];
        if (!data) return;

        // Re-trigger animation
        dataContent.style.animation = "none";
        void dataContent.offsetWidth; // force reflow
        dataContent.style.animation = "";

        if (activeTab === "standings") dataContent.innerHTML = renderStandings(data);
        if (activeTab === "topScorers") dataContent.innerHTML = renderTopScorers(data);
        if (activeTab === "recentResults") dataContent.innerHTML = renderRecentResults(data);
    }

    /* ── Event listeners ── */
    groupSelect.addEventListener("change", () => {
        activeGroup = groupSelect.value;
        render();
    });

    tabBar.addEventListener("click", e => {
        const btn = e.target.closest(".league-tab-btn");
        if (!btn) return;
        document.querySelectorAll(".league-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeTab = btn.dataset.tab;
        render();
    });

    // Initial render
    render();
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 6 – BOOTSTRAP SCROLLSPY RE-INIT (ensure Bootstrap's own spy is alive)
   ═══════════════════════════════════════════════════════════════════════════ */

function ensureBootstrapScrollSpy() {
    // Bootstrap's ScrollSpy is declared on <body> via data attributes.
    // After dynamic DOM changes we refresh it.
    if (typeof bootstrap !== "undefined" && bootstrap.ScrollSpy) {
        const spy = bootstrap.ScrollSpy.getInstance(document.body);
        if (spy) spy.refresh();
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 7 – ENTRY POINT
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    initSidebarScrollSpy();
    initHallOfFameCarousel();
    initTournamentSearch();
    initLeagueRecords();

    // Let Bootstrap finish its own ScrollSpy boot, then refresh
    setTimeout(ensureBootstrapScrollSpy, 300);
});
