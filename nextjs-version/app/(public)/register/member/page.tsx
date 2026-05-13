import Link from 'next/link';
import { BadgeGold } from '@/components/ui';

export default function MemberRegisterPage() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-3 mb-5">
            <Link href="/register" className="text-muted text-decoration-none fw-bold">
              <span className="material-symbols-outlined align-middle me-1">arrow_back</span>
              Back
            </Link>
          </div>
          <BadgeGold>Phase 2</BadgeGold>
          <h1 className="editorial-header display-4 fw-900 text-dark-green mt-3">
            Member <span className="text-warm-muted">Registration</span>
          </h1>
          <p className="text-muted fw-bold mt-3">
            The full member registration form will be implemented in Phase 2.
          </p>
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
