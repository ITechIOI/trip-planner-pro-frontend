import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/shared/lib'

type QueryProviderProps = {
  children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV ? <ReactQueryDevtools /> : null}
    </QueryClientProvider>
  )
}
