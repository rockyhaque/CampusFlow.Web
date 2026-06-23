import Icon from './Icon.jsx';
import {
  statCard,
  statCardIcon,
  statCardLabel,
  statCardSub,
  statCardTop,
  statCardValue,
} from './componentClasses.js';

const TILE_THEMES = {
  amber: 'bg-amber-500/12 text-amber-500',
  green: 'bg-green-500/12 text-green-500',
  sky: 'bg-sky-500/12 text-sky-500',
  violet: 'bg-violet-600/12 text-violet-600',
};

const BIG_THEMES = {
  violet: 'bg-violet-200 text-violet-700',
  amber: 'bg-amber-100 text-amber-700',
  pink: 'bg-pink-100 text-pink-700',
  blue: 'bg-blue-100 text-blue-700',
};

const ICON_SIZES = {
  dashboard: 22,
  big: 15,
  tile: 12,
};

function renderIcon(icon, variant) {
  if (typeof icon !== 'string') return icon;
  return <Icon name={icon} size={ICON_SIZES[variant] || 15} />;
}

export default function StatCard({
  icon,
  label,
  value,
  sub,
  color = 'cyan',
  theme,
  variant = 'dashboard',
  onClick,
  active,
  className = '',
  style,
}) {
  if (variant === 'big') {
    const iconClass = BIG_THEMES[theme] ?? BIG_THEMES.violet;
    return (
      <div className={`rounded-xl border border-border-subtle bg-surface px-[18px] py-4 ${className}`.trim()}>
        <div className="mb-2 flex items-center gap-2.5">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
            {renderIcon(icon, 'big')}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</span>
        </div>
        <div className="text-[28px] font-bold leading-none text-primary">{value ?? '—'}</div>
        {sub && <div className="mt-1 text-[11px] text-muted">{sub}</div>}
      </div>
    );
  }

  if (variant === 'tile') {
    const iconClass = TILE_THEMES[theme] ?? TILE_THEMES.violet;
    return (
      <div className={`flex flex-col gap-1 rounded-[10px] border border-border-subtle bg-surface p-3 px-3.5 ${className}`.trim()}>
        <div className="flex items-center gap-1.5">
          <div className={`flex h-[22px] w-[22px] items-center justify-center rounded-md ${iconClass}`}>
            {renderIcon(icon, 'tile')}
          </div>
          <span className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{label}</span>
        </div>
        <div className="text-xl font-bold leading-none text-primary">{value ?? '—'}</div>
        {sub && <div className="text-[10.5px] text-muted">{sub}</div>}
      </div>
    );
  }

  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      style={style}
      className={`${statCard} ${onClick ? 'cursor-pointer text-left' : ''} ${active ? 'border-accent ring-2 ring-accent/20' : ''} ${className}`.trim()}
    >
      <div className={statCardTop}>
        <div className={statCardIcon(color)}>{renderIcon(icon, 'dashboard')}</div>
        <div className={statCardValue}>{value ?? '—'}</div>
      </div>
      <div className={statCardLabel}>{label}</div>
      {sub && <div className={statCardSub}>{sub}</div>}
    </Tag>
  );
}
