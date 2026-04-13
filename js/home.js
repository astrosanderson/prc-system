document.addEventListener("DOMContentLoaded", async () => {

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

        const cardsHTML = academies.map(a => `
            <div class="academy-card">
                <div class="card text-center p-4 h-100">
                    <div class="p-3 rounded mb-3" style="background: var(--light-bg);">
                        <img src="${a.logo || ''}" class="academy-logo">
                    </div>
                    <h5>${a.name}</h5>
                    <p class="text-muted small">${a.location || ''}</p>
                </div>
            </div>
        `).join('');

        // Duplicate content for seamless loop
        container.innerHTML = cardsHTML + cardsHTML + cardsHTML;
    }

});
