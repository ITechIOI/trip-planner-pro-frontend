import {
  createContext,
  isValidElement,
  useContext,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import {
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'

type MenuContextValue = {
  open: boolean
  anchorEl: HTMLElement | null
  setAnchorEl: (element: HTMLElement | null) => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

function useMenuContext(component: string): MenuContextValue {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error(`${component} must be used within DropdownMenu`)
  }
  return context
}

export type DropdownMenuProps = {
  children: ReactNode
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  return (
    <MenuContext.Provider
      value={{
        open: Boolean(anchorEl),
        anchorEl,
        setAnchorEl,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export type DropdownMenuTriggerProps = {
  asChild?: boolean
  children: ReactElement
}

export const DropdownMenuTrigger = ({
  asChild,
  children,
}: DropdownMenuTriggerProps) => {
  const { setAnchorEl } = useMenuContext('DropdownMenuTrigger')

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      onClick?: (event: MouseEvent<HTMLElement>) => void
    }>

    return (
      <child.type
        {...child.props}
        onClick={(event: MouseEvent<HTMLElement>) => {
          child.props.onClick?.(event)
          handleClick(event)
        }}
      />
    )
  }

  return (
    <button type="button" onClick={handleClick}>
      {children}
    </button>
  )
}

export type DropdownMenuContentProps = {
  align?: 'start' | 'end'
  className?: string
  children: ReactNode
}

export const DropdownMenuContent = ({
  align = 'start',
  className,
  children,
}: DropdownMenuContentProps) => {
  const { open, anchorEl, setAnchorEl } = useMenuContext('DropdownMenuContent')

  return (
    <Menu
      className={className}
      anchorEl={anchorEl}
      open={open}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: align === 'end' ? 'right' : 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: align === 'end' ? 'right' : 'left',
      }}
    >
      {children}
    </Menu>
  )
}

export type DropdownMenuLabelProps = {
  className?: string
  children: ReactNode
}

export const DropdownMenuLabel = ({
  className,
  children,
}: DropdownMenuLabelProps) => (
  <MenuItem disabled className={className} sx={{ opacity: 1 }}>
    <Typography variant="subtitle2">{children}</Typography>
  </MenuItem>
)

export const DropdownMenuSeparator = () => <Divider />

export type DropdownMenuItemProps = {
  className?: string
  children: ReactNode
  onClick?: () => void
}

export const DropdownMenuItem = ({
  className,
  children,
  onClick,
}: DropdownMenuItemProps) => {
  const { setAnchorEl } = useMenuContext('DropdownMenuItem')

  return (
    <MenuItem
      className={className}
      onClick={() => {
        onClick?.()
        setAnchorEl(null)
      }}
    >
      <ListItemText primary={children} />
    </MenuItem>
  )
}
