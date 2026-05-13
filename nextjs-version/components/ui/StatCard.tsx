interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  variant?: 'primary' | 'surface' | 'secondary';
  /** Small line beneath the value (e.g. trend text) */
  subtitle?: React.ReactNode;
  /** Rendered below subtitle (e.g. a button) */
  action?: React.ReactNode;
  /** Stagger entrance animation: 0 | 1 | 2 */
  delay?: 0 | 1 | 2;
}

export function StatCard({
  label,
  value,
  icon,
  variant = 'primary',
  subtitle,
  action,
  delay = 0,
}: StatCardProps) {
  const delayClass = delay === 1 ? ' delay-1' : delay === 2 ? ' delay-2' : '';

  return (
    <div className={`stat-card stat-card-${variant} animate-up${delayClass}`}>
      <span className="stat-label">{label}</span>
      <div className="stat-value">{value}</div>

      {subtitle && (
        <div className="d-flex align-items-center gap-2 fs-7 fw-bold opacity-75 mt-1">
          {subtitle}
        </div>
      )}

      {action && <div className="mt-3">{action}</div>}

      <span className="material-symbols-outlined stat-icon-bg" aria-hidden="true">
        {icon}
      </span>
    </div>
  );
}
