import { useMemo } from 'react';
import { useBudgetContext } from '../context/BudgetContext';
import { calcBudgetTotals } from '../helpers/budget.calculations';
import type { BudgetTotals } from '../types/budget.types';

export function useBudgetTotals(): BudgetTotals {
  const { state } = useBudgetContext();
  return useMemo(() => calcBudgetTotals(state), [state]);
}
