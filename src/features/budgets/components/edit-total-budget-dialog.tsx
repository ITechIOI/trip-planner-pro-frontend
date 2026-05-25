import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { validateBudgetTotal } from '../lib'

type EditTotalBudgetDialogProps = {
  currentBudget?: number | null
  errorMessage?: string | null
  isSubmitting?: boolean
  open: boolean
  onClose: () => void
  onSubmit: (value: number) => void
}

export const EditTotalBudgetDialog = ({
  currentBudget,
  errorMessage,
  isSubmitting = false,
  open,
  onClose,
  onSubmit,
}: EditTotalBudgetDialogProps) => {
  const [value, setValue] = useState(String(currentBudget ?? 0))
  const [error, setError] = useState<string | undefined>()

  const handleSubmit = () => {
    const errors = validateBudgetTotal(value)

    if (errors.totalBudget) {
      setError(errors.totalBudget)
      return
    }

    onSubmit(Number(value))
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={isSubmitting ? undefined : onClose}
    >
      <DialogTitle>Edit budget</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          <TextField
            autoFocus
            error={Boolean(error)}
            helperText={error}
            label="Total budget (VND)"
            slotProps={{ htmlInput: { min: 0 } }}
            type="number"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              setError(undefined)
            }}
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
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
