import { createContext, useContext, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'


const SelectContext = createContext(null)

function useSelect() {
  const ctx = useContext(SelectContext)
  if (!ctx) throw new Error('Select components must be used within Select')
  return ctx
}

export function Select({ value,
  onValueChange,
  children,
 }) {
  const [open, setOpen] = useState(false)
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ className,
  children,
 }) {
  const { setOpen, open } = useSelect()
  return (
    <button
      type="button"
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-sm',
        className,
      )}
      onClick={() => setOpen(!open)}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export function SelectValue({ placeholder  }) {
  const { value } = useSelect()
  return <span>{value || placeholder}</span>
}

export function SelectContent({ children  }) {
  const { open, setOpen } = useSelect()
  if (!open) return null
  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40"
        aria-label="Close select"
        onClick={() => setOpen(false)}
      />
      <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card py-1 shadow-lg">
        {children}
      </div>
    </>
  )
}

export function SelectItem({ value,
  children,
 }) {
  const { onValueChange, setOpen, value: selected } = useSelect()
  return (
    <button
      type="button"
      className={cn(
        'flex w-full px-3 py-2 text-left text-sm hover:bg-muted',
        selected === value && 'bg-muted font-medium',
      )}
      onClick={() => {
        onValueChange(value)
        setOpen(false)
      }}
    >
      {children}
    </button>
  )
}
