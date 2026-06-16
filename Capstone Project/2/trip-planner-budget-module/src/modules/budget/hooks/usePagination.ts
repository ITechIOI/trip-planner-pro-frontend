import { useState, useEffect } from 'react';
import { ITEMS_PER_PAGE } from '../helpers/budget.constants';

interface PaginationResult<T> {
  pageItems: T[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  goNext: () => void;
  goPrev: () => void;
}

export function usePagination<T>(
  items: T[],
  resetDeps: unknown[] = []
): PaginationResult<T> {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...resetDeps]);

  // Clamp page when items shrink
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return {
    pageItems,
    page,
    totalPages,
    setPage,
    goNext: () => setPage((p) => Math.min(totalPages, p + 1)),
    goPrev: () => setPage((p) => Math.max(1, p - 1)),
  };
}
