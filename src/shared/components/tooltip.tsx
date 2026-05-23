import { useState, type ReactElement, type ReactNode } from 'react'
import MuiTooltip from '@mui/material/Tooltip'

export type TooltipProviderProps = {
  children: ReactNode
}

export const TooltipProvider = ({ children }: TooltipProviderProps) => (
  <>{children}</>
)

export type TooltipProps = {
  children: ReactNode
}

export const Tooltip = ({ children }: TooltipProps) => <>{children}</>

export type TooltipTriggerProps = {
  asChild?: boolean
  children: ReactElement
}

export const TooltipTrigger = ({ children }: TooltipTriggerProps) => children

export type TooltipContentProps = {
  side?: 'top' | 'right'
  className?: string
  children: ReactNode
}

export const TooltipContent = ({
  className,
  children,
}: TooltipContentProps) => (
  <span className={className}>{children}</span>
)

export type TooltipWrapProps = {
  title: ReactNode
  children: ReactElement
}

export const TooltipWrap = ({ title, children }: TooltipWrapProps) => {
  const [open, setOpen] = useState(false)

  return (
    <MuiTooltip
      title={title}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      {children}
    </MuiTooltip>
  )
}
