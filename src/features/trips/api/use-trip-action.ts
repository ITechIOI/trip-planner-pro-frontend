import { useQueryClient } from '@tanstack/react-query'
import { invalidateFeatureQueries } from '@/shared/lib'
import {
  useCreateTrip,
  useDeleteTrip,
  useGetTrip,
  useGetTripDashboard,
  useListTrips,
  useQueryTrips as useGeneratedQueryTrips,
  useUpdateTrip,
} from '@/shared'
import { tripsQueryKeys } from '../lib/trips-query-keys'

type UseQueryTripsParams = Parameters<typeof useGeneratedQueryTrips>[0]
type UseQueryTripsOptions = Parameters<typeof useGeneratedQueryTrips>[1]
type UseTripDashboardTripId = Parameters<typeof useGetTripDashboard>[0]
type UseTripDashboardOptions = Parameters<typeof useGetTripDashboard>[1]
type UseTripId = Parameters<typeof useGetTrip>[0]
type UseTripOptions = Parameters<typeof useGetTrip>[1]
type UseTripsParams = Parameters<typeof useListTrips>[0]
type UseTripsOptions = Parameters<typeof useListTrips>[1]
type UseCreateTripActionOptions = Parameters<typeof useCreateTrip>[0]
type UseDeleteTripActionOptions = Parameters<typeof useDeleteTrip>[0]
type UseUpdateTripActionOptions = Parameters<typeof useUpdateTrip>[0]

export const useQueryTrips = (
  params?: UseQueryTripsParams,
  options?: UseQueryTripsOptions,
) => {
  return useGeneratedQueryTrips(params, options)
}

export const useTripDashboard = (
  tripId: UseTripDashboardTripId,
  options?: UseTripDashboardOptions,
) => {
  return useGetTripDashboard(tripId, options)
}

export const useTrip = (tripId: UseTripId, options?: UseTripOptions) => {
  return useGetTrip(tripId, options)
}

export const useTrips = (params?: UseTripsParams, options?: UseTripsOptions) => {
  return useListTrips(params, {
    ...options,
    query: {
      refetchOnWindowFocus: 'always',
      refetchOnReconnect: 'always',
      ...options?.query,
    },
  })
}

export const useCreateTripAction = (options?: UseCreateTripActionOptions) => {
  const queryClient = useQueryClient()

  return useCreateTrip({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: async (data, variables, onMutateResult, context) => {
        await options?.mutation?.onSuccess?.(
          data,
          variables,
          onMutateResult,
          context,
        )
        await invalidateFeatureQueries(
          queryClient,
          tripsQueryKeys.affectedTripCollection(),
        )
      },
    },
  })
}

export const useDeleteTripAction = (options?: UseDeleteTripActionOptions) => {
  const queryClient = useQueryClient()

  return useDeleteTrip({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: async (data, variables, onMutateResult, context) => {
        await options?.mutation?.onSuccess?.(
          data,
          variables,
          onMutateResult,
          context,
        )
        await invalidateFeatureQueries(
          queryClient,
          tripsQueryKeys.affectedTrip(variables.tripId),
        )
      },
    },
  })
}

export const useUpdateTripAction = (options?: UseUpdateTripActionOptions) => {
  const queryClient = useQueryClient()

  return useUpdateTrip({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: async (data, variables, onMutateResult, context) => {
        await options?.mutation?.onSuccess?.(
          data,
          variables,
          onMutateResult,
          context,
        )
        await invalidateFeatureQueries(
          queryClient,
          tripsQueryKeys.affectedTrip(variables.tripId),
        )
      },
    },
  })
}
