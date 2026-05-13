import type { FeedEvent } from '@/lib/types';

interface TimelineFeedProps {
  events: FeedEvent[];
}

/** Live feed timeline — matches original `.timeline-item` structure */
export function TimelineFeed({ events }: TimelineFeedProps) {
  return (
    <div>
      {events.map((ev) => (
        <div key={ev.id} className="timeline-item">
          <div className={`timeline-icon ${ev.iconBg}`}>
            <span className={`material-symbols-outlined ${ev.iconColor} fs-9`}>
              {ev.icon}
            </span>
          </div>
          <p className="fs-7 fw-bold mb-0">{ev.message}</p>
          <p className="fs-9 text-muted">{ev.detail}</p>
        </div>
      ))}
    </div>
  );
}
