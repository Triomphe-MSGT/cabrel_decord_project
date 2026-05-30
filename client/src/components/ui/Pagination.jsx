import { ChevronLeft, ChevronRight } from 'lucide-react';

const getVisiblePages = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [1];
  if (current > 3) pages.push('…');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('…');
  pages.push(total);
  return pages;
};

export default function Pagination({ page, pages, total, limit, onPageChange, className = '' }) {
  if (pages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const visiblePages = getVisiblePages(page, pages);

  return (
    <nav
      className={`pagination ${className}`}
      aria-label="Pagination des produits"
    >
      <p className="pagination__info">
        {start}–{end} sur {total} produit{total > 1 ? 's' : ''}
      </p>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__btn pagination__btn--arrow"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Page précédente"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="pagination__pages">
          {visiblePages.map((p, i) =>
            p === '…' ? (
              <span key={`ellipsis-${i}`} className="pagination__ellipsis" aria-hidden>
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={`pagination__btn pagination__btn--page${p === page ? ' pagination__btn--active' : ''}`}
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className="pagination__btn pagination__btn--arrow"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          aria-label="Page suivante"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
}
