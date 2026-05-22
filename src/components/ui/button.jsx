import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const variantClasses = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  ghost: 'hover:bg-muted text-foreground',
  outline: 'border border-border bg-transparent hover:bg-muted',
}

const sizeClasses = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-sm',
  icon: 'h-9 w-9 p-0',
}

export const Button = forwardRef(
  ({ className, variant = 'default', size = 'default', asChild, children, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
      variantClasses[variant],
      sizeClasses[size],
      className,
    )

    if (asChild && children && typeof children === 'object' && 'props' in children) {
      const child = children
      return (
        <child.type
          {...child.props}
          {...props}
          className={cn(classes, child.props.className)}
        />
      )
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
