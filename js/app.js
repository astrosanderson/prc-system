(function () {
  'use strict';

  const componentPaths = {
    navbar: '../components/navbar.html',
    footer: '../components/footer.html',
    disclaimer: '../components/disclaimer.html'
  };

  const routeAccess = {
    public: 'public',
    member: 'member',
    admin: 'admin'
  };

  document.addEventListener('DOMContentLoaded', initAppShell);

  async function initAppShell() {
    syncLegacyRole();
    enforcePageAccess();
    await Promise.all([
      loadComponent('navbarContainer', componentPaths.navbar),
      loadComponent('footerContainer', componentPaths.footer),
      loadComponent('disclaimerContainer', componentPaths.disclaimer)
    ]);
    setupNavbar();
    setupFooterContext();
  }

  async function loadComponent(containerId, url) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Component request failed');
      }

      container.innerHTML = await response.text();
    } catch (error) {
      console.error(`[app] Unable to load ${containerId}:`, error);
    }
  }

  function getSession() {
    const fallbackRole = localStorage.getItem('role');
    const fallbackAcademyName = localStorage.getItem('academyName');

    try {
      const rawSession = localStorage.getItem('zfSession');
      if (!rawSession) {
        return fallbackRole ? {
          role: fallbackRole,
          academyName: fallbackAcademyName || 'North Star Elite',
          displayName: fallbackRole === 'admin' ? 'Admin User' : 'Team Representative'
        } : null;
      }

      const parsedSession = JSON.parse(rawSession);
      if (!parsedSession || typeof parsedSession !== 'object') {
        return null;
      }

      return parsedSession;
    } catch (error) {
      console.warn('[app] Invalid zfSession payload:', error);
      return fallbackRole ? { role: fallbackRole } : null;
    }
  }

  function setSession(session) {
    if (!session) return;
    localStorage.setItem('zfSession', JSON.stringify(session));
    if (session.role) {
      localStorage.setItem('role', session.role);
    }
    if (session.academyName) {
      localStorage.setItem('academyName', session.academyName);
    }
  }

  function clearSession() {
    localStorage.removeItem('zfSession');
    localStorage.removeItem('role');
    localStorage.removeItem('academyName');
  }

  function syncLegacyRole() {
    const session = getSession();
    if (session) {
      setSession(session);
    }
  }

  function getCurrentPageKey() {
    const bodyPage = document.body.dataset.page;
    if (bodyPage) return mapPageKey(bodyPage);

    const fileName = window.location.pathname.split('/').pop() || 'home.html';
    return mapPageKey(fileName.replace('.html', ''));
  }

  function getRequiredAccess() {
    return document.body.dataset.access || routeAccess.public;
  }

  function enforcePageAccess() {
    const requiredAccess = getRequiredAccess();
    if (requiredAccess === routeAccess.public) return;

    const session = getSession();
    if (!session || !session.role) {
      window.location.replace('login.html');
      return;
    }

    if (requiredAccess === routeAccess.admin && session.role !== 'admin') {
      window.location.replace('database.html');
    }
  }

  function setupNavbar() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    const session = getSession();
    const currentPage = getCurrentPageKey();
    const navItems = buildNavItems(session);

    navLinks.innerHTML = navItems.map((item) => {
      if (item.type === 'button') {
        return `
          <li class="nav-item">
            <button type="button" class="btn btn-sm zf-nav-action" data-action="${item.action}">${item.label}</button>
          </li>
        `;
      }

      const activeClass = item.pageKey === currentPage ? ' active' : '';
      const badgeHtml = item.badge ? `<span class="zf-role-pill">${item.badge}</span>` : '';

      return `
        <li class="nav-item">
          <a class="nav-link${activeClass}" href="${item.href}">${item.label}${badgeHtml}</a>
        </li>
      `;
    }).join('');

    navLinks.querySelectorAll('[data-action="logout"]').forEach((button) => {
      button.addEventListener('click', () => {
        clearSession();
        window.location.href = 'login.html';
      });
    });
  }

  function buildNavItems(session) {
    if (!session || !session.role) {
      return [
        { href: 'home.html', label: 'Home', pageKey: 'home' },
        { href: 'register.html', label: 'Register', pageKey: 'register' },
        { href: 'login.html', label: 'Login', pageKey: 'login' }
      ];
    }

    if (session.role === 'admin') {
      return [
        { href: 'home.html', label: 'Home', pageKey: 'home' },
        { href: 'admin-dashboard.html', label: 'Admin Dashboard', pageKey: 'admin-dashboard', badge: 'Admin' },
        { href: 'database.html', label: 'Academies', pageKey: 'database' },
        { href: 'academies.html', label: 'Players', pageKey: 'academies' },
        { href: 'player-registration.html', label: 'Register Player', pageKey: 'player-registration' },
        { href: 'archives.html', label: 'Archives', pageKey: 'archives' },
        { type: 'button', label: 'Logout', action: 'logout' }
      ];
    }

    return [
      { href: 'home.html', label: 'Home', pageKey: 'home' },
      { href: 'database.html', label: 'Academies', pageKey: 'database' },
      { href: 'academies.html', label: 'Players', pageKey: 'academies' },
      { href: 'player-registration.html', label: 'Add Player', pageKey: 'player-registration', badge: 'Member' },
      { href: 'archives.html', label: 'Archives', pageKey: 'archives' },
      { type: 'button', label: 'Logout', action: 'logout' }
    ];
  }

  function setupFooterContext() {
    const footer = document.querySelector('.zf-footer');
    if (!footer) return;

    const session = getSession();
    const copy = footer.querySelector('.zf-footer-copy');
    if (!copy) return;

    if (session?.role === 'admin') {
      copy.textContent = 'Admin workspace for managing academies, representatives, players, divisions, and historical records.';
      return;
    }

    if (session?.role === 'member') {
      copy.textContent = `Member workspace for ${session.academyName || 'your academy'} to register and manage players.`;
    }
  }

  function mapPageKey(pageKey) {
    const aliases = {
      'player-profile': 'academies',
      'member-registration': 'register',
      'admin-registration': 'register'
    };

    return aliases[pageKey] || pageKey;
  }

  window.zfApp = {
    getSession,
    setSession,
    clearSession,
    getCurrentPageKey
  };
})();
