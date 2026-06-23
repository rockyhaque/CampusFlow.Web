import Icon from '../../components/ui/Icon.jsx';
import ScoreRing from './ScoreRing.jsx';
import RatingFeedCard from './RatingFeedCard.jsx';

function performanceLabel(avgRating, count) {
  if (count === 0) return 'No ratings yet';
  if (avgRating >= 4.5) return 'Outstanding performance!';
  if (avgRating >= 4.0) return 'Great work!';
  if (avgRating >= 3.0) return 'Good standing';
  return 'Keep improving';
}

function StatBadge({ icon, value, label }) {
  return (
    <div className="inline-flex items-center gap-[7px] rounded-[10px] border border-violet-500/15 bg-white/80 px-3.5 py-[7px] text-[13px] font-medium text-default [&_strong]:font-bold [&_strong]:text-primary">
      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-500/[0.12] text-violet-500/90">
        <Icon name={icon} size={12} />
      </div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function VolunteerFeedbackView({ myRatings, avgRating }) {
  const eventCount = [...new Set(myRatings.map((r) => r.event_id).filter(Boolean))].length;

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-wrap items-center gap-7 rounded-[20px] border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.08] to-fuchsia-500/[0.04] px-8 py-7">
        <ScoreRing avg={avgRating} total={myRatings.length} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-violet-500/80">
            Volunteer Score
          </div>
          <div className="mb-3.5 text-[22px] font-extrabold tracking-tight text-primary">
            {performanceLabel(avgRating, myRatings.length)}
          </div>
          <div className="flex flex-wrap gap-2.5">
            <StatBadge
              icon="starFilled"
              value={avgRating > 0 ? avgRating.toFixed(1) : '—'}
              label="avg rating"
            />
            <StatBadge
              icon="users"
              value={myRatings.length}
              label={myRatings.length === 1 ? 'review' : 'reviews'}
            />
            <StatBadge icon="calendar" value={eventCount} label="events" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-slate-900/8 bg-white shadow-[0_4px_16px_rgba(2,6,23,0.04)]">
        <div className="flex items-center justify-between border-b border-slate-900/[0.06] bg-slate-50/50 px-[22px] py-4">
          <div className="flex items-center gap-[9px] text-sm font-bold tracking-tight text-primary">
            <div className="h-4 w-[3px] shrink-0 rounded-sm bg-gradient-to-b from-violet-500 to-fuchsia-500" />
            Received Ratings
          </div>
          <div className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-violet-500/[0.12] px-[7px] text-[11px] font-bold text-violet-500/90">
            {myRatings.length}
          </div>
        </div>
        {myRatings.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2.5 px-[22px] py-11 text-center">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-violet-500/8 text-violet-500/50">
              <Icon name="award" size={22} />
            </div>
            <div className="text-[15px] font-semibold text-default">No ratings yet</div>
            <div className="max-w-[260px] text-[13px] leading-normal text-muted">
              Participate in events and organizers will rate you here.
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {myRatings.map((r, i) => <RatingFeedCard key={r.id || i} rating={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
