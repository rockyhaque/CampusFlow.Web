import { useEffect, useId, useRef, useState } from 'react';
import Icon from './Icon.jsx';

/**
 * Custom select/dropdown menu.
 * - No native <select> UI
 * - Click outside / ESC to close
 * - Optional clear button
 */
export default function SelectMenu({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  className = '',
  allowClear = true,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const id = useId();

  const current = options.find((o) => o.value === value);
  const label = current?.label || placeholder;

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div className={`relative w-40 ${className}`} ref={ref}>
      <button
        type="button"
        className="inline-flex h-10 w-full items-center justify-between gap-2.5 rounded-md border border-border-soft bg-white px-3 text-sm text-primary hover:border-violet-500/[0.18] disabled:cursor-not-allowed disabled:opacity-60"
        aria-expanded={open}
        aria-controls={id}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
        <span className="inline-flex items-center gap-1.5">
          {allowClear && !!value && (
            <button
              type="button"
              className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-lg border border-slate-900/8 bg-white/90 text-muted transition-[background,color,border-color] duration-fast hover:border-red-500/16 hover:bg-red-500/8 hover:text-red-700/95"
              title="Clear"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setOpen(false);
              }}
            >
              <Icon name="x" size={14} />
            </button>
          )}
          <Icon name="chevronDown" size={16} />
        </span>
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+8px)] right-0 z-40 w-full rounded-[14px] border border-slate-900/8 bg-surface p-1.5 shadow-[0_18px_48px_rgba(2,6,23,0.12)]"
          id={id}
          role="listbox"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`flex w-full items-center justify-between gap-2.5 rounded-xl border-0 bg-transparent p-2.5 text-left text-sm text-default hover:bg-violet-500/8 hover:text-primary ${
                  active ? 'bg-violet-500/12 font-semibold text-primary' : ''
                }`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
