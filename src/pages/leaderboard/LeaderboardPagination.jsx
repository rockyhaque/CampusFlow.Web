function buildPageNumbers(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = [1];
  if (page > 3) pages.push('…');
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (page < totalPages - 2) pages.push('…');
  pages.push(totalPages);
  return pages;
}

function pageBtnClass(active, disabled) {
  return `inline-flex h-9 min-h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-[13px] transition-colors duration-150 max-[900px]:min-h-11 max-[900px]:min-w-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500/35 ${
    active
      ? 'cursor-pointer border-accent bg-accent font-bold text-white'
      : disabled
        ? 'cursor-not-allowed border-border-subtle bg-surface font-medium text-muted opacity-50'
        : 'cursor-pointer border-border-subtle bg-surface font-medium text-primary hover:border-border-soft hover:bg-surface-2'
  }`;
}

export default function LeaderboardPagination({ page, totalPages, pageStart, pageEnd, total, onChange }) {
  const pages = buildPageNumbers(page, totalPages);

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle bg-page px-5 py-3"
      aria-label="Leaderboard pagination"
    >
      <div className="text-xs text-muted">
        Showing <strong className="text-primary">{pageStart + 1}–{pageEnd}</strong> of{' '}
        <strong className="text-primary">{total}</strong>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className={pageBtnClass(false, page <= 1)}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          ‹ Prev
        </button>
        {pages.map((p, i) => p === '…'
          ? <span key={`ellipsis-${i}`} className="px-1 text-[13px] text-muted" aria-hidden="true">…</span>
          : (
            <button
              key={p}
              type="button"
              className={pageBtnClass(p === page, false)}
              onClick={() => onChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
        <button
          type="button"
          className={pageBtnClass(false, page >= totalPages)}
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          Next ›
        </button>
      </div>
    </nav>
  );
}
