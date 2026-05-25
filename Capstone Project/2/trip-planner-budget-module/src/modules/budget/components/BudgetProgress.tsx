import type { BudgetCategory, CategoryTotals } from '../types/budget.types';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../helpers/budget.constants';
import { formatVND } from '../helpers/budget.calculations';

interface BudgetProgressProps {
  budgetUsagePct: number;
  totalActual: number;
  budget: number;
  byCategory: Record<BudgetCategory, CategoryTotals>;
}

function progressColor(pct: number): string {
  if (pct >= 100) return '#E24B4A';
  if (pct >= 80) return '#BA7517';
  return '#1D9E75';
}

export function BudgetProgress({
  budgetUsagePct,
  totalActual,
  budget,
  byCategory,
}: BudgetProgressProps) {
  const color = progressColor(budgetUsagePct);
  const clampedPct = Math.min(budgetUsagePct, 100);

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
      {/* Progress header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Budget usage — {budgetUsagePct}% of {formatVND(budget)} VND
        </span>
        <span
          className="text-xs font-medium"
          style={{ color }}
        >
          {formatVND(totalActual)} VND used
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${clampedPct}%`, backgroundColor: color }}
          role="progressbar"
          aria-valuenow={budgetUsagePct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Budget usage"
        />
      </div>

      {/* Category chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            category={cat}
            actual={byCategory[cat].actual}
          />
        ))}
      </div>
    </div>
  );
}

interface CategoryChipProps {
  category: BudgetCategory;
  actual: number;
}

function CategoryChip({ category, actual }: CategoryChipProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs dark:border-gray-700 dark:bg-gray-900">
      <span aria-hidden="true">{CATEGORY_ICONS[category]}</span>
      <span className="text-gray-500 dark:text-gray-400">
        {category.charAt(0) + category.slice(1).toLowerCase()}
      </span>
      <span
        className="font-medium"
        style={{ color: actual > 0 ? CATEGORY_COLORS[category] : undefined }}
      >
        {actual > 0 ? `${formatVND(actual)} VND` : '-- VND'}
      </span>
    </div>
  );
}
