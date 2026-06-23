/** Shared Tailwind classes and helpers for the leaderboard page. */

export const leaderboardLoaded = 'leaderboard-loaded';

export const leaderboardStatsGrid =
  'grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]';

export const podiumCard =
  'rounded-xl border border-border-subtle bg-surface p-6 pb-4 pt-7 shadow-sm';

export const podiumGrid =
  'mx-auto flex max-w-[640px] items-end justify-center gap-3 overflow-x-auto pb-1 max-[600px]:max-w-full max-[600px]:justify-start max-[600px]:px-1';

export const myRankBadge =
  'shrink-0 rounded-lg border border-purple-500/20 bg-purple-500/8 px-4 py-2.5 text-center';

export const myRankLabel = 'text-[11px] font-semibold uppercase tracking-wide text-muted';

export const myRankValue = 'mt-0.5 text-2xl font-bold tabular-nums text-primary';

export const leaderboardError =
  'flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-sm text-red-500';

export const leaderboardErrorRetry =
  'ml-auto shrink-0 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-500 transition-colors duration-150 hover:bg-red-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/40 max-[900px]:min-h-11 max-[900px]:px-4';

export const rankingToolbar =
  'flex flex-wrap items-center gap-3 border-b border-border-subtle px-5 py-3.5';

export const filterLabel = 'sr-only';

/** Stagger index for leaderboard entrance animations (cap at 16). */
export function lbStagger(index) {
  return { style: { '--lb-i': Math.min(index, 16) } };
}
