import type { CriticalDate } from '@/lib/types';

interface CriticalDatesProps {
  dates: CriticalDate[];
}

/** Critical dates widget — matches original `.date-block` structure */
export function CriticalDates({ dates }: CriticalDatesProps) {
  return (
    <>
      {dates.map((d, i) => (
        <div
          key={d.id}
          className={`date-block${i === dates.length - 1 ? ' border-0' : ''}`}
        >
          <div className={`date-badge${d.variant === 'secondary' ? ' date-badge-secondary' : ''}`}>
            <span className="date-month">{d.month}</span>
            <span className="date-day">{d.day}</span>
          </div>
          <div>
            <p className="fs-7 fw-bold mb-0">{d.title}</p>
            {d.subtitle && <p className="fs-9 text-muted mb-0">{d.subtitle}</p>}
          </div>
        </div>
      ))}
    </>
  );
}
