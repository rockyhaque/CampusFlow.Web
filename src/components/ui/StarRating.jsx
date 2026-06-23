import { useState } from 'react';
import Icon from './Icon.jsx';

const VALUE_TEXT = {
  12: 'text-[10px]',
  13: 'text-xs',
  14: 'text-xs',
  15: 'text-sm',
  16: 'text-sm',
  18: 'text-base',
  20: 'text-lg',
  26: 'text-lg',
  36: 'text-xl',
};

const COUNT_TEXT = {
  12: 'text-[9px]',
  13: 'text-[11px]',
  14: 'text-[11px]',
  15: 'text-xs',
  16: 'text-xs',
  18: 'text-sm',
  20: 'text-base',
  26: 'text-lg',
  36: 'text-xl',
};

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

function ratingValueClass(size) {
  return VALUE_TEXT[size] || 'text-xs';
}

function ratingCountClass(size) {
  return COUNT_TEXT[size] || 'text-[11px]';
}

/**
 * Star rating — display-only or interactive.
 * Pass onChange for picker mode; set readonly to disable interaction.
 */
export default function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = 14,
  count,
  showValue = true,
  showLabels = false,
  strokeWidth,
  emptyClass = 'text-border-soft',
  useButton = false,
  className = '',
}) {
  const [hover, setHover] = useState(0);
  const isInteractive = !!onChange && !readonly;
  const isDisplay = !isInteractive;
  const resolvedStroke = strokeWidth ?? (emptyClass === 'text-slate-900/15' ? 1.4 : 1.6);
  const active = hover || Math.round(Number(value) || 0);

  const stars = (
    <div className={`flex ${showLabels ? 'gap-1.5' : 'gap-0.5'} ${className}`.trim()}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active;
        const colorClass = filled ? 'text-amber-400' : emptyClass;
        const commonProps = {
          key: n,
          className: `inline-flex transition-colors duration-100 ${
            isInteractive ? 'cursor-pointer' : 'cursor-default'
          } ${colorClass} ${
            isInteractive && useButton && hover === n ? 'scale-110' : ''
          } ${isInteractive && useButton ? 'border-0 bg-transparent p-1 transition-[transform,color] duration-100' : ''}`,
          onClick: isInteractive ? () => onChange?.(n) : undefined,
          onMouseEnter: isInteractive ? () => setHover(n) : undefined,
          onMouseLeave: isInteractive ? () => setHover(0) : undefined,
        };

        const icon = (
          <Icon
            name={filled ? 'starFilled' : 'star'}
            size={size}
            strokeWidth={resolvedStroke}
          />
        );

        if (isInteractive && useButton) {
          return (
            <button type="button" {...commonProps}>
              {icon}
            </button>
          );
        }

        return <span {...commonProps}>{icon}</span>;
      })}
    </div>
  );

  if (isDisplay) {
    const v = Number(value) || 0;
    const rounded = Math.round(v);
    return (
      <div className="inline-flex items-center gap-1.5">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={`inline-flex ${n <= rounded ? 'text-amber-400' : emptyClass}`}>
              <Icon
                name={n <= rounded ? 'starFilled' : 'star'}
                size={size}
                strokeWidth={resolvedStroke}
              />
            </span>
          ))}
        </div>
        {showValue && v > 0 && (
          <span className={`font-semibold text-amber-400 ${ratingValueClass(size)}`}>{v.toFixed(1)}</span>
        )}
        {count != null && count > 0 && (
          <span className={`text-muted ${ratingCountClass(size)}`}>({count})</span>
        )}
      </div>
    );
  }

  if (showLabels) {
    const rating = hover || value;
    return (
      <div>
        {stars}
        <div className="mt-1.5 min-h-4 text-xs text-muted">
          {rating > 0 && LABELS[rating]}
        </div>
      </div>
    );
  }

  return stars;
}
