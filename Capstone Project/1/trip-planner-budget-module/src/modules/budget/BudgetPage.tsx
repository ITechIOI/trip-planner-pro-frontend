import { useState } from 'react';
import type {
  BudgetExpense,
  ModalType,
  CategoryFilter,
  StatusFilter,
} from '../budget/types/budget.types';
import { useBudgetContext } from '../budget/context/BudgetContext';
import { useBudgetTotals } from '../budget/hooks/useBudgetTotals';
import { useFilteredExpenses } from '../budget/hooks/useFilteredExpenses';

import { UnpaidRing } from '../budget/components/UnpaidRing';
import { BudgetSummaryCards } from '../budget/components/BudgetSummaryCards';
import { BudgetProgress } from '../budget/components/BudgetProgress';
import { BudgetAlertBanner } from '../budget/components/BudgetAlertBanner';
import { CategoryTotalsPanel } from '../budget/components/CategoryTotalsPanel';
import { ExpenseFilters } from '../budget/components/ExpenseFilters';
import { ExpenseList } from '../budget/components/ExpenseList';
import { Modal } from '../budget/components/Modal';
import { ExpenseForm } from '../budget/components/ExpenseForm';
import { EditBudgetForm } from '../budget/components/EditBudgetForm';
import { DeleteConfirmModal } from '../budget/components/DeleteConfirmModal';

export function BudgetPage() {
  const { state, dispatch } = useBudgetContext();
  const totals = useBudgetTotals();

  // UI state
  const [modal, setModal] = useState<ModalType>(null);
  const [editTarget, setEditTarget] = useState<BudgetExpense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BudgetExpense | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const filteredExpenses = useFilteredExpenses({
    expenses: state.expenses,
    search,
    categoryFilter,
    statusFilter,
  });

  // Handlers
  function handleAddExpense(data: Omit<BudgetExpense, 'id'>) {
    dispatch({ type: 'ADD_EXPENSE', payload: data });
    setModal(null);
  }

  function handleEditExpense(data: Omit<BudgetExpense, 'id'>) {
    if (!editTarget) return;
    dispatch({ type: 'EDIT_EXPENSE', payload: { ...data, id: editTarget.id } });
    setModal(null);
    setEditTarget(null);
  }

  function handleDeleteExpense() {
    if (!deleteTarget) return;
    dispatch({ type: 'DELETE_EXPENSE', payload: deleteTarget.id });
    setDeleteTarget(null);
  }

  function handleSetBudget(value: number) {
    dispatch({ type: 'SET_BUDGET', payload: value });
    setModal(null);
  }

  function openEditModal(expense: BudgetExpense) {
    setEditTarget(expense);
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setEditTarget(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* ── Modals ── */}
      {modal === 'add' && (
        <Modal title="Add expense" onClose={closeModal}>
          <ExpenseForm onSave={handleAddExpense} onCancel={closeModal} />
        </Modal>
      )}

      {modal === 'edit' && editTarget && (
        <Modal title="Edit expense" onClose={closeModal}>
          <ExpenseForm
            initial={editTarget}
            onSave={handleEditExpense}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modal === 'budget' && (
        <Modal title="Edit budget" onClose={closeModal}>
          <EditBudgetForm
            currentBudget={state.budget}
            onSave={handleSetBudget}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          expense={deleteTarget}
          onConfirm={handleDeleteExpense}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Page header ── */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
            Budget
          </h1>
          <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
            Track and manage your trip expenses
          </p>
        </div>

        <div className="flex items-center gap-4">
          <UnpaidRing
            pct={totals.unpaidPct}
            unpaidCount={totals.unpaidCount}
            totalCount={totals.totalCount}
          />
          <button
            type="button"
            onClick={() => setModal('add')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* ── Alert banner ── */}
      <BudgetAlertBanner budgetUsagePct={totals.budgetUsagePct} />

      {/* ── Summary cards ── */}
      <div className="mb-3">
        <BudgetSummaryCards
          budget={state.budget}
          totalEstimated={totals.totalEstimated}
          totalActual={totals.totalActual}
          remaining={totals.remaining}
          onEditBudget={() => setModal('budget')}
        />
      </div>

      {/* ── Progress bar + category chips ── */}
      <div className="mb-3">
        <BudgetProgress
          budgetUsagePct={totals.budgetUsagePct}
          totalActual={totals.totalActual}
          budget={state.budget}
          byCategory={totals.byCategory}
        />
      </div>

      {/* ── Category donut chart (collapsible) ── */}
      <div className="mb-4">
        <CategoryTotalsPanel byCategory={totals.byCategory} />
      </div>

      {/* ── Search + filters ── */}
      <div className="mb-3">
        <ExpenseFilters
          search={search}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {/* ── Expense list ── */}
      <ExpenseList
        expenses={filteredExpenses}
        hasAnyExpenses={state.expenses.length > 0}
        onEdit={openEditModal}
        onDelete={setDeleteTarget}
        resetDeps={[search, categoryFilter, statusFilter]}
      />
    </div>
  );
}
