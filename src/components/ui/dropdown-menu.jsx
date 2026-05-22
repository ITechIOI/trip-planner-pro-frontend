import { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

const MenuContext = createContext(null)

function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('DropdownMenu components must be used within DropdownMenu')
  return ctx
}

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </MenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ asChild, children }) {
  const { open, setOpen } = useMenu()
  const toggle = () => setOpen(!open)

  if (asChild) {
    const child = children
    return (
      <child.type
        {...child.props}
        onClick={(e) => {
          child.props.onClick?.(e)
          toggle()
        }}
      />
    )
  }

  return (
    <button type="button" onClick={toggle}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({ align = 'start', className, children }) {
  const { open, setOpen } = useMenu()
  if (!open) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          'absolute z-50 mt-2 min-w-[12rem] rounded-lg border border-border bg-card py-1 shadow-lg',
          align === 'end' ? 'right-0' : 'left-0',
          className,
        )}
      >
        {children}
      </div>
    </>
  )
}

export function DropdownMenuLabel({ className, children }) {
  return (
    <div className={cn('px-3 py-2 text-sm font-semibold text-foreground', className)}>
      {children}
    </div>
  )
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-border" />
}

export function DropdownMenuItem({ className, children, onClick }) {
  const { setOpen } = useMenu()
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center px-3 py-2 text-left text-sm hover:bg-muted',
        className,
      )}
      onClick={() => {
        onClick?.()
        setOpen(false)
      }}
    >
      {children}
    </button>
  )
}
