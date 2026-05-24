import { useState } from 'react';
import type {
  BudgetExpense,
  ExpenseFormValues,
  ExpenseFormErrors,
  BudgetCategory,
  PaymentStatus,
} from '../types/budget.types';
import { CATEGORIES } from '../helpers/budget.constants';
import { validateExpenseForm } from '../helpers/budget.calculations';
import { FormField } from './FormField';

type ExpenseFormInput = Omit<BudgetExpense, 'id'>;

interface ExpenseFormProps {
  initial?: BudgetExpense;
  onSave: (data: ExpenseFormInput) => void;
  onCancel: () => void;
}

const BLANK_FORM: ExpenseFormValues = {
  name: '',
  category: 'TRANSPORT',
  estimated_cost: '',
  actual_cost: '',
  payment_status: 'UNPAID',
};

function toFormValues(expense: BudgetExpense): ExpenseFormValues {
  return {
    name: expense.name,
    category: expense.category,
    estimated_cost: String(expense.estimated_cost),
    actual_cost: expense.actual_cost === 0 ? '' : String(expense.actual_cost),
    payment_status: expense.payment_status,
  };
}

export function ExpenseForm({ initial, onSave, onCancel }: ExpenseFormProps) {
  const [form, setForm] = useState<ExpenseFormValues>(
    initial ? toFormValues(initial) : BLANK_FORM
  );
  const [errors, setErrors] = useState<ExpenseFormErrors>({});

  function set<K extends keyof ExpenseFormValues>(key: K, value: ExpenseFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear field error on change
    if (errors[key as keyof ExpenseFormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleSubmit() {
    const validationErrors = validateExpenseForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors as ExpenseFormErrors);
      return;
    }
    onSave({
      name: form.name.trim(),
      category: form.category as BudgetCategory,
      estimated_cost: Number(form.estimated_cost) || 0,
      actual_cost: form.actual_cost === '' ? 0 : Number(form.actual_cost),
      payment_status: form.payment_status as PaymentStatus,
    });
  }

  return (
    <div>
      <FormField label="Expense name" error={errors.name} required>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Flight tickets"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </FormField>

      <FormField label="Category">
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value as BudgetCategory)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Estimated cost (VND)" error={errors.estimated_cost} required>
        <input
          type="number"
          min={0}
          value={form.estimated_cost}
          onChange={(e) => set('estimated_cost', e.target.value)}
          placeholder="0"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </FormField>

      <FormField label="Payment status">
        <select
          value={form.payment_status}
          onChange={(e) => set('payment_status', e.target.value as PaymentStatus)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="UNPAID">UNPAID</option>
          <option value="PAID">PAID</option>
        </select>
      </FormField>

      <FormField
        label="Actual cost (VND)"
        error={errors.actual_cost}
        required={form.payment_status === 'PAID'}
      >
        <input
          type="number"
          min={0}
          value={form.actual_cost}
          onChange={(e) => set('actual_cost', e.target.value)}
          placeholder={form.payment_status === 'PAID' ? 'Required' : 'Optional'}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </FormField>

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
          onClick={handleSubmit}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Save expense
        </button>
      </div>
    </div>
  );
}
