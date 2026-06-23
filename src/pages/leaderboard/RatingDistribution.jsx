import { cfProgress } from '../../utils/cfDynamic.js';

export default function RatingDistribution({ ratings }) {
  const buckets = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratings.forEach((r) => { if (buckets[r.rating] !== undefined) buckets[r.rating]++; });
  const max = Math.max(1, ...Object.values(buckets));

  return (
    <div className="flex flex-col gap-1">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = buckets[star];
        const pct = (count / max) * 100;
        return (
          <div key={star} className="flex items-center gap-2 text-[11px]">
            <span className="w-[22px] font-semibold text-muted">{star}★</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border-subtle">
              <div
                className="cf-var-progress h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-[width] duration-[240ms] ease-out"
                style={cfProgress(pct)}
              />
            </div>
            <span className="w-[22px] text-right tabular-nums text-muted">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
