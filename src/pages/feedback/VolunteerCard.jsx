import Icon from '../../components/ui/Icon.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import { btnPrimarySm } from '../../components/ui/componentClasses.js';

export default function VolunteerCard({ volunteer, onRate, roleName }) {
  const hasRating = volunteer.total_ratings > 0;
  return (
    <div className="flex flex-col items-center gap-[7px] rounded-2xl border border-slate-900/8 bg-white/85 px-4 pb-4 pt-[22px] text-center transition-all duration-base hover:-translate-y-0.5 hover:border-violet-500/28 hover:shadow-[0_10px_28px_rgba(2,6,23,0.08)]">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[22px] font-bold text-white shadow-[0_4px_14px_rgba(139,92,246,0.25)] [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
        {volunteer.photo_url
          ? <img src={volunteer.photo_url} alt={volunteer.full_name} />
          : volunteer.full_name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'}
      </div>
      <div className="text-sm font-bold leading-snug text-primary">{volunteer.full_name || 'Unknown'}</div>
      {(volunteer.department || roleName || volunteer.role_name) && (
        <div className="-mt-0.5 text-xs text-muted">{roleName || volunteer.role_name || volunteer.department}</div>
      )}
      {hasRating ? (
        <div className="mt-0.5 flex items-center gap-[5px]">
          <StarRating value={volunteer.avg_rating} readonly size={13} showValue={false} emptyClass="text-slate-900/15" />
          <span className="text-[13px] font-bold text-primary">{volunteer.avg_rating}</span>
        </div>
      ) : (
        <div className="my-1 text-xs italic text-muted">Not yet rated</div>
      )}
      <div className="mb-1.5 text-[11px] text-muted">
        {volunteer.events_count > 0
          ? `${volunteer.events_count} event${volunteer.events_count !== 1 ? 's' : ''}`
          : 'No events yet'}
        {hasRating && ` · ${volunteer.total_ratings} rating${volunteer.total_ratings !== 1 ? 's' : ''}`}
      </div>
      <button type="button" className={`${btnPrimarySm} w-full`} onClick={() => onRate(volunteer)}>
        <Icon name="starFilled" size={13} /> Rate Volunteer
      </button>
    </div>
  );
}
