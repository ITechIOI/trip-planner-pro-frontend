import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import type { BudgetState, BudgetAction } from '../types/budget.types';
import {
  budgetReducer,
  initialBudgetState,
} from '../store/budget.reducer';

const STORAGE_KEY = 'trip_planner_budget';

interface BudgetContextValue {
  state: BudgetState;
  dispatch: React.Dispatch<BudgetAction>;
}

const BudgetContext = createContext<BudgetContextValue | null>(null);

function loadFromStorage(): BudgetState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BudgetState) : initialBudgetState;
  } catch {
    return initialBudgetState;
  }
}

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(budgetReducer, undefined, loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgetContext(): BudgetContextValue {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useBudgetContext must be used within BudgetProvider');
  }
  return ctx;
}