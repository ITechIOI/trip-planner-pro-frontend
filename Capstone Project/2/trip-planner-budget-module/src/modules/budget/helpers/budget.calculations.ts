import type {
  BudgetState,
  BudgetTotals,
  BudgetCategory,
  CategoryTotals,
} from '../types/budget.types';
import { CATEGORIES } from './budget.constants';

export function calcBudgetTotals(state: BudgetState): BudgetTotals {
  const totalEstimated = state.expenses.reduce(
    (sum, e) => sum + (e.estimated_cost ?? 0),
    0
  );

  const totalActual = state.expenses.reduce(
    (sum, e) => sum + (e.actual_cost ?? 0),
    0
  );

  const remaining = state.budget - totalActual;

  const unpaidCount = state.expenses.filter(
    (e) => e.payment_status === 'UNPAID'
  ).length;

  const totalCount = state.expenses.length;

  const unpaidPct =
    totalCount > 0 ? Math.round((unpaidCount / totalCount) * 100) : 0;

  const byCategory = Object.fromEntries(
    CATEGORIES.map((cat) => {
      const catExpenses = state.expenses.filter((e) => e.category === cat);
      const totals: CategoryTotals = {
        estimated: catExpenses.reduce((s, e) => s + (e.estimated_cost ?? 0), 0),
        actual: catExpenses.reduce((s, e) => s + (e.actual_cost ?? 0), 0),
      };
      return [cat, totals];
    })
  ) as Record<BudgetCategory, CategoryTotals>;

  const budgetUsagePct =
    state.budget > 0 ? Math.round((totalActual / state.budget) * 100) : 0;

  return {
    totalEstimated,
    totalActual,
    remaining,
    unpaidCount,
    totalCount,
    unpaidPct,
    byCategory,
    budgetUsagePct,
  };
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
}

export function calcExpenseDiff(
  estimated: number,
  actual: number
): { diff: number; label: string; isOver: boolean; isUnder: boolean } {
  const diff = actual - estimated;
  const isOver = diff > 0;
  const isUnder = diff < 0;
  const label =
    diff === 0
      ? '—'
      : `${isOver ? '▲' : '▼'} ${formatVND(Math.abs(diff))} VND`;
  return { diff, label, isOver, isUnder };
}

export function validateExpenseForm(values: {
  name: string;
  estimated_cost: string;
  actual_cost: string;
  payment_status: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.name.trim()) {
    errors.name = 'Expense name cannot be empty';
  }

  if (values.estimated_cost === '' || Number(values.estimated_cost) < 0) {
    errors.estimated_cost = 'Must be 0 or greater';
  }

  if (
    values.payment_status === 'PAID' &&
    (values.actual_cost === '' || values.actual_cost === null)
  ) {
    errors.actual_cost = 'Actual cost is required when status is PAID';
  }

  if (values.actual_cost !== '' && Number(values.actual_cost) < 0) {
    errors.actual_cost = 'Actual cost cannot be negative';
  }

  return errors;
}

export function validateBudget(value: string): string | null {
  if (!value || Number(value) < 0) {
    return 'Budget must be 0 or greater';
  }
  return null;
}
