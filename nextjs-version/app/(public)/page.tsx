import Link from 'next/link';
import { ACADEMIES, STATS } from '@/lib/mockData';

/* Academy carousel card */
function AcademyCard({ name, location }: { name: string; location: string }) {
  return (
    <div className="academy-card card border shadow-sm p-3">
      <div
        className="d-flex align-items-center justify-content-center mb-2 rounded"
        style={{ height: 56, background: 'rgba(27, 58, 45,0.06)' }}
      >
        <span className="material-symbols-outlined text-mid-green" style={{ fontSize: '2rem' }}>
          sports_soccer
        </span>
      </div>
      <p className="fw-black text-dark-green mb-0 small text-uppercase">{name}</p>
      <p className="text-muted fs-9 mb-0">{location}</p>
    </div>
  );
}

export default function HomePage() {
  /* Duplicate the list for seamless infinite scroll */
  const carouselItems = [...ACADEMIES, ...ACADEMIES];

  return (
    <>
      {/* ── Hero ── */}
      <header className="homepage-hero">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="hero-title text-white fw-900 mb-4">
                Welcome to<br />
                <span style={{ color: 'var(--gold)' }}>Zambezi Futures</span><br />
                Registration Hub
              </h1>
              <p
                className="lead text-white mb-5 fw-medium"
                style={{ maxWidth: 540, opacity: 0.75 }}
              >
                The elite digital archive and training ground for Southern Africa&apos;s
                premier football talent.
              </p>
              <Link
                href="/login"
                className="btn btn-outline-light btn-lg px-5 py-3 fw-bold"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Stat cards (overlap hero) ── */}
      <section className="pb-5">
        <div className="container">
          <div className="row g-4 stat-card-row">
            <div className="col-md-4">
              <div className="card text-center py-5">
                <h2 className="display-4 fw-bold">{STATS.activeAcademies}+</h2>
                <p className="text-muted mb-0">Total Academies</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center py-5">
                <h2 className="display-4 fw-bold">{STATS.totalPlayers.toLocaleString()}+</h2>
                <p className="text-muted mb-0">Registered Players</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center py-5">
                <h2 className="display-4 fw-bold">{STATS.activeTeams}+</h2>
                <p className="text-muted mb-0">Active Teams</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Academy carousel ── */}
      <section className="py-5">
        <div className="container my-4">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <h3 className="display-6 fw-bold">Elite Academies</h3>
          </div>
          <div className="academy-carousel-wrapper">
            <div className="academy-carousel-track">
              {carouselItems.map((academy, i) => (
                <AcademyCard
                  key={`${academy.id}-${i}`}
                  name={academy.name}
                  location={academy.location}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
