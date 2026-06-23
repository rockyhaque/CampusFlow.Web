/** Shared Tailwind classes and helpers for dashboard pages. */

export const cardMt = 'mt-5';

export const dashboardLoaded =
  'dashboard-loaded';

export const dashboardSection =
  'dashboard-section';

export const systemMetricsCard =
  'dashboard-section mb-6 rounded-xl border border-purple-500/25 bg-surface p-6 shadow-sm';

export const systemMetricsHeader =
  'mb-1.5 flex items-center gap-2';

export const systemMetricsTitle =
  'm-0 text-base font-semibold text-purple-600';

export const cardSubtitleMb =
  'mt-0.5 mb-[18px] text-sm text-muted';

export const sectionWrap = 'mt-4';

export const sectionLabel =
  'mb-2.5 text-sm font-semibold text-default';

export const cardSectionTitle =
  'mb-3.5 text-base font-semibold text-primary';

export const chartStatCenter =
  'flex h-full flex-col items-center justify-center gap-3';

export const chartStatCenterLg =
  'flex h-full flex-col items-center justify-center gap-4';

export const chartStatValueGreen =
  'font-mono text-[56px] font-bold leading-none text-green-500';

export const chartStatValueAmber =
  'font-mono text-[64px] font-bold leading-none text-amber-400';

export const chartStatCaption =
  'text-sm text-muted';

export const progressBarTrack =
  'h-2 w-[70%] overflow-hidden rounded-full bg-green-500/15';

export const progressBarFill =
  'cf-var-progress h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400 transition-[width] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]';

export const activityList = 'flex flex-col gap-1.5';

export const activityItem =
  'flex items-center gap-3 border-b border-border-subtle py-2.5 last:border-b-0';

export const activityItemMain = 'min-w-0 flex-1';

export const activityItemTitle =
  'font-medium text-primary';

export const activityItemSub =
  'mt-0.5 text-xs text-muted';

export const dashboardError =
  'flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-sm text-red-500';

export const dashboardErrorRetry =
  'ml-auto shrink-0 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-500 transition-colors duration-150 hover:bg-red-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/40 max-[900px]:min-h-11 max-[900px]:px-4';

/** Stagger index for dashboard entrance animations (cap at 12). */
export function dashStagger(index) {
  return { style: { '--dash-i': Math.min(index, 12) } };
}

/** Keyboard-accessible navigable table row props. */
export function rowNavProps(navigate, path) {
  return {
    role: 'link',
    tabIndex: 0,
    onClick: () => navigate(path),
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigate(path);
      }
    },
  };
}

/** Screen-reader summary for chart data. */
export function summarizeSeries(data, { nameKey = 'name', valueKey = 'value' } = {}) {
  if (!data?.length) return '';
  return data.map((d) => `${d[nameKey]} ${d[valueKey]}`).join(', ');
}
