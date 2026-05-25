import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'

export type ConfirmActionDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  confirmColor?: 'primary' | 'error'
  errorMessage?: string | null
  isPending?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const ConfirmActionDialog = ({
  open,
  title,
  description,
  confirmLabel,
  confirmColor = 'primary',
  errorMessage,
  isPending = false,
  onCancel,
  onConfirm,
}: ConfirmActionDialogProps) => (
  <Dialog
    open={open}
    onClose={isPending ? undefined : onCancel}
    fullWidth
    maxWidth="xs"
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography color="text.secondary">{description}</Typography>
      {errorMessage ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      ) : null}
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button variant="outlined" onClick={onCancel} disabled={isPending}>
        Cancel
      </Button>
      <Button
        variant="contained"
        color={confirmColor}
        onClick={onConfirm}
        disabled={isPending}
      >
        {isPending ? 'Processing...' : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
)
