import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
