import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent as MuiDialogContent,
  DialogTitle as MuiDialogTitle,
  Typography,
} from '@mui/material'

type DialogContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

function useDialogContext(component: string): DialogContextValue {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error(`${component} must be used within Dialog`)
  }
  return context
}

export type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => (
  <DialogContext.Provider value={{ open, onOpenChange }}>
    {children}
  </DialogContext.Provider>
)

export type DialogContentProps = {
  className?: string
  children: ReactNode
}

export const DialogContent = ({ className, children }: DialogContentProps) => {
  const { open, onOpenChange } = useDialogContext('DialogContent')

  return (
    <MuiDialog
      className={className}
      open={open}
      onClose={() => onOpenChange(false)}
      fullWidth
      maxWidth="sm"
    >
      <MuiDialogContent>{children}</MuiDialogContent>
    </MuiDialog>
  )
}

export type DialogHeaderProps = {
  className?: string
  children: ReactNode
}

export const DialogHeader = ({ className, children }: DialogHeaderProps) => (
  <div className={className}>{children}</div>
)

export type DialogTitleProps = {
  className?: string
  children: ReactNode
}

export const DialogTitle = ({ className, children }: DialogTitleProps) => (
  <MuiDialogTitle className={className}>{children}</MuiDialogTitle>
)

export type DialogDescriptionProps = {
  className?: string
  children: ReactNode
}

export const DialogDescription = ({
  className,
  children,
}: DialogDescriptionProps) => (
  <Typography className={className} variant="body2" color="text.secondary">
    {children}
  </Typography>
)

export type DialogFooterProps = {
  className?: string
  children: ReactNode
}

export const DialogFooter = ({ className, children }: DialogFooterProps) => (
  <DialogActions className={className}>{children}</DialogActions>
)
