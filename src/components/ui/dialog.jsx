import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'


const DialogContext = createContext(null)

export function Dialog({ open,
  onOpenChange,
  children,
 }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('Dialog components must be used within Dialog')
  return ctx
}

export function DialogContent({ className,
  children,
 }) {
  const { open, onOpenChange } = useDialog()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ className, children  }) {
  return <div className={cn('mb-4 space-y-1', className)}>{children}</div>
}

export function DialogTitle({ className, children  }) {
  return <h2 className={cn('text-lg font-semibold text-foreground', className)}>{children}</h2>
}

export function DialogDescription({ className,
  children,
 }) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}

export function DialogFooter({ className, children  }) {
  return (
    <div className={cn('mt-6 flex justify-end gap-2', className)}>{children}</div>
  )
}
