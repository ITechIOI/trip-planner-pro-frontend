import type { BudgetExpense } from '../types/budget.types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../helpers/budget.constants';
import { formatVND, calcExpenseDiff } from '../helpers/budget.calculations';

interface ExpenseCardProps {
  expense: BudgetExpense;
  onEdit: (expense: BudgetExpense) => void;
  onDelete: (expense: BudgetExpense) => void;
}

export function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  const { label: diffLabel, isOver, isUnder } = calcExpenseDiff(
    expense.estimated_cost,
    expense.actual_cost
  );

  const categoryColor = CATEGORY_COLORS[expense.category];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      {/* Left: icon + name + badges */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-lg dark:bg-gray-800">
          {CATEGORY_ICONS[expense.category]}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {expense.name}
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {/* Category badge */}
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide"
              style={{
                backgroundColor: `${categoryColor}22`,
                color: categoryColor,
              }}
            >
              {expense.category}
            </span>

            {/* Status badge */}
            <span
              className={[
                'rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide',
                expense.payment_status === 'PAID'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
              ].join(' ')}
            >
              {expense.payment_status}
            </span>
          </div>
        </div>
      </div>

      {/* Right: costs + actions */}
      <div className="flex shrink-0 items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Est: {formatVND(expense.estimated_cost)} VND
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Actual: {formatVND(expense.actual_cost)} VND
          </p>
          <p
            className={[
              'text-xs font-medium',
              isOver
                ? 'text-red-500 dark:text-red-400'
                : isUnder
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-400',
            ].join(' ')}
          >
            {diffLabel}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(expense)}
            aria-label={`Edit ${expense.name}`}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(expense)}
            aria-label={`Delete ${expense.name}`}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
