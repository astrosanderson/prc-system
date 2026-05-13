import type { Division, PlayerStatus, Gender } from '@/lib/types';

export function BadgeGold({ children }: { children: React.ReactNode }) {
  return <span className="badge-gold">{children}</span>;
}

export function BadgeElite({ children }: { children: React.ReactNode }) {
  return <span className="badge-elite">{children}</span>;
}

/* Division pills — gold-on-dark or dark-green/gold variations only, no blue */
const DIVISION_STYLES: Record<Division, { bg: string; color: string }> = {
  'U-8':  { bg: 'rgba(27, 58, 45, 0.08)',  color: '#1b3a2d' },
  'U-10': { bg: 'rgba(45, 106, 79, 0.1)',  color: '#2d6a4f' },
  'U-12': { bg: 'rgba(45, 106, 79, 0.14)', color: '#1b3a2d' },
  'U-14': { bg: 'rgba(201, 168, 76, 0.16)', color: '#8c6f1f' },
  'U-16': { bg: 'rgba(201, 168, 76, 0.24)', color: '#7a5c00' },
  'U-18': { bg: 'rgba(27, 58, 45, 0.92)',  color: '#c9a84c' },
};

export function DivisionBadge({ division }: { division: Division }) {
  const s = DIVISION_STYLES[division];
  return (
    <span
      className="d-inline-block fw-bold text-uppercase"
      style={{
        background: s.bg,
        color: s.color,
        fontSize: '0.62rem',
        letterSpacing: '0.06em',
        padding: '0.3rem 0.65rem',
        borderRadius: 999,
        lineHeight: 1,
      }}
    >
      {division}
    </span>
  );
}

const STATUS_STYLES: Record<PlayerStatus, { dotBg: string; color: string }> = {
  Active:   { dotBg: 'var(--color-mid-green)',  color: 'var(--color-mid-green)' },
  Pending:  { dotBg: 'var(--color-gold)',       color: '#7a5c00' },
  Inactive: { dotBg: 'var(--color-muted)',      color: 'var(--color-muted)' },
  Rejected: { dotBg: 'var(--color-danger)',     color: 'var(--color-danger)' },
};

export function StatusBadge({ status }: { status: PlayerStatus }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Inactive;
  return (
    <span className="fw-bold d-flex align-items-center gap-1" style={{ color: style.color }}>
      <span
        className={`status-dot${status === 'Pending' ? ' animate-pulse-zf' : ''}`}
        style={{ backgroundColor: style.dotBg }}
      />
      {status}
    </span>
  );
}

/* ── Gender chip — subtle pill, on-palette (no blue) ── */
const GENDER_STYLES: Record<Gender, { bg: string; color: string; icon: string }> = {
  Male:   { bg: 'rgba(27, 58, 45, 0.08)',  color: '#1b3a2d', icon: 'male' },
  Female: { bg: 'rgba(201, 168, 76, 0.18)', color: '#7a5c00', icon: 'female' },
};

export function GenderBadge({ gender }: { gender: Gender }) {
  const s = GENDER_STYLES[gender];
  return (
    <span
      className="d-inline-flex align-items-center gap-1 fw-bold text-uppercase"
      style={{
        background: s.bg,
        color: s.color,
        fontSize: '0.62rem',
        letterSpacing: '0.06em',
        padding: '0.25rem 0.55rem',
        borderRadius: 999,
        lineHeight: 1,
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>{s.icon}</span>
      {gender}
    </span>
  );
}
