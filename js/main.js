/* ========================================
   THE STADIUM - Main JavaScript
   Interactive features, animations, and form logic
   ======================================== */

import './style.css';

// ============================================================
// UTILITY: Wait for DOM
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCounterAnimations();
    initMobileMenu();
    initModal();
    initRegistrationForm();
    initAcademyCardTilt();
    initNavScroll();
    initHeroFadeIn();
});

// ============================================================
// HERO: Fade-in on load
// ============================================================
function initHeroFadeIn() {
    const heroContent = document.querySelector('#hero .fade-up');
    if (heroContent) {
        // Small delay for a cinematic entrance
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 200);
    }
}

// ============================================================
// NAVBAR: Shrink on scroll
// ============================================================
function initNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    const onScroll = () => {
        if (window.scrollY > 60) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
}

// ============================================================
// SCROLL ANIMATIONS: Intersection Observer
// ============================================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Stagger children if stat cards
                if (entry.target.classList.contains('stat-card') || 
                    entry.target.classList.contains('tournament-card')) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe stat cards with staggered delay
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 150}ms`;
        observer.observe(card);
    });

    // Observe tournament cards with staggered delay
    const tournamentCards = document.querySelectorAll('.tournament-card');
    tournamentCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 150}ms`;
        observer.observe(card);
    });

    // Observe fade-up elements (except hero, handled separately)
    const fadeEls = document.querySelectorAll('.fade-up:not(#hero .fade-up)');
    fadeEls.forEach((el) => observer.observe(el));
}

// ============================================================
// COUNTER ANIMATION: Animated number counting
// ============================================================
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach((counter) => counterObserver.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // ms
    const startTime = performance.now();

    // Easing function: ease-out cubic
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = Math.round(easedProgress * target);

        el.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ============================================================
// MOBILE MENU: Toggle
// ============================================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!menuBtn || !menu) return;

    const icon = menuBtn.querySelector('.material-symbols-outlined');

    menuBtn.addEventListener('click', () => {
        const isOpen = menu.classList.contains('open');
        if (isOpen) {
            menu.classList.remove('open');
            icon.textContent = 'menu';
            menuBtn.setAttribute('aria-label', 'Open menu');
        } else {
            menu.classList.remove('hidden');
            // Force reflow for transition
            void menu.offsetHeight;
            menu.classList.add('open');
            icon.textContent = 'close';
            menuBtn.setAttribute('aria-label', 'Close menu');
        }
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            icon.textContent = 'menu';
        });
    });
}

// ============================================================
// MODAL: Registration Modal
// ============================================================
let currentStep = 1;
const totalSteps = 3;

function initModal() {
    const modal = document.getElementById('register-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const content = document.getElementById('modal-content');
    const closeBtn = document.getElementById('modal-close');
    if (!modal) return;

    // Open triggers
    const openTriggers = [
        document.getElementById('hero-register-btn'),
        ...document.querySelectorAll('[data-modal="register"]')
    ].filter(Boolean);

    openTriggers.forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Close triggers
    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);

    // Escape key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Prevent content click from closing
    content?.addEventListener('click', (e) => e.stopPropagation());
}

function openModal() {
    const modal = document.getElementById('register-modal');
    const content = document.getElementById('modal-content');
    const backdrop = document.getElementById('modal-backdrop');
    if (!modal) return;

    // Reset form state
    resetForm();

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Re-trigger animations
    content.classList.remove('modal-exit', 'modal-enter');
    backdrop.classList.remove('modal-backdrop-exit', 'modal-backdrop-enter');
    void content.offsetHeight;
    content.classList.add('modal-enter');
    backdrop.classList.add('modal-backdrop-enter');
}

function closeModal() {
    const modal = document.getElementById('register-modal');
    const content = document.getElementById('modal-content');
    const backdrop = document.getElementById('modal-backdrop');
    if (!modal) return;

    content.classList.remove('modal-enter');
    backdrop.classList.remove('modal-backdrop-enter');
    content.classList.add('modal-exit');
    backdrop.classList.add('modal-backdrop-exit');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        content.classList.remove('modal-exit');
        backdrop.classList.remove('modal-backdrop-exit');
    }, 250);
}

// ============================================================
// REGISTRATION FORM: Multi-step logic
// ============================================================
function initRegistrationForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    // Next buttons
    form.querySelectorAll('.next-step').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                goToStep(currentStep + 1);
            }
        });
    });

    // Previous buttons
    form.querySelectorAll('.prev-step').forEach((btn) => {
        btn.addEventListener('click', () => {
            goToStep(currentStep - 1);
        });
    });

    // Form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateCurrentStep()) {
            showSuccess();
        }
    });

    // Close success
    document.getElementById('close-success')?.addEventListener('click', () => {
        closeModal();
    });
}

