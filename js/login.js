document.addEventListener('DOMContentLoaded', () => {
  const memberBtn = document.getElementById('memberLoginBtn');
  const adminBtn = document.getElementById('adminLoginBtn');

  function buildSession(role) {
    if (role === 'admin') {
      return {
        role: 'admin',
        displayName: 'Mary Phiri',
        academyName: 'Zambezi Futures HQ'
      };
    }

    return {
      role: 'member',
      displayName: 'Lillian Tembo',
      academyName: 'North Star Elite',
      academyId: 'academy_001'
    };
  }

  function simulateAuth(button, role, redirectPage) {
    const originalHtml = button.innerHTML;

    button.innerHTML = 'Authenticating...';
    button.style.pointerEvents = 'none';

    window.setTimeout(() => {
      const success = window.confirm(`Simulate ${role} login?\nOK = Success`);

      if (!success) {
        button.innerHTML = 'Auth Failed';
        button.style.backgroundColor = '#dc3545';
        button.style.color = '#fff';

        window.setTimeout(() => {
          button.innerHTML = originalHtml;
          button.removeAttribute('style');
        }, 1000);
        return;
      }

      const session = buildSession(role);
      localStorage.setItem('zfSession', JSON.stringify(session));
      localStorage.setItem('role', session.role);
      localStorage.setItem('academyName', session.academyName);

      button.innerHTML = `✔ ${role === 'admin' ? 'Admin' : 'Member'} Verified`;
      button.style.backgroundColor = '#198754';
      button.style.color = '#fff';

      window.setTimeout(() => {
        window.location.href = redirectPage;
      }, 700);
    }, 900);
  }

  if (memberBtn) {
    memberBtn.addEventListener('click', (event) => {
      event.preventDefault();
      simulateAuth(memberBtn, 'member', 'member-dashboard.html');
    });
  }

  if (adminBtn) {
    adminBtn.addEventListener('click', (event) => {
      event.preventDefault();
      simulateAuth(adminBtn, 'admin', 'admin-dashboard.html');
    });
  }
});
