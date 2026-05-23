import Chip, { type ChipProps } from '@mui/material/Chip'

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive'

export type BadgeProps = Omit<ChipProps, 'variant' | 'color'> & {
  variant?: BadgeVariant
}

const variantProps: Record<
  BadgeVariant,
  Pick<ChipProps, 'variant' | 'color'>
> = {
  default: { variant: 'filled', color: 'primary' },
  secondary: { variant: 'filled', color: 'default' },
  outline: { variant: 'outlined', color: 'default' },
  destructive: { variant: 'filled', color: 'error' },
}

export const Badge = ({
  className,
  variant = 'default',
  ...props
}: BadgeProps) => (
  <Chip className={className} size="small" {...variantProps[variant]} {...props} />
)
