import type { RegistrationWindow } from '@/lib/types';

interface DashboardHeroProps {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle?: string;
  subtitleLabel?: string;
  /** Right-side status block content */
  statusLabel: string;
  statusSublabel?: string;
  /** Optional: render registration-window dates + days-remaining countdown */
  registrationWindow?: RegistrationWindow | null;
}

function fmtDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysBetween(today: Date, iso: string): number {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return 0;
  const ms = target.setHours(0, 0, 0, 0) - new Date(today).setHours(0, 0, 0, 0);
  return Math.ceil(ms / 86_400_000);
}

/**
 * Reusable hero header for both member and admin dashboards.
 * When `registrationWindow` is provided, shows opening/closing dates and a live countdown.
 */
export function DashboardHero({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  subtitleLabel,
  statusLabel,
  statusSublabel,
  registrationWindow,
}: DashboardHeroProps) {
  const today      = new Date();
  const hasWindow  = !!registrationWindow && !!registrationWindow.openDate && !!registrationWindow.closeDate;
  const open       = hasWindow ? new Date(registrationWindow.openDate)  : null;
  const close      = hasWindow ? new Date(registrationWindow.closeDate) : null;
  const isActive   = hasWindow && registrationWindow.isOpen && open && close && today >= open && today <= close;
  const daysLeft   = hasWindow && close ? daysBetween(today, registrationWindow.closeDate) : 0;
  const daysToOpen = hasWindow && open  ? daysBetween(today, registrationWindow.openDate)  : 0;

  return (
    <header className="row align-items-end mb-5 g-4 hero-section">
      <div className="col-md-8">
        <span
          className="fw-bold text-uppercase fs-7 tracking-widest mb-1 d-block"
          style={{ color: 'var(--color-gold)', letterSpacing: '0.12em' }}
        >
          {eyebrow}
        </span>
        <h1 className="editorial-header display-3 fw-900 text-dark-green mb-0">
          {title} <span className="text-warm-muted">{titleAccent}</span>
        </h1>
        {subtitle && (
          <h2 className="h3 fw-900 text-mid-green mt-3 mb-1">{subtitle}</h2>
        )}
        {subtitleLabel && (
          <p className="text-muted fw-bold mb-0">{subtitleLabel}</p>
        )}
      </div>

      <div className="col-md-4 text-md-end">
        {/* Registration window block — renders dates + countdown if provided */}
        {registrationWindow ? (
          <div
            className="d-inline-block text-start shadow-sm"
            style={{
              background: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 12,
              padding: '0.85rem 1rem',
              minWidth: 240,
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <span
                className="status-dot animate-pulse-zf"
                style={{ backgroundColor: isActive ? 'var(--color-mid-green)' : 'var(--color-muted)' }}
              />
              <span className="fw-bold fs-8 text-uppercase" style={{ letterSpacing: '0.06em' }}>
                {statusLabel}
              </span>
            </div>
            {hasWindow ? (
              <>
                <div className="fs-9 fw-bold text-warm-muted text-uppercase mb-1" style={{ letterSpacing: '0.06em' }}>
                  Window
                </div>
                <div className="fw-bold text-dark-green" style={{ fontSize: '0.88rem' }}>
                  Open: {fmtDate(registrationWindow.openDate)}
                </div>
                <div className="fw-bold text-dark-green" style={{ fontSize: '0.88rem' }}>
                  Closes: {fmtDate(registrationWindow.closeDate)}
                </div>
                <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                  {isActive && daysLeft > 0 && (
                    <div className="fw-900" style={{ color: 'var(--color-gold)', fontSize: '0.95rem' }}>
                      {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
                    </div>
                  )}
                  {!isActive && daysToOpen > 0 && (
                    <div className="fw-900 text-warm-muted" style={{ fontSize: '0.85rem' }}>
                      Opens in {daysToOpen} {daysToOpen === 1 ? 'day' : 'days'}
                    </div>
                  )}
                  {!isActive && daysToOpen <= 0 && daysLeft <= 0 && (
                    <div className="fw-bold text-warm-muted fs-9">No active registration window</div>
                  )}
                </div>
              </>
            ) : (
              <div className="fw-bold text-warm-muted fs-8">No active registration window</div>
            )}
          </div>
        ) : (
          <div className="d-inline-flex bg-light p-3 gap-3 align-items-center shadow-sm" style={{ borderRadius: 12 }}>
            <div>
              <span className="fw-bold fs-7 d-block">{statusLabel}</span>
              {statusSublabel && (
                <span className="small text-muted fw-bold">{statusSublabel}</span>
              )}
            </div>
            <span className="status-dot animate-pulse-zf" style={{ backgroundColor: 'var(--color-mid-green)' }} />
          </div>
        )}
      </div>
    </header>
  );
}
