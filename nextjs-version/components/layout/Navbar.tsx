'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import type { Session } from '@/lib/types';

interface NavItem {
  label: string;
  href: string;
  exact?: boolean;
}

function buildNavItems(session: Session | null): NavItem[] {
  if (!session) {
    return [
      { label: 'Home', href: '/', exact: true },
    ];
  }
  if (session.role === 'admin') {
    return [
      { label: 'Dashboard',      href: '/admin/dashboard', exact: true },
      { label: 'Academies',      href: '/academies' },
      { label: 'All Players',    href: '/players' },
      { label: 'Management',     href: '/admin/management' },
      { label: 'Past Games',     href: '/archives' },
      { label: 'Live Match',     href: '/admin/live' },
      { label: 'Historical Hub', href: '/historical' },
    ];
  }
  return [
    { label: 'Dashboard',      href: '/dashboard',    exact: true },
    { label: 'My Players',     href: '/academies/my', exact: true },
    { label: 'Academies',      href: '/academies' },
    { label: 'Past Games',     href: '/archives' },
    { label: 'Historical Hub', href: '/historical' },
  ];
}

function getBrandHref(session: Session | null): string {
  if (session?.role === 'admin') return '/admin/dashboard';
  if (session?.role === 'member') return '/dashboard';
  return '/';
}

function isNavActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  /* The /academies/my route has its own dedicated nav item (My Players),
     so the broader /academies item must not absorb it. */
  if (href === '/academies' && pathname.startsWith('/academies/my')) return false;
  return pathname === href || pathname.startsWith(href + '/');
}

export function Navbar() {
  const { session, clearSession } = useSession();
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  const navItems = buildNavItems(session);

  function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    clearSession();
    router.push('/login');
    setOpen(false);
  }

  const isPublic = !session;

  return (
    <nav className="zf-navbar">
      <div className="container-xxl d-flex align-items-center justify-content-between py-2">

        {/* Brand */}
        <Link
          href={getBrandHref(session)}
          className="d-flex align-items-center gap-2 text-decoration-none flex-shrink-0"
        >
          <span className="zf-brand-mark">ZF</span>
          <span className="zf-brand-text d-none d-sm-inline">ZAMBEZI FUTURES</span>
        </Link>

        {/* Desktop nav — centered when logged in, right-aligned for public */}
        <ul className={`d-none d-lg-flex align-items-center gap-1 list-unstyled mb-0 ${
          isPublic ? 'ms-auto' : 'mx-3 flex-grow-1 justify-content-center'
        }`}>
          {navItems.map((item) => {
            const active = isNavActive(pathname, item.href, item.exact);
            return (
              <li key={item.href}>
                <Link href={item.href} className={`zf-nav-link${active ? ' active' : ''}`}>
                  {item.label}
                </Link>
              </li>
            );
          })}
          {/* Public Sign In button — subtle, right-aligned */}
          {isPublic && (
            <li className="ms-2">
              <Link href="/login" className="btn btn-outline-light btn-sm fw-bold px-3 rounded-1" style={{ fontSize: '0.8rem' }}>
                Sign In
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop: user info + logout (logged in only) */}
        {session && (
          <div className="d-none d-lg-flex align-items-center gap-2 flex-shrink-0 border-start border-white border-opacity-25 ps-3">
            <span className="material-symbols-outlined text-white opacity-60" style={{ fontSize: '1.3rem' }}>
              account_circle
            </span>
            <div style={{ lineHeight: 1.2 }}>
              <div className="text-white fw-bold" style={{ fontSize: '0.8rem' }}>{session.displayName}</div>
              <div className="text-white opacity-50" style={{ fontSize: '0.68rem' }}>
                {session.academyName || 'PRC Administration'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="border-0 bg-transparent ms-1 p-1 d-flex align-items-center"
              title="Sign out"
              style={{ color: 'rgba(255,255,255,0.55)', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>logout</span>
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          className="d-lg-none bg-transparent border-0 p-2 d-flex flex-column justify-content-center gap-1"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          style={{ width: 40, height: 40 }}
        >
          <span className="hamburger-line" style={open ? { transform: 'rotate(45deg) translate(4px, 4px)' } : undefined} />
          <span className="hamburger-line" style={open ? { opacity: 0 } : undefined} />
          <span className="hamburger-line" style={open ? { transform: 'rotate(-45deg) translate(4px, -4px)' } : undefined} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="d-lg-none border-top border-white border-opacity-10 px-3 pb-3">
          {session && (
            <div className="d-flex align-items-center gap-2 py-3 border-bottom border-white border-opacity-10 mb-2">
              <span className="material-symbols-outlined text-white opacity-60" style={{ fontSize: '1.2rem' }}>account_circle</span>
              <div>
                <div className="text-white fw-bold" style={{ fontSize: '0.85rem' }}>{session.displayName}</div>
                <div className="text-white opacity-50" style={{ fontSize: '0.72rem' }}>
                  {session.academyName || 'PRC Administration'}
                </div>
              </div>
            </div>
          )}
          <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
            {navItems.map((item) => {
              const active = isNavActive(pathname, item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`zf-nav-link d-block${active ? ' active' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            {isPublic && (
              <li>
                <Link href="/login" className="zf-nav-link d-block" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
              </li>
            )}
            {session && (
              <li className="mt-2 pt-2 border-top border-white border-opacity-10">
                <button onClick={handleLogout} className="zf-nav-link d-block w-100 text-start border-0 bg-transparent">
                  <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1rem' }}>logout</span>
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
