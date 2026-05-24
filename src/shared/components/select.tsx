import {
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent,
} from '@mui/material'

export type SelectItemData = {
  value: string
  label: ReactNode
}

type SelectContextValue = {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  setPlaceholder: (placeholder: string | undefined) => void
  items: SelectItemData[]
  setItems: (items: SelectItemData[]) => void
}

const SelectContext = createContext<SelectContextValue | null>(null)

function useSelectContext(component: string): SelectContextValue {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error(`${component} must be used within Select`)
  }
  return context
}

export type SelectProps = {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
}

export const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [placeholder, setPlaceholder] = useState<string | undefined>(undefined)
  const [items, setItems] = useState<SelectItemData[]>([])

  const contextValue = useMemo(
    () => ({
      value,
      onValueChange,
      placeholder,
      setPlaceholder,
      items,
      setItems,
    }),
    [value, onValueChange, placeholder, items],
  )

  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  )
}

export type SelectTriggerProps = {
  className?: string
  children: ReactNode
}

export const SelectTrigger = ({ className, children }: SelectTriggerProps) => {
  const { value, onValueChange, placeholder, items } =
    useSelectContext('SelectTrigger')

  return (
    <>
      {children}
      <FormControl className={className} size="small" sx={{ minWidth: 140 }}>
        <InputLabel shrink>{placeholder}</InputLabel>
        <MuiSelect
          label={placeholder}
          value={value}
          displayEmpty
          onChange={(event: SelectChangeEvent) =>
            onValueChange(event.target.value)
          }
        >
          {items.map((item) => (
            <MenuItem key={item.value || '__empty__'} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    </>
  )
}

export type SelectValueProps = {
  placeholder?: string
}

export const SelectValue = ({ placeholder }: SelectValueProps) => {
  const { setPlaceholder } = useSelectContext('SelectValue')

  useEffect(() => {
    setPlaceholder(placeholder)
  }, [placeholder, setPlaceholder])

  return null
}

export type SelectContentProps = {
  children: ReactNode
}

export const SelectContent = ({ children }: SelectContentProps) => {
  const { setItems } = useSelectContext('SelectContent')

  const items = useMemo(() => {
    const parsed: SelectItemData[] = []

    for (const child of Array.isArray(children) ? children : [children]) {
      if (isValidElement(child) && child.type === SelectItem) {
        const element = child as ReactElement<SelectItemProps>
        parsed.push({
          value: element.props.value,
          label: element.props.children,
        })
      }
    }

    return parsed
  }, [children])

  useEffect(() => {
    setItems(items)
  }, [items, setItems])

  return null
}

export type SelectItemProps = {
  value: string
  children: ReactNode
}

export const SelectItem = ({ value, children }: SelectItemProps) => (
  <MenuItem value={value}>{children}</MenuItem>
)
