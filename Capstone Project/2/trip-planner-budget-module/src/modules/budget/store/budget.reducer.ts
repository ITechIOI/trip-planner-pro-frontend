import type { BudgetState, BudgetAction } from '../types/budget.types';

export const initialBudgetState: BudgetState = {
  budget: 10_000_000,
  expenses: [],
  nextId: 1,
};

export function budgetReducer(
  state: BudgetState,
  action: BudgetAction
): BudgetState {
  switch (action.type) {
    case 'SET_BUDGET':
      return { ...state, budget: Math.max(0, action.payload) };

    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [
          ...state.expenses,
          { ...action.payload, id: state.nextId },
        ],
        nextId: state.nextId + 1,
      };

    case 'EDIT_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };

    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload),
      };

    default:
      return state;
  }
}
