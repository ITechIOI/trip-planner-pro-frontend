import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { PaymentStatus } from '@/shared'
import {
  BUDGET_CATEGORIES,
  BUDGET_PAYMENT_STATUSES,
  buildBlankBudgetItemFormValues,
  getBudgetCategoryLabel,
  getPaymentStatusLabel,
  toBudgetItemFormValues,
  validateBudgetItemForm,
  type BudgetItemFormErrors,
  type BudgetItemFormValues,
  type BudgetItemView,
} from '../lib'

type BudgetItemFormDialogProps = {
  errorMessage?: string | null
  initialItem?: BudgetItemView | null
  isSubmitting?: boolean
  mode: 'create' | 'edit'
  open: boolean
  onClose: () => void
  onSubmit: (values: BudgetItemFormValues) => void
}

export const BudgetItemFormDialog = ({
  errorMessage,
  initialItem,
  isSubmitting = false,
  mode,
  open,
  onClose,
  onSubmit,
}: BudgetItemFormDialogProps) => {
  const [values, setValues] = useState<BudgetItemFormValues>(() =>
    initialItem
      ? toBudgetItemFormValues(initialItem)
      : buildBlankBudgetItemFormValues(),
  )
  const [errors, setErrors] = useState<BudgetItemFormErrors>({})

  const updateValue = <K extends keyof BudgetItemFormValues>(
    key: K,
    value: BudgetItemFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = () => {
    const nextErrors = validateBudgetItemForm(values)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit(values)
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={isSubmitting ? undefined : onClose}
    >
      <DialogTitle>
        {mode === 'create' ? 'Add expense' : 'Edit expense'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <TextField
            autoFocus
            error={Boolean(errors.itemName)}
            helperText={errors.itemName}
            label="Expense name"
            placeholder="e.g. Flight tickets"
            value={values.itemName}
            onChange={(event) => updateValue('itemName', event.target.value)}
          />

          <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={values.category}
              onChange={(event) =>
                updateValue(
                  'category',
                  event.target.value as BudgetItemFormValues['category'],
                )
              }
            >
              {BUDGET_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {getBudgetCategoryLabel(category)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            error={Boolean(errors.estimatedCost)}
            helperText={errors.estimatedCost}
            label="Estimated cost (VND)"
            slotProps={{ htmlInput: { min: 0 } }}
            type="number"
            value={values.estimatedCost}
            onChange={(event) =>
              updateValue('estimatedCost', event.target.value)
            }
          />

          <FormControl>
            <InputLabel>Payment status</InputLabel>
            <Select
              label="Payment status"
              value={values.paymentStatus}
              onChange={(event) =>
                updateValue(
                  'paymentStatus',
                  event.target.value as BudgetItemFormValues['paymentStatus'],
                )
              }
            >
              {BUDGET_PAYMENT_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {getPaymentStatusLabel(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            error={Boolean(errors.actualCost)}
            helperText={
              errors.actualCost ??
              (values.paymentStatus === PaymentStatus.PAID
                ? 'Required for paid expenses'
                : 'Optional for unpaid expenses')
            }
            label="Actual cost (VND)"
            placeholder={
              values.paymentStatus === PaymentStatus.PAID
                ? 'Required'
                : 'Optional'
            }
            slotProps={{ htmlInput: { min: 0 } }}
            type="number"
            value={values.actualCost}
            onChange={(event) => updateValue('actualCost', event.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button disabled={isSubmitting} variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={isSubmitting}
          variant="contained"
          onClick={handleSubmit}
        >
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Save expense'
              : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
