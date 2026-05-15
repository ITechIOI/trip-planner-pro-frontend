import { QueryClient } from '@tanstack/react-query'

const DO_NOT_RETRY_STATUSES = new Set([400, 401, 403, 404])

const getResponseStatus = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return undefined
  }

  const response = error.response

  if (!response || typeof response !== 'object' || !('status' in response)) {
    return undefined
  }

  return typeof response.status === 'number' ? response.status : undefined
}

const shouldRetryQuery = (failureCount: number, error: unknown) => {
  const status = getResponseStatus(error)

  if (status && DO_NOT_RETRY_STATUSES.has(status)) {
    return false
  }

  return failureCount < 1
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 10 * 60_000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: shouldRetryQuery,
    },
    mutations: {
      retry: 0,
    },
  },
})
