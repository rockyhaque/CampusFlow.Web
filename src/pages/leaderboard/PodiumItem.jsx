import Icon from '../../components/ui/Icon.jsx';
import { PODIUM_RANK } from './constants.js';
import { lbStagger } from './leaderboardClasses.js';
import { initials, shortName } from './utils.js';

export default function PodiumItem({ rank, item, isMe, staggerIndex = 0 }) {
  const conf = PODIUM_RANK[rank];
  const enterClass = 'leaderboard-podium-enter';

  if (!item) {
    return (
      <div
        className={`flex flex-[0_0_180px] flex-col items-center gap-2 max-[600px]:flex-[0_0_120px] ${enterClass}`}
        style={lbStagger(staggerIndex).style}
        aria-hidden="true"
      >
        <div className={`leading-none opacity-30 ${conf.medalClass}`}>{conf.medal}</div>
        <div
          className={`flex items-center justify-center rounded-full border-2 border-dashed border-border-soft bg-surface-2 font-bold text-muted ${conf.size}`}
        >
          {conf.placeholder}
        </div>
        <div className="text-xs italic text-muted">—</div>
        <div className={`mt-1 w-full rounded-t-xl opacity-25 ${conf.block}`} />
      </div>
    );
  }

  return (
    <article
      className={`flex flex-[0_0_180px] flex-col items-center gap-2.5 max-[600px]:flex-[0_0_120px] ${enterClass}`}
      style={lbStagger(staggerIndex).style}
      aria-label={`Rank ${rank}: ${item.full_name}, rating ${parseFloat(item.avg_rating).toFixed(1)}`}
    >
      <div className={`leading-none ${conf.medalClass}`} aria-hidden="true">{conf.medal}</div>
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-full border-[3px] bg-accent-gradient font-bold text-white ${conf.size} ${conf.border}`}
      >
        {item.photo_url
          ? <img src={item.photo_url} alt="" className="h-full w-full object-cover" />
          : initials(item.full_name)}
        {isMe && (
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold text-white">
            You
          </span>
        )}
      </div>
      <div className="max-w-40 truncate text-center text-[13px] font-bold text-primary">
        {shortName(item.full_name)}
      </div>
      <div className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-[3px] text-[13px] font-bold text-accent">
        <Icon name="starFilled" size={11} className="text-amber-500" aria-hidden="true" />
        {parseFloat(item.avg_rating).toFixed(1)}
      </div>
      <div
        className={`mt-1 flex w-full items-start justify-center rounded-t-xl pt-2 text-lg font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.15)] ${conf.block}`}
        aria-hidden="true"
      >
        #{rank}
      </div>
    </article>
  );
}
