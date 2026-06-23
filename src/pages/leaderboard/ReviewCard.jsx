import StarRating from '../../components/ui/StarRating.jsx';
import { fmtRelative, initials } from './utils.js';

export default function ReviewCard({ review }) {
  return (
    <div className="rounded-[10px] border border-border-subtle bg-surface p-3.5">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-[11px] font-bold text-slate-600">
            {review.rated_by_photo
              ? <img src={review.rated_by_photo} alt={review.rated_by_name} className="h-full w-full object-cover" />
              : initials(review.rated_by_name)}
          </div>
          <div>
            <div className="text-[12.5px] font-semibold text-primary">
              {review.rated_by_name || 'Anonymous'}
            </div>
            <div className="text-[10.5px] text-muted">
              {review.event_title} · {fmtRelative(review.created_at)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StarRating value={review.rating} readonly size={12} />
          <span className="text-xs font-bold text-primary">{review.rating}/5</span>
        </div>
      </div>
      {review.comment && (
        <p className="m-0 text-[12.5px] italic leading-snug text-default">
          "{review.comment}"
        </p>
      )}
    </div>
  );
}
