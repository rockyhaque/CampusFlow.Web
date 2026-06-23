import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

/**
 * Live countdown rendered as a "scoreboard" of D · H · M · S, ticking every second.
 *
 * Variants:
 *   "starts"   — counts down to event start (cyan)
 *   "ends"     — counts down to event end (amber, urgency)
 *   "deadline" — counts down to a deadline (red, strong urgency)
 */

const VARIANT = {
  starts: {
    wrap: 'border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-violet-500/[0.04] shadow-[0_0_20px_rgba(139,92,246,0.18)]',
    fg: 'text-violet-500',
    fgDim: 'text-violet-500/60',
    iconColor: 'rgba(139,92,246,1)',
    icon: 'clock',
  },
  ends: {
    wrap: 'border-amber-500/45 bg-gradient-to-br from-amber-500/10 to-amber-500/[0.04] shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    fg: 'text-amber-400',
    fgDim: 'text-amber-500/65',
    iconColor: 'var(--amber-400)',
    icon: 'clock',
  },
  deadline: {
    wrap: 'border-red-500/45 bg-gradient-to-br from-red-500/10 to-red-500/[0.04] shadow-[0_0_20px_rgba(239,68,68,0.25)]',
    fg: 'text-red-400',
    fgDim: 'text-red-500/65',
    iconColor: 'var(--red-400)',
    icon: 'warning',
  },
};

const SIZE = {
  sm: {
    wrap: 'gap-1.5 px-3 py-2',
    num: 'text-lg',
    unit: 'text-[9px] mt-1',
    minW: 'min-w-[26px]',
    sep: 'mx-1.5 pb-4 text-sm',
    label: 'text-[10px]',
  },
  md: {
    wrap: 'gap-1.5 px-4 py-2.5',
    num: 'text-[26px]',
    unit: 'text-[10px] mt-1',
    minW: 'min-w-[34px]',
    sep: 'mx-2.5 pb-5 text-xl',
    label: 'text-[10px]',
  },
  lg: {
    wrap: 'gap-1.5 px-[22px] py-3.5',
    num: 'text-4xl',
    unit: 'text-[11px] mt-1',
    minW: 'min-w-[44px]',
    sep: 'mx-3 pb-6 text-[25px]',
    label: 'text-[10px]',
  },
};

const pad2 = (n) => String(Math.max(0, n)).padStart(2, '0');

function compute(target) {
  if (!target) return null;
  const t = new Date(target).getTime();
  if (isNaN(t)) return null;
  const ms = Math.max(0, t - Date.now());
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { ms, days, hours, minutes, seconds, expired: ms <= 0 };
}

export default function Countdown({
  target,
  variant = 'starts',
  label,
  expiredLabel,
  size = 'md',
}) {
  const [now, setNow] = useState(() => compute(target));
  const tickRef = useRef(null);

  useEffect(() => {
    if (!target) return;
    const rafId = requestAnimationFrame(() => setNow(compute(target)));
    tickRef.current = setInterval(() => {
      const next = compute(target);
      setNow(next);
      if (next?.expired) clearInterval(tickRef.current);
    }, 1000);
    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(tickRef.current);
    };
  }, [target]);

  if (!target || !now) return null;

  const v = VARIANT[variant] || VARIANT.starts;
  const s = SIZE[size] || SIZE.md;

  if (now.expired) {
    return expiredLabel ? (
      <div className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-surface px-3.5 py-2 text-[13px] text-muted">
        <Icon name={v.icon} size={14} />
        {expiredLabel}
      </div>
    ) : null;
  }

  const showDays = now.days > 0;
  const cells = [];
  if (showDays) cells.push({ value: pad2(now.days), unit: now.days === 1 ? 'DAY' : 'DAYS' });
  cells.push({ value: pad2(now.hours), unit: 'HRS' });
  cells.push({ value: pad2(now.minutes), unit: 'MIN' });
  cells.push({ value: pad2(now.seconds), unit: 'SEC', live: true });

  return (
    <div className={`inline-flex flex-col rounded-md border ${v.wrap} ${s.wrap}`}>
      {label && (
        <div className={`flex items-center gap-1.5 font-semibold uppercase tracking-widest text-muted ${s.label}`}>
          <Icon name={v.icon} size={12} color={v.iconColor} />
          {label}
        </div>
      )}
      <div className="flex items-end">
        {cells.map((c, i) => (
          <div key={c.unit} className="flex items-end">
            <div className={`flex flex-col items-center ${s.minW}`}>
              <div
                key={c.live ? c.value : undefined}
                className={`font-mono font-bold tabular-nums leading-none tracking-wide ${v.fg} ${s.num} ${c.live ? 'animate-cf-tick' : ''}`}
              >
                {c.value}
              </div>
              <div className={`font-semibold uppercase tracking-widest ${v.fgDim} ${s.unit}`}>
                {c.unit}
              </div>
            </div>
            {i < cells.length - 1 && (
              <div className={`font-bold leading-none opacity-50 animate-cf-blink ${v.fgDim} ${s.sep}`}>
                :
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
