import Icon from '../../components/ui/Icon.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import { fmtDate } from './utils.js';

export default function RatingFeedCard({ rating }) {
  const score = rating.rating || rating.score || 0;
  const name = rating.rated_by_name || rating.rater_name || rating.full_name || 'Anonymous';
  return (
    <div className="flex items-start gap-3.5 border-b border-slate-900/5 px-[22px] py-4 transition-[background] duration-fast last:border-b-0 hover:bg-slate-50/70">
      <Avatar name={name} photoUrl={rating.photo_url} size="feed" variant="violet" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-primary">{name}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
          {rating.event_title && <span>{rating.event_title}</span>}
          <span className="text-slate-900/15">·</span>
          <span>{fmtDate(rating.created_at)}</span>
        </div>
        {rating.comment && (
          <div className="mt-2 rounded-r-md border-l-2 border-violet-500/30 bg-slate-50/80 px-3 py-2 text-[13px] italic leading-snug text-default">
            "{rating.comment}"
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-[5px]">
        <StarRating value={score} readonly size={15} showValue={false} emptyClass="text-slate-900/15" />
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/12 px-[9px] py-[3px] text-xs font-bold text-amber-700">
          <Icon name="starFilled" size={11} /> {score}/5
        </span>
      </div>
    </div>
  );
}
