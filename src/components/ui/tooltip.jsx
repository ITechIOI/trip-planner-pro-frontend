import { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

const TooltipContext = createContext(null)

export function TooltipProvider({ children }) {
  return <>{children}</>
}

export function Tooltip({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  )
}

export function TooltipTrigger({ asChild, children }) {
  const ctx = useContext(TooltipContext)
  if (!ctx) return children

  const handlers = {
    onMouseEnter: () => ctx.setOpen(true),
    onMouseLeave: () => ctx.setOpen(false),
    onFocus: () => ctx.setOpen(true),
    onBlur: () => ctx.setOpen(false),
  }

  if (asChild) {
    const child = children
    return <child.type {...child.props} {...handlers} />
  }

  return <span {...handlers}>{children}</span>
}

export function TooltipContent({ side = 'top', className, children }) {
  const ctx = useContext(TooltipContext)
  if (!ctx?.open) return null

  return (
    <div
      className={cn(
        'absolute z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background whitespace-nowrap',
        side === 'right'
          ? 'left-full ml-2 top-1/2 -translate-y-1/2'
          : 'bottom-full mb-2 left-1/2 -translate-x-1/2',
        className,
      )}
    >
      {children}
    </div>
  )
}
