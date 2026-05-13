import type { DivisionStat } from '@/lib/types';

interface DivisionMixChartProps {
  stats: DivisionStat[];
  /** Dark variant used inside widget-dark */
  dark?: boolean;
}

/** Stacked progress-bar chart matching the original HTML exactly */
export function DivisionMixChart({ stats, dark = false }: DivisionMixChartProps) {
  return (
    <div>
      {stats.map(({ division, percentage }, i) => (
        <div key={division} className={i < stats.length - 1 ? 'mb-4' : ''}>
          <div
            className="d-flex justify-content-between fs-8 fw-bold mb-1"
            style={dark ? { color: 'rgba(255,255,255,0.88)' } : undefined}
          >
            <span>{division}</span>
            <span>{percentage}%</span>
          </div>
          <div
            className="progress"
            style={{ background: dark ? 'rgba(255,255,255,0.1)' : undefined, height: 6 }}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${percentage}%`, background: 'var(--secondary)' }}
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
