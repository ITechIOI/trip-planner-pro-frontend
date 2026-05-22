import { cn } from '@/lib/utils'

const variantClasses = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-muted text-muted-foreground',
  outline: 'border border-border text-foreground',
  destructive: 'bg-destructive text-white',
}

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
