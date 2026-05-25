import {
  BUDGET_WARNING_THRESHOLD,
  BUDGET_CRITICAL_THRESHOLD,
} from '../helpers/budget.constants';

interface BudgetAlertBannerProps {
  budgetUsagePct: number;
}

export function BudgetAlertBanner({ budgetUsagePct }: BudgetAlertBannerProps) {
  if (budgetUsagePct >= BUDGET_CRITICAL_THRESHOLD) {
    return (
      <div
        className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 dark:border-red-900 dark:bg-red-950/50"
        role="alert"
      >
        <span aria-hidden="true">🚨</span>
        <p className="text-sm font-medium text-red-700 dark:text-red-400">
          Budget exceeded! Total actual cost has reached 100% of your budget.
        </p>
      </div>
    );
  }

  if (budgetUsagePct >= BUDGET_WARNING_THRESHOLD) {
    return (
      <div
        className="mb-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-900 dark:bg-amber-950/50"
        role="alert"
      >
        <span aria-hidden="true">⚠️</span>
        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
          Warning: You have used {budgetUsagePct}% of your budget.
        </p>
      </div>
    );
  }

  return null;
}
