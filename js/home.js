document.addEventListener("DOMContentLoaded", async () => {
    const fallbackLogo = `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
            <rect width="160" height="160" rx="28" fill="#0b3d2e"/>
            <circle cx="80" cy="80" r="54" fill="#c8a95b" opacity="0.18"/>
            <text x="80" y="92" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="42" font-weight="800" fill="#c8a95b">ZF</text>
        </svg>
    `)}`;

    // =========================
    // SAFE FETCH FUNCTION
    // =========================
    const safeFetchJSON = async (url) => {
        try {
            const res = await fetch(url);
            if (!res.ok) return [];
            const text = await res.text();
            return text ? JSON.parse(text) : [];
        } catch {
            return [];
        }
    };

    // =========================
    // FETCH DATA
    // =========================
    const academies = await safeFetchJSON('../data/academies.json');
    const players = await safeFetchJSON('../data/players.json');

    // =========================
    // UPDATE STATS
    // =========================
    const roundUp = (num) => Math.ceil(num / 10) * 10;

    if (academies.length > 0) {
        document.getElementById("totalAcademies").textContent = roundUp(academies.length);
        document.getElementById("totalTeams").textContent = roundUp(
            academies.reduce((sum, a) => sum + (a.teams?.length || 1), 0)
        );
    }

    if (players.length > 0) {
        document.getElementById("totalPlayers").textContent = roundUp(players.length);
    }

    // =========================
    // LOAD ACADEMIES
    // =========================
    const container = document.getElementById("academiesContainer");

    if (academies.length > 0 && container) {

        const cardsHTML = academies.map(a => {
            const logo = isUsableImage(a.logo) ? a.logo : fallbackLogo;
            return `
            <div class="academy-card">
                <div class="card text-center p-4 h-100">
                    <div class="p-3 rounded mb-3" style="background: var(--light-bg);">
                        <img src="${logo}" class="academy-logo" alt="${escapeAttr(a.name || 'Academy logo')}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackLogo}';">
                    </div>
                    <h5>${escapeHtml(a.name || 'Academy')}</h5>
                    <p class="text-muted small">${escapeHtml(a.location || '')}</p>
                </div>
            </div>
        `;
        }).join('');

        // Duplicate content for seamless loop
        container.innerHTML = cardsHTML + cardsHTML + cardsHTML;
    }

    function isUsableImage(url) {
        return typeof url === 'string' && /^https?:\/\//i.test(url.trim());
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, '&#096;');
    }

});
