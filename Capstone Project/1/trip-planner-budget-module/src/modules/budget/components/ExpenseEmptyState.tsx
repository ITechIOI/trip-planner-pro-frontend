interface ExpenseEmptyStateProps {
  hasExpenses: boolean;
}

export function ExpenseEmptyState({ hasExpenses }: ExpenseEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12 text-center dark:border-gray-700">
      <span className="mb-3 text-4xl" aria-hidden="true">
        💸
      </span>
      {hasExpenses ? (
        <>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            No matching expenses
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Try adjusting your search or filters.
          </p>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            No expenses yet
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Click "+ Add Expense" to start tracking your trip costs.
          </p>
        </>
      )}
    </div>
  );
}
