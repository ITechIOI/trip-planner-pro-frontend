import type { BudgetExpense } from '../types/budget.types';
import { ExpenseCard } from './ExpenseCard';
import { Pagination } from './Pagination';
import { ExpenseEmptyState } from './ExpenseEmptyState';
import { usePagination } from '../hooks/usePagination';
import { ITEMS_PER_PAGE } from '../helpers/budget.constants';

interface ExpenseListProps {
  expenses: BudgetExpense[];
  hasAnyExpenses: boolean;
  onEdit: (expense: BudgetExpense) => void;
  onDelete: (expense: BudgetExpense) => void;
  resetDeps: unknown[];
}

export function ExpenseList({
  expenses,
  hasAnyExpenses,
  onEdit,
  onDelete,
  resetDeps,
}: ExpenseListProps) {
  const { pageItems, page, totalPages, setPage, goNext, goPrev } =
    usePagination(expenses, resetDeps);

  if (expenses.length === 0) {
    return <ExpenseEmptyState hasExpenses={hasAnyExpenses} />;
  }

  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, expenses.length);

  return (
    <div>
      <p className="mb-2 text-xs text-gray-400 dark:text-gray-500">
        Showing {startItem}–{endItem} of {expenses.length} expense
        {expenses.length !== 1 ? 's' : ''}
      </p>

      <div className="flex flex-col gap-2">
        {pageItems.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onNext={goNext}
        onPrev={goPrev}
      />
    </div>
  );
}
