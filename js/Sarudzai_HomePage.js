document.addEventListener("DOMContentLoaded", async () => {
    // 1. Button interactivity
    const signInBtn = document.querySelector('a[href="signin.html"]');
    if (signInBtn) {
        signInBtn.href = "Boldwin_signin.html";
        signInBtn.addEventListener('click', (e) => {
            // Allow default navigation to the new page
        });
    }

    const signUpBtn = document.querySelector('a[href="signup.html"]');
    if (signUpBtn) {
        signUpBtn.href = "Boldwin_signup.html";
    }

    let academiesList = [];
    let playersList = [];

    // Helper: Safely fetch JSON even if file is empty or missing
    const safeFetchJSON = async (url) => {
        try {
            const res = await fetch(url);
            if (!res.ok) return [];
            const text = await res.text();
            if (!text.trim()) return [];
            return JSON.parse(text) || [];
        } catch (err) {
            console.error(`Error loading ${url}:`, err);
            return [];
        }
    };

    academiesList = await safeFetchJSON('../data/academies.json');
    playersList = await safeFetchJSON('../data/players.json');

    // 2. Reflect total number in the database as a multiple of 10
    const toMultipleOf10 = (num) => Math.ceil(num / 10) * 10;
    
    // Only apply database counts if data actually exists, otherwise fallback to visually static placeholders
    let totalAcademiesCount = academiesList.length;
    let activeTeamsCount = academiesList.reduce((acc, curr) => acc + (curr.teams ? curr.teams.length : 1), 0);
    let registeredPlayersCount = playersList.length;

    const statCards = document.querySelectorAll('.stat-card-row h2');
    if (statCards.length >= 3) {
        if (totalAcademiesCount > 0) {
            statCards[0].textContent = toMultipleOf10(totalAcademiesCount);
            statCards[2].textContent = toMultipleOf10(activeTeamsCount);
        }
        if (registeredPlayersCount > 0) {
            statCards[1].textContent = toMultipleOf10(registeredPlayersCount);
        }
    }

    // 3. Live slideshow from left to right of all teams/academies in the system
    const eliteTitle = Array.from(document.querySelectorAll('.display-6')).find(h => h.textContent.includes('Elite Academies'));
    
    if (eliteTitle) {
        const eliteSection = eliteTitle.closest('.container');
        const academiesRow = eliteSection.querySelector('.row.g-4');
        
        if (academiesRow) {
            // Build a container and logic for the seamless slideshow
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.width = '100%';
            wrapper.style.position = 'relative';
            wrapper.style.padding = '1rem 0';
            
            // If data is fetched, inject it, else use existing HTML
            if (academiesList.length > 0) {
                let generatedHtml = '';
                academiesList.forEach(academy => {
                    const logoUrl = academy.logo || "https://lh3.googleusercontent.com/aida-public/AB6AXuDwaX6hqBK03pjbjAijqLgYnlEGTJhb7xKVLmJjAtZ0PVW1dWjbgAomTarzOsB5mM-4Kn3YpLcKlulVjG569BmuKE-lnpQZon7LqXefpZTIJWr6dqYEMtJmgbUW2PKnzr9g2fsUQTSQDxowCBNzbra33xybVwHeXdIeUvRllmol0H_La8vuhmdQ0pRNomBidGtfA-A6b6RC22rEJA5VlPMuJlobBF6ofMZCjRi-iXNaKkulVjRU25CjcrN3YHD-CVj599VPoUYzyiMx"; 
                    generatedHtml += `
                        <div class="slideshow-card" style="width: 250px; flex-shrink: 0;">
                            <a href="academy.html" class="text-decoration-none">
                                <div class="card text-center p-4 h-100">
                                    <div class="p-3 rounded mb-3" style="background:var(--bg-color);">
                                        <img src="${logoUrl}" alt="Academy Logo" class="academy-logo" style="height: 56px; object-fit: contain;">
                                    </div>
                                    <h4 class="h6 fw-black mb-1" style="color:var(--primary-color);">${academy.name}</h4>
                                    <p class="small text-muted mb-0">${academy.location || 'Local District'}</p>
                                </div>
                            </a>
                        </div>
                    `;
                });
                academiesRow.innerHTML = generatedHtml;
            } else {
                // Strip Bootstrap grid classes and format correctly for flex-row scrolling
                Array.from(academiesRow.children).forEach(col => {
                    col.className = 'slideshow-card';
                    col.style.width = '250px';
                    col.style.flexShrink = '0';
                    const cardCard = col.querySelector('.card');
                    if (cardCard) cardCard.classList.add('h-100');
                });
            }

            const trackHTML = academiesRow.innerHTML;
            
            // Setting up the scrolling track
            academiesRow.className = "academy-marquee-track";
            academiesRow.style.display = "flex";
            academiesRow.style.alignItems = "stretch";
            academiesRow.style.gap = "1.5rem";
            academiesRow.style.width = "max-content"; 
            
            // Duplicating the content to create a visual loop
            academiesRow.innerHTML = trackHTML + trackHTML + trackHTML + trackHTML; 

            academiesRow.parentNode.insertBefore(wrapper, academiesRow);
            wrapper.appendChild(academiesRow);

            // Inject the CSS required for the left-to-right scrolling animation
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes marqueeRight {
                    0% { transform: translateX(calc(-50% - 0.75rem)); }
                    100% { transform: translateX(0); }
                }
                .academy-marquee-track {
                    /* moving left-to-right -> backwards in translateX */
                    animation: marqueeRight 40s linear infinite;
                }
                .academy-marquee-track:hover {
                    animation-play-state: paused;
                }
                .slideshow-card {
                    transition: transform 0.3s ease;
                }
                .slideshow-card:hover {
                    transform: translateY(-5px);
                }
            `;
            document.head.appendChild(style);
        }
    }
});
