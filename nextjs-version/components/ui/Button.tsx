import Link from 'next/link';

/* ── Gold CTA button (form submits, primary actions) ── */
interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: string;
  fullWidth?: boolean;
}

export function GoldButton({ children, icon, fullWidth, className = '', ...rest }: GoldButtonProps) {
  return (
    <button
      className={`btn-gold py-3 fw-bold${fullWidth ? ' w-100' : ''} justify-content-center ${className}`}
      {...rest}
    >
      {children}
      {icon && (
        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
          {icon}
        </span>
      )}
    </button>
  );
}

/* ── Gold link button (e.g. CTA in hero) ── */
export function GoldLinkButton({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <Link href={href} className="btn-gold py-3 px-5 fw-bold">
      {children}
      {icon && (
        <span className="material-symbols-outlined ms-2" style={{ fontSize: '1.1rem' }}>
          {icon}
        </span>
      )}
    </Link>
  );
}

/* ── kpp-modal style buttons ── */
type KppVariant = 'primary' | 'gold' | 'outline' | 'danger' | 'success';

interface KppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: KppVariant;
  icon?: string;
  children: React.ReactNode;
}

export function KppButton({ variant = 'primary', icon, children, className = '', ...rest }: KppButtonProps) {
  return (
    <button className={`kpp-btn kpp-btn--${variant} ${className}`} {...rest}>
      {icon && (
        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}

/* ── Quick-action button used in member dashboard ── */
export function QuickActionButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="btn btn-light border w-100 py-3 fw-bold text-start"
      style={{ borderRadius: 10 }}
    >
      <span className="material-symbols-outlined align-middle me-2">{icon}</span>
      {label}
    </Link>
  );
}
