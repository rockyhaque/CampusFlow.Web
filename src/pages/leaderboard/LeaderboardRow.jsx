import Icon from '../../components/ui/Icon.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import { btnSecondarySm } from '../../components/ui/componentClasses.js';
import { MEDAL_EMOJI } from './constants.js';
import { lbStagger } from './leaderboardClasses.js';
import { initials } from './utils.js';

export default function LeaderboardRow({ item, rank, isMe, onView, staggerIndex = 0 }) {
  const rated = item.total_ratings > 0;

  return (
    <tr
      className={`leaderboard-row-enter ${isMe ? 'bg-purple-500/[0.06]' : undefined}`}
      style={lbStagger(Math.min(staggerIndex, 8)).style}
    >
      <td className={`text-sm font-bold ${rank <= 3 ? 'text-accent' : 'text-primary'}`}>
        {rank <= 3 ? (
          <span aria-label={`Rank ${rank}`}>{MEDAL_EMOJI[rank - 1]}</span>
        ) : (
          `#${rank}`
        )}
      </td>
      <td>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-gradient text-xs font-bold text-white">
            {item.photo_url
              ? <img src={item.photo_url} alt="" className="h-full w-full object-cover" />
              : initials(item.full_name)}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-primary">
              {item.full_name || 'Unknown'}
              {isMe && (
                <span className="ml-1.5 rounded-full bg-purple-500/12 px-1.5 py-px text-[10px] font-bold text-accent">
                  You
                </span>
              )}
            </div>
            {item.batch && <div className="text-[11px] text-muted">Batch {item.batch}</div>}
          </div>
        </div>
      </td>
      <td className="text-xs text-muted">{item.department || '—'}</td>
      <td>
        {rated ? (
          <StarRating value={parseFloat(item.avg_rating)} readonly size={12} />
        ) : (
          <span className="text-[11px] italic text-muted">Not rated</span>
        )}
      </td>
      <td className={`text-right text-[13px] tabular-nums ${rated ? 'text-primary' : 'text-muted'}`}>
        {item.total_ratings || 0}
      </td>
      <td className="text-right text-[13px] tabular-nums text-muted">{item.events_count || 0}</td>
      <td className={`text-right text-[13px] tabular-nums ${item.total_hours > 0 ? 'font-semibold text-primary' : 'text-muted'}`}>
        {item.total_hours > 0 ? `${item.total_hours} h` : '—'}
      </td>
      <td className="text-right">
        <button
          type="button"
          className={`${btnSecondarySm} inline-flex items-center gap-1 px-2.5 py-1 text-[11px] transition-transform duration-150 active:scale-[0.97]`}
          onClick={onView}
          aria-label={`View details for ${item.full_name || 'volunteer'}`}
        >
          <Icon name="eye" size={11} aria-hidden="true" /> View
        </button>
      </td>
    </tr>
  );
}
