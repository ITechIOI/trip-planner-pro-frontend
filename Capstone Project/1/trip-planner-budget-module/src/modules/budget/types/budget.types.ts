export type BudgetCategory =
  | 'TRANSPORT'
  | 'ACCOMMODATION'
  | 'FOOD'
  | 'SHOPPING'
  | 'ACTIVITY'
  | 'OTHER';

export type PaymentStatus = 'PAID' | 'UNPAID';

export interface BudgetExpense {
  id: number;
  name: string;
  category: BudgetCategory;
  estimated_cost: number;
  actual_cost: number;
  payment_status: PaymentStatus;
}

export interface BudgetState {
  budget: number;
  expenses: BudgetExpense[];
  nextId: number;
}

export type BudgetAction =
  | { type: 'SET_BUDGET'; payload: number }
  | { type: 'ADD_EXPENSE'; payload: Omit<BudgetExpense, 'id'> }
  | { type: 'EDIT_EXPENSE'; payload: BudgetExpense }
  | { type: 'DELETE_EXPENSE'; payload: number };

export interface CategoryTotals {
  estimated: number;
  actual: number;
}

export interface BudgetTotals {
  totalEstimated: number;
  totalActual: number;
  remaining: number;
  unpaidCount: number;
  totalCount: number;
  unpaidPct: number;
  byCategory: Record<BudgetCategory, CategoryTotals>;
  budgetUsagePct: number;
}

export interface ExpenseFormValues {
  name: string;
  category: BudgetCategory;
  estimated_cost: string;
  actual_cost: string;
  payment_status: PaymentStatus;
}

export interface ExpenseFormErrors {
  name?: string;
  estimated_cost?: string;
  actual_cost?: string;
}

export type ModalType = 'add' | 'edit' | 'budget' | null;

export type CategoryFilter = BudgetCategory | 'ALL';
export type StatusFilter = PaymentStatus | 'ALL';
