import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Stack, TextField } from '@mui/material'
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
  onClose: () => void
  onSubmit: (values: BudgetFormValues) => void
}

export const BudgetForm = ({
  item,
  isPending = false,
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
    <Box
      className="form-stack"
      component="form"
      onSubmit={form.handleSubmit(onSubmit)}
      sx={{ display: 'grid', gap: 2 }}
    >
      <TextField
        error={Boolean(form.formState.errors.itemName)}
        helperText={<FieldError message={form.formState.errors.itemName?.message} />}
        label="Item name"
        {...form.register('itemName')}
      />

      <Box
        className="form-grid"
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <TextField
          error={Boolean(form.formState.errors.estimatedCost)}
          helperText={<FieldError message={form.formState.errors.estimatedCost?.message} />}
          label="Estimated cost"
          slotProps={{ htmlInput: { inputMode: 'numeric', min: 0 } }}
          type="number"
          {...form.register('estimatedCost', { valueAsNumber: true })}
        />
        <TextField
          error={Boolean(form.formState.errors.actualCost)}
          helperText={<FieldError message={form.formState.errors.actualCost?.message} />}
          label="Actual cost"
          slotProps={{ htmlInput: { inputMode: 'numeric', min: 0 } }}
          type="number"
          {...form.register('actualCost', {
            setValueAs: (value) => (value === '' ? undefined : Number(value)),
          })}
        />
      </Box>

      <Box
        className="form-grid"
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <TextField
          label="Category"
          select
          slotProps={{ select: { native: true } }}
          {...form.register('category')}
        >
          {budgetCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          label="Payment status"
          select
          slotProps={{ select: { native: true } }}
          {...form.register('paymentStatus')}
        >
          {paymentStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Box>

      <Stack className="form-actions" direction="row" spacing={1.25} sx={{ justifyContent: 'flex-end', pt: 1 }}>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'Saving...' : item ? 'Save cost' : 'Add cost'}
        </Button>
      </Stack>
    </Box>
  )
}
