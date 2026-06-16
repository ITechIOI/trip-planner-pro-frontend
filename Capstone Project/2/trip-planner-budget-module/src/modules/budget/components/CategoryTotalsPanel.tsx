import { useState } from 'react';
import type { BudgetCategory, CategoryTotals } from '../types/budget.types';
import { CategoryDonutChart } from './CategoryDonutChart';

interface CategoryTotalsPanelProps {
  byCategory: Record<BudgetCategory, CategoryTotals>;
}

export function CategoryTotalsPanel({ byCategory }: CategoryTotalsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Header / toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 transition hover:bg-gray-50 dark:hover:bg-gray-800/60"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-base dark:bg-blue-950"
            aria-hidden="true"
          >
            🗂
          </span>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Category totals
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Actual spend by budget category with estimated context.
            </p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={[
            'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="border-t border-gray-100 px-4 py-4 dark:border-gray-800">
          <CategoryDonutChart byCategory={byCategory} />
        </div>
      )}
    </div>
  );
}
