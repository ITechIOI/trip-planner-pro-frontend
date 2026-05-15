import type { ReactNode } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { appTheme } from '@/shared/theme'

type MuiThemeProviderProps = {
  children: ReactNode
}

export const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
