export default function DetailTab({ active, label, count, onClick, id, controls }) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={active}
      aria-controls={controls}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className={`-mb-px cursor-pointer border-0 bg-transparent px-4 py-2.5 text-[13px] font-semibold capitalize transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-purple-500/35 max-[900px]:min-h-11 ${
        active
          ? 'border-b-2 border-accent text-accent'
          : 'border-b-2 border-transparent text-muted hover:text-default'
      }`}
    >
      {label}
      {count > 0 && <span className="ml-1.5 text-[11px] text-muted">({count})</span>}
    </button>
  );
}
