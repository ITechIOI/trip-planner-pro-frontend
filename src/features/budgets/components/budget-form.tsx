import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BudgetCategory, PaymentStatus, type BudgetResponse } from '@/shared'
import { Button, FieldError } from '@/shared/components/ui'
import {
  budgetCategoryOptions,
  paymentStatusOptions,
} from '@/shared/lib/domain'
import {
  type BudgetFormValues,
  budgetSchema,
} from '@/features/budgets/lib/budget-schema'

type BudgetFormProps = {
  item?: BudgetResponse
  isPending?: boolean
  hasSubmitError?: boolean
  onClose: () => void
  onSubmit: (values: BudgetFormValues) => void
}

export const BudgetForm = ({
  item,
  isPending = false,
  hasSubmitError = false,
  onClose,
  onSubmit,
}: BudgetFormProps) => {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      itemName: item?.itemName ?? '',
      category: item?.category ?? BudgetCategory.OTHER,
      estimatedCost: item?.estimatedCost ?? 0,
      actualCost: item?.actualCost ?? undefined,
      paymentStatus: item?.paymentStatus ?? PaymentStatus.UNPAID,
    },
  })

  useEffect(() => {
    form.reset({
      itemName: item?.itemName ?? '',
      category: item?.category ?? BudgetCategory.OTHER,
      estimatedCost: item?.estimatedCost ?? 0,
      actualCost: item?.actualCost ?? undefined,
      paymentStatus: item?.paymentStatus ?? PaymentStatus.UNPAID,
    })
  }, [form, item])

  return (
    <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)}>
      <label className="field">
        <span>Item name</span>
        <input type="text" {...form.register('itemName')} />
        <FieldError message={form.formState.errors.itemName?.message} />
      </label>

      <div className="form-grid">
        <label className="field">
          <span>Estimated cost</span>
          <input
            inputMode="numeric"
            min="0"
            type="number"
            {...form.register('estimatedCost', { valueAsNumber: true })}
          />
          <FieldError message={form.formState.errors.estimatedCost?.message} />
        </label>
        <label className="field">
          <span>Actual cost</span>
          <input
            inputMode="numeric"
            min="0"
            type="number"
            {...form.register('actualCost', {
              setValueAs: (value) =>
                value === '' ? undefined : Number(value),
            })}
          />
          <FieldError message={form.formState.errors.actualCost?.message} />
        </label>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Category</span>
          <select {...form.register('category')}>
            {budgetCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Payment status</span>
          <select {...form.register('paymentStatus')}>
            {paymentStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {hasSubmitError ? (
        <p className="form-error" role="alert">
          Budget item could not be saved. Please retry.
        </p>
      ) : null}

      <div className="form-actions">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'Saving...' : item ? 'Save cost' : 'Add cost'}
        </Button>
      </div>
    </form>
  )
}
