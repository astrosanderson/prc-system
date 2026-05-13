import Link from 'next/link';
import { BadgeGold } from '@/components/ui';

function RegisterCard({
  href,
  iconName,
  iconStyle,
  title,
  description,
}: {
  href: string;
  iconName: string;
  iconStyle: React.CSSProperties;
  title: string;
  description: string;
}) {
  return (
    <div className="col-md-6">
      <Link href={href} className="text-decoration-none">
        <div className="card p-5 text-center h-100 border-0 shadow-sm hover-lift">
          <div
            className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle"
            style={{ width: 72, height: 72, ...iconStyle }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '2.2rem' }}>
              {iconName}
            </span>
          </div>
          <h3 className="fw-900 text-dark-green text-uppercase mb-2">{title}</h3>
          <p className="text-muted small mb-0">{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <BadgeGold>Official Portal</BadgeGold>
            <h1 className="editorial-header display-4 fw-900 text-dark-green mt-3">
              Create <span className="text-warm-muted">Account</span>
            </h1>
            <p className="text-muted fw-bold mt-3">
              Select your account type to get started.
            </p>
          </div>

          <div className="row g-4">
            <RegisterCard
              href="/register/member"
              iconName="groups"
              iconStyle={{ background: 'rgba(27, 58, 45,0.08)', color: 'var(--primary-color)' }}
              title="Member"
              description="Academy representative, coach, or manager. Register and manage your academy's players."
            />
            <RegisterCard
              href="/register/admin"
              iconName="admin_panel_settings"
              iconStyle={{ background: 'var(--primary-color)', color: 'var(--accent-color)' }}
              title="Admin"
              description="League official or PRC administrator. Requires an admin access code to complete registration."
            />
          </div>

          <p className="text-center text-muted small mt-5">
            Already have an account?{' '}
            <Link href="/login" className="fw-bold" style={{ color: 'var(--accent-color)' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
