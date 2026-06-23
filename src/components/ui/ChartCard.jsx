import { useId } from 'react';
import { card, cardSubtitle, cardTitle } from './componentClasses.js';
import { cfHeight } from '../../utils/cfDynamic.js';

/**
 * Lightweight chart shell — no recharts dependency.
 */
export function ChartCard({ title, subtitle, children, height = 240, empty, className = '', style, dataSummary }) {
  const titleId = useId();
  const chartLabel = dataSummary || (subtitle ? `${title}: ${subtitle}` : title);

  return (
    <figure className={`${card} ${className}`.trim()} style={style} aria-labelledby={titleId}>
      <div className="mb-3.5">
        <div className={cardTitle} id={titleId}>{title}</div>
        {subtitle && <div className={cardSubtitle}>{subtitle}</div>}
      </div>
      {empty ? (
        <div className="cf-var-h flex items-center justify-center text-[13px] text-slate-500" style={cfHeight(height)} role="status">{empty}</div>
      ) : (
        <>
          <div className="cf-var-h w-full" style={cfHeight(height)} role="img" aria-label={chartLabel}>{children}</div>
          {dataSummary && <figcaption className="sr-only">{dataSummary}</figcaption>}
        </>
      )}
    </figure>
  );
}

export function ChartFallback({ height = 240 }) {
  return (
    <div
      className="w-full animate-pulse rounded-lg bg-surface-2"
      style={{ height }}
      aria-hidden="true"
    />
  );
}
