export default function ScoreRing({ avg, total }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 96 96">
        <defs>
          <linearGradient id="fb-ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle className="fill-none stroke-violet-500/[0.12] [stroke-width:6]" cx="48" cy="48" r={r} />
        <circle
          className="fill-none [stroke:url(#fb-ring-gradient)] [stroke-linecap:round] [stroke-width:6] transition-[stroke-dashoffset] duration-[800ms] ease-in-out"
          cx="48"
          cy="48"
          r={r}
          strokeDasharray={circ}
          strokeDashoffset={total > 0 ? circ - (avg / 5) * circ : circ}
        />
      </svg>
      <div className="relative z-[1] flex flex-col items-center gap-0">
        <span className="text-2xl font-extrabold leading-none tracking-tight text-violet-500">
          {total > 0 ? avg : '—'}
        </span>
        <span className="text-[11px] font-semibold tracking-wide text-muted">/ 5</span>
      </div>
    </div>
  );
}
