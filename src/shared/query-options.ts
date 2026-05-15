import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'

type GeneratedQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
> = UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
  queryKey: TQueryKey
}

const hasRequiredPathValues = (variables?: Record<string, unknown>) => {
  if (!variables) {
    return true
  }

  return Object.values(variables)
    .filter((value) => value == null || typeof value !== 'object')
    .every(Boolean)
}

export const withDefaultQueryOptions = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: GeneratedQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  variables?: Record<string, unknown>,
): GeneratedQueryOptions<TQueryFnData, TError, TData, TQueryKey> => ({
  ...options,
  enabled: options.enabled ?? hasRequiredPathValues(variables),
})
