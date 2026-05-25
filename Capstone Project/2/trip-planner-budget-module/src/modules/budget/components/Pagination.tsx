interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  onNext,
  onPrev,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Show up to 7 page buttons, with ellipsis if more
  function getPageNumbers(): (number | '...')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  return (
    <nav
      className="mt-4 flex items-center justify-center gap-1"
      aria-label="Expense list pagination"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={page === 1}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        ← Prev
      </button>

      {getPageNumbers().map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-xs text-gray-400"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={[
              'rounded-lg border px-3 py-1.5 text-xs transition',
              p === page
                ? 'border-blue-500 bg-blue-600 font-medium text-white'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
            ].join(' ')}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={page === totalPages}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        Next →
      </button>
    </nav>
  );
}
