import { useMemo } from 'react';
import type { BudgetExpense, CategoryFilter, StatusFilter } from '../types/budget.types';

interface FilterParams {
  expenses: BudgetExpense[];
  search: string;
  categoryFilter: CategoryFilter;
  statusFilter: StatusFilter;
}

export function useFilteredExpenses({
  expenses,
  search,
  categoryFilter,
  statusFilter,
}: FilterParams): BudgetExpense[] {
  return useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch = e.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());
      const matchCategory =
        categoryFilter === 'ALL' || e.category === categoryFilter;
      const matchStatus =
        statusFilter === 'ALL' || e.payment_status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [expenses, search, categoryFilter, statusFilter]);
}
