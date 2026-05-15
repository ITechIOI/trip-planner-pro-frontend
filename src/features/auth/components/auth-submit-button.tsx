import type { ReactNode } from 'react'
import { Button } from '@mui/material'
import type { ButtonProps } from '@mui/material/Button'

type AuthSubmitButtonProps = {
  children: ReactNode
  disabled?: boolean
  onClick?: ButtonProps['onClick']
  type?: ButtonProps['type']
}

export const AuthSubmitButton = ({
  children,
  disabled,
  onClick,
  type = 'submit',
}: AuthSubmitButtonProps) => {
  return (
    <Button
      type={type}
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      sx={{
        mt: { xs: 0.75, md: 1 },
        width: { xs: '100%', sm: 404 },
        maxWidth: '100%',
        mx: 'auto',
        alignSelf: 'center',
        display: 'flex',
        minHeight: { xs: 52, sm: 56 },
        borderRadius: '12px',
        fontSize: { xs: 15, sm: 16 },
        fontWeight: 700,
        bgcolor: '#1284f8',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
          bgcolor: '#0f75df',
        },
      }}
    >
      {children}
    </Button>
  )
}
