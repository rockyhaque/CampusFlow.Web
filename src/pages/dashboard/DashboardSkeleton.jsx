import { statsGrid } from '../../components/layout/layoutClasses.js';

export function DashboardStatsSkeleton({ count = 4 }) {
  return (
    <div className={statsGrid} aria-busy="true" aria-label="Loading dashboard stats">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-border-subtle bg-surface p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-surface-2" />
            <div className="h-3 w-24 rounded bg-surface-2" />
          </div>
          <div className="h-8 w-16 rounded bg-surface-2" />
        </div>
      ))}
    </div>
  );
}

export function DashboardChartsSkeleton({ count = 3 }) {
  return (
    <div className="mb-6 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-border-subtle bg-surface p-6">
          <div className="mb-4 h-4 w-32 rounded bg-surface-2" />
          <div className="h-[240px] rounded-lg bg-surface-2" />
        </div>
      ))}
    </div>
  );
}
