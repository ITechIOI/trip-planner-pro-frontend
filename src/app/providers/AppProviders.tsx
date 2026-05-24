import type { ReactNode } from 'react'
import { MuiThemeProvider } from './MuiThemeProvider'
import { QueryProvider } from './QueryProvider'

type AppProvidersProps = {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <MuiThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </MuiThemeProvider>
  )
}
