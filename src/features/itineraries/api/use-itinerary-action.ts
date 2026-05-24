import { useQueryClient } from '@tanstack/react-query'
import { invalidateFeatureQueries } from '@/shared/lib'
import {
  useCreateItinerary,
  useDeleteItinerary,
  useGetItinerary,
  useGetTripItinerary,
  useListTripItineraries,
  useQueryTripItineraries as useGeneratedQueryTripItineraries,
  useUpdateItinerary,
} from '@/shared'
import { itinerariesQueryKeys } from '../lib/itineraries-query-keys'

type UseItineraryItineraryId = Parameters<typeof useGetItinerary>[0]
type UseItineraryOptions = Parameters<typeof useGetItinerary>[1]
type UseQueryTripItinerariesTripId = Parameters<
  typeof useGeneratedQueryTripItineraries
>[0]
type UseQueryTripItinerariesParams = Parameters<
  typeof useGeneratedQueryTripItineraries
>[1]
type UseQueryTripItinerariesOptions = Parameters<
  typeof useGeneratedQueryTripItineraries
>[2]
type UseTripItinerariesTripId = Parameters<typeof useListTripItineraries>[0]
type UseTripItinerariesParams = Parameters<typeof useListTripItineraries>[1]
type UseTripItinerariesOptions = Parameters<typeof useListTripItineraries>[2]
type UseTripItineraryTripId = Parameters<typeof useGetTripItinerary>[0]
type UseTripItineraryItineraryId = Parameters<typeof useGetTripItinerary>[1]
type UseTripItineraryOptions = Parameters<typeof useGetTripItinerary>[2]
type UseCreateItineraryActionOptions = Parameters<typeof useCreateItinerary>[0]
type UseDeleteItineraryActionOptions = Parameters<typeof useDeleteItinerary>[0]
type UseUpdateItineraryActionOptions = Parameters<typeof useUpdateItinerary>[0]

export const useItinerary = (
  itineraryId: UseItineraryItineraryId,
  options?: UseItineraryOptions,
) => {
  return useGetItinerary(itineraryId, options)
}

export const useQueryTripItineraries = (
  tripId: UseQueryTripItinerariesTripId,
  params?: UseQueryTripItinerariesParams,
  options?: UseQueryTripItinerariesOptions,
) => {
  return useGeneratedQueryTripItineraries(tripId, params, options)
}

export const useTripItineraries = (
  tripId: UseTripItinerariesTripId,
  params?: UseTripItinerariesParams,
  options?: UseTripItinerariesOptions,
) => {
  return useListTripItineraries(tripId, params, options)
}

export const useTripItinerary = (
  tripId: UseTripItineraryTripId,
  itineraryId: UseTripItineraryItineraryId,
  options?: UseTripItineraryOptions,
) => {
  return useGetTripItinerary(tripId, itineraryId, options)
}

export const useCreateItineraryAction = (
  options?: UseCreateItineraryActionOptions,
) => {
  const queryClient = useQueryClient()

  return useCreateItinerary({
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
          itinerariesQueryKeys.affectedTripItineraries(variables.tripId),
        )
      },
    },
  })
}

export const useDeleteItineraryAction = (
  options?: UseDeleteItineraryActionOptions,
) => {
  const queryClient = useQueryClient()

  return useDeleteItinerary({
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
          itinerariesQueryKeys.affectedItinerary(
            variables.tripId,
            variables.itineraryId,
          ),
        )
      },
    },
  })
}

export const useUpdateItineraryAction = (
  options?: UseUpdateItineraryActionOptions,
) => {
  const queryClient = useQueryClient()

  return useUpdateItinerary({
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
          itinerariesQueryKeys.affectedItinerary(
            variables.tripId,
            variables.itineraryId,
          ),
        )
      },
    },
  })
}



