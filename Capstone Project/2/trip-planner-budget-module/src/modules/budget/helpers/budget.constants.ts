import type { BudgetCategory } from '../types/budget.types';

export const CATEGORIES: BudgetCategory[] = [
  'TRANSPORT',
  'ACCOMMODATION',
  'FOOD',
  'SHOPPING',
  'ACTIVITY',
  'OTHER',
];

export const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  TRANSPORT: '#378ADD',
  ACCOMMODATION: '#1D9E75',
  FOOD: '#E24B4A',
  SHOPPING: '#D4537E',
  ACTIVITY: '#BA7517',
  OTHER: '#7F77DD',
};

export const CATEGORY_ICONS: Record<BudgetCategory, string> = {
  TRANSPORT: '✈',
  ACCOMMODATION: '🏨',
  FOOD: '🍽',
  SHOPPING: '🛍',
  ACTIVITY: '🏃',
  OTHER: '📦',
};

export const ITEMS_PER_PAGE = 10;
export const BUDGET_WARNING_THRESHOLD = 80;
export const BUDGET_CRITICAL_THRESHOLD = 100;
