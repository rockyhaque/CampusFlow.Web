import { lazy, Suspense } from 'react';
import { ChartFallback } from './ChartCard.jsx';

export { ChartCard, ChartFallback } from './ChartCard.jsx';
export { CHART_COLORS, CHART_PALETTE } from './chartColors.js';

const PieModule = lazy(() => import('./Charts.recharts.jsx').then((m) => ({ default: m.PieBreakdown })));
const AreaModule = lazy(() => import('./Charts.recharts.jsx').then((m) => ({ default: m.AreaTrend })));
const BarModule = lazy(() => import('./Charts.recharts.jsx').then((m) => ({ default: m.BarSeries })));
const LineModule = lazy(() => import('./Charts.recharts.jsx').then((m) => ({ default: m.LineTrend })));

export function PieBreakdown(props) {
  return (
    <Suspense fallback={<ChartFallback />}>
      <PieModule {...props} />
    </Suspense>
  );
}

export function AreaTrend(props) {
  return (
    <Suspense fallback={<ChartFallback />}>
      <AreaModule {...props} />
    </Suspense>
  );
}

export function BarSeries(props) {
  return (
    <Suspense fallback={<ChartFallback />}>
      <BarModule {...props} />
    </Suspense>
  );
}

export function LineTrend(props) {
  return (
    <Suspense fallback={<ChartFallback />}>
      <LineModule {...props} />
    </Suspense>
  );
}
