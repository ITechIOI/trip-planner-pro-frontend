import { forwardRef } from 'react'
import TextField, { type TextFieldProps } from '@mui/material/TextField'

export type InputProps = Omit<TextFieldProps, 'variant'> & {
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = 'small', fullWidth = true, ...props }, ref) => (
    <TextField
      inputRef={ref}
      className={className}
      size={size}
      fullWidth={fullWidth}
      {...props}
    />
  ),
)

Input.displayName = 'Input'
