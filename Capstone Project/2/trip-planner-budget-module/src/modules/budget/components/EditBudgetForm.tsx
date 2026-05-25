import { useState } from 'react';
import { validateBudget } from '../helpers/budget.calculations';
import { FormField } from './FormField';

interface EditBudgetFormProps {
  currentBudget: number;
  onSave: (value: number) => void;
  onCancel: () => void;
}

export function EditBudgetForm({
  currentBudget,
  onSave,
  onCancel,
}: EditBudgetFormProps) {
  const [value, setValue] = useState(String(currentBudget));
  const [error, setError] = useState<string | undefined>();

  function handleSubmit() {
    const err = validateBudget(value);
    if (err) {
      setError(err);
      return;
    }
    onSave(Number(value));
  }

  return (
    <div>
      <FormField label="Total budget (VND)" error={error} required>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(undefined);
          }}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          autoFocus
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
          Save budget
        </button>
      </div>
    </div>
  );
}
