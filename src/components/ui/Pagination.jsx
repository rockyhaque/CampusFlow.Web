import Icon from './Icon.jsx';
import { pageBtn, pageBtnActive, pagination } from './componentClasses.js';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  return (
    <nav className={pagination} aria-label="Pagination">
      <button
        type="button"
        className={pageBtn}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <Icon name="chevronLeft" size={16} strokeWidth={2} aria-hidden />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted" aria-hidden>…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={p === page ? pageBtnActive : pageBtn}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        className={pageBtn}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <Icon name="chevronRight" size={16} strokeWidth={2} aria-hidden />
      </button>
    </nav>
  );
}
