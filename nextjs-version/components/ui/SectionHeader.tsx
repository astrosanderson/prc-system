interface SectionHeaderProps {
  /** Primary text (default color) */
  primary: string;
  /** Accent text rendered in --secondary color */
  accent?: string;
  /** Optional right-side slot (button, link, etc.) */
  action?: React.ReactNode;
  className?: string;
}

/** Replicates the `editorial-header fs-2 fw-900` pattern used across dashboards */
export function SectionHeader({ primary, accent, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={`d-flex justify-content-between align-items-center mb-4 ${className}`}>
      <h3 className="editorial-header fs-2 fw-900 text-dark-green mb-0">
        {primary}{' '}
        {accent && <span className="text-warm-muted">{accent}</span>}
      </h3>
      {action}
    </div>
  );
}
