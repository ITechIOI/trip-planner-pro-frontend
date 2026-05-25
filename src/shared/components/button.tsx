import { forwardRef } from 'react'
import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button'

export type ButtonVariant = 'default' | 'ghost' | 'outline'
export type ButtonSize = 'default' | 'sm' | 'icon'

export type ButtonProps = Omit<MuiButtonProps, 'variant' | 'size'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const variantMap: Record<ButtonVariant, MuiButtonProps['variant']> = {
  default: 'contained',
  ghost: 'text',
  outline: 'outlined',
}

const sizeMap: Record<ButtonSize, MuiButtonProps['size']> = {
  default: 'medium',
  sm: 'small',
  icon: 'small',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild,
      children,
      sx,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
      return <>{children}</>
    }

    return (
      <MuiButton
        ref={ref}
        className={className}
        variant={variantMap[variant]}
        size={sizeMap[size]}
        sx={{
          ...(size === 'icon' ? { minWidth: 36, width: 36, height: 36, p: 0 } : {}),
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiButton>
    )
  },
)

Button.displayName = 'Button'
