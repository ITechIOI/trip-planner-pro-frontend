import type { BudgetExpense } from '../types/budget.types';
import { Modal } from './Modal';

interface DeleteConfirmModalProps {
  expense: BudgetExpense;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  expense,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <Modal title="Delete expense" onClose={onCancel}>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Are you sure you want to delete{' '}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          "{expense.name}"
        </span>
        ? This action cannot be undone.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 active:scale-[0.98]"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
