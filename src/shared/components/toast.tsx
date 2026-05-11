import { Alert, Snackbar } from '@mui/material'
import { toastDurations, useToastStore } from '@/shared/components/toast-store'

export const ToastProvider = () => {
  const toast = useToastStore((state) => state.toast)
  const hideToast = useToastStore((state) => state.hideToast)

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      autoHideDuration={toast ? toastDurations[toast.severity] : undefined}
      key={toast?.id}
      onClose={(_event, reason) => {
        if (reason !== 'clickaway') {
          hideToast()
        }
      }}
      open={Boolean(toast)}
      sx={{ mt: 8 }}
    >
      {toast ? (
        <Alert
          onClose={hideToast}
          role={toast.severity === 'error' ? 'alert' : 'status'}
          severity={toast.severity}
          slotProps={{ closeButton: { 'aria-label': 'Close notification' } }}
          sx={{ alignItems: 'center', fontWeight: 700, minWidth: 280 }}
          variant="filled"
        >
          {toast.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  )
}