function goToStep(step) {
    if (step < 1 || step > totalSteps) return;

    // If going to confirmation, populate review
    if (step === 3) {
        populateReview();
    }

    // Update step indicators
    const indicators = document.querySelectorAll('.step-indicator');
    const lines = document.querySelectorAll('.step-line');

    indicators.forEach((ind) => {
        const s = parseInt(ind.getAttribute('data-step'), 10);
        ind.classList.remove('active', 'completed');
        if (s === step) {
            ind.classList.add('active');
        } else if (s < step) {
            ind.classList.add('completed');
        }
    });

    lines.forEach((line) => {
        const lineIdx = parseInt(line.getAttribute('data-line'), 10);
        if (lineIdx < step) {
            line.classList.add('filled');
        } else {
            line.classList.remove('filled');
        }
    });

    // Switch form steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((s) => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });

    const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
    if (targetStep) {
        targetStep.classList.remove('hidden');
        // Force reflow to re-trigger animation
        void targetStep.offsetHeight;
        targetStep.classList.add('active');
    }

    currentStep = step;

    // Scroll modal to top
    document.getElementById('modal-content')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentStep() {
    const stepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!stepEl) return true;

    let isValid = true;

    // Clear previous errors
    stepEl.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
    stepEl.querySelectorAll('.error-msg').forEach((el) => el.classList.add('hidden'));

    if (currentStep === 1) {
        const fields = [
            { id: 'first-name', type: 'text' },
            { id: 'last-name', type: 'text' },
            { id: 'dob', type: 'date' },
            { id: 'gender', type: 'select' },
            { id: 'guardian-email', type: 'email' },
            { id: 'guardian-phone', type: 'text' }
        ];

        fields.forEach((field) => {
            const el = document.getElementById(field.id);
            if (!el) return;

            let valid = true;
            if (field.type === 'email') {
                valid = el.value.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
            } else if (field.type === 'select') {
                valid = el.value !== '';
            } else {
                valid = el.value.trim() !== '';
            }

            if (!valid) {
                el.classList.add('error');
                const errorMsg = el.closest('.form-group')?.querySelector('.error-msg');
                if (errorMsg) errorMsg.classList.remove('hidden');
                isValid = false;
            }
        });
    } else if (currentStep === 2) {
        const fields = [
            { id: 'academy', type: 'select' },
            { id: 'age-group', type: 'select' }
        ];

        fields.forEach((field) => {
            const el = document.getElementById(field.id);
            if (!el) return;
            if (el.value === '') {
                el.classList.add('error');
                const errorMsg = el.closest('.form-group')?.querySelector('.error-msg');
                if (errorMsg) errorMsg.classList.remove('hidden');
                isValid = false;
            }
        });
    } else if (currentStep === 3) {
        const checkbox = document.getElementById('terms-agree');
        if (checkbox && !checkbox.checked) {
            const errorMsg = checkbox.closest('.bg-surface-container-low')?.querySelector('.error-msg');
            if (errorMsg) errorMsg.classList.remove('hidden');
            isValid = false;
        }
    }

    return isValid;
}

function populateReview() {
    const summary = document.getElementById('review-summary');
    if (!summary) return;

    const getValue = (id) => {
        const el = document.getElementById(id);
        if (!el) return '—';
        if (el.tagName === 'SELECT') {
            return el.options[el.selectedIndex]?.text || '—';
        }
        return el.value || '—';
    };

    const items = [
        { label: 'Full Name', value: `${getValue('first-name')} ${getValue('last-name')}` },
        { label: 'Date of Birth', value: getValue('dob') },
        { label: 'Gender', value: getValue('gender') },
        { label: 'Guardian Email', value: getValue('guardian-email') },
        { label: 'Guardian Phone', value: getValue('guardian-phone') },
        { label: 'Academy', value: getValue('academy') },
        { label: 'Age Group', value: getValue('age-group') },
        { label: 'Position', value: getValue('position') },
        { label: 'Dominant Foot', value: getValue('dominant-foot') },
    ];

    summary.innerHTML = items.map((item) => `
        <div class="review-item">
            <span class="review-label">${item.label}</span>
            <span class="review-value">${item.value}</span>
        </div>
    `).join('');

    // Medical notes (if any)
    const notes = getValue('medical-notes');
    if (notes && notes !== '—') {
        summary.innerHTML += `
            <div class="review-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                <span class="review-label">Medical Notes</span>
                <span class="review-value" style="font-size: 0.85rem;">${notes}</span>
            </div>
        `;
    }
}

function showSuccess() {
    const form = document.getElementById('register-form');
    const steps = form.querySelectorAll('.form-step');
    const success = document.getElementById('form-success');

    steps.forEach((s) => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });

    success.classList.remove('hidden');

    // Hide step indicators visually
    document.querySelectorAll('.step-indicator, .step-line').forEach((el) => {
        el.style.opacity = '0.3';
    });
}

function resetForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.reset();
    currentStep = 1;

    // Reset steps
    form.querySelectorAll('.form-step').forEach((s) => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });

    const firstStep = form.querySelector('.form-step[data-step="1"]');
    if (firstStep) {
        firstStep.classList.remove('hidden');
        firstStep.classList.add('active');
    }

    // Reset success state
    const success = document.getElementById('form-success');
    if (success) success.classList.add('hidden');

    // Reset errors
    form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
    form.querySelectorAll('.error-msg').forEach((el) => el.classList.add('hidden'));

    // Reset step indicators
    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach((ind) => {
        const s = parseInt(ind.getAttribute('data-step'), 10);
        ind.classList.remove('active', 'completed');
        if (s === 1) ind.classList.add('active');
    });

    document.querySelectorAll('.step-line').forEach((line) => {
        line.classList.remove('filled');
    });

    // Reset indicator opacity
    document.querySelectorAll('.step-indicator, .step-line').forEach((el) => {
        el.style.opacity = '';
    });
}

// ============================================================
// ACADEMY CARDS: 3D Tilt on hover
// ============================================================
function initAcademyCardTilt() {
    const cards = document.querySelectorAll('.academy-card');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}
