import { useQueryClient } from '@tanstack/react-query'
import { invalidateFeatureQueries } from '@/shared/lib'
import {
  useCreatePackingChecklist,
  useDeletePackingChecklist,
  useGetPackingChecklist,
  useGetTripPackingChecklist,
  useListTripPackingChecklists,
  useQueryTripPackingChecklists as useGeneratedQueryTripPackingChecklists,
  useUpdatePackingChecklist,
} from '@/shared'
import { packingChecklistsQueryKeys } from '../lib/packing-checklists-query-keys'

type UsePackingChecklistChecklistId = Parameters<
  typeof useGetPackingChecklist
>[0]
type UsePackingChecklistOptions = Parameters<typeof useGetPackingChecklist>[1]
type UseQueryTripPackingChecklistsTripId = Parameters<
  typeof useGeneratedQueryTripPackingChecklists
>[0]
type UseQueryTripPackingChecklistsParams = Parameters<
  typeof useGeneratedQueryTripPackingChecklists
>[1]
type UseQueryTripPackingChecklistsOptions = Parameters<
  typeof useGeneratedQueryTripPackingChecklists
>[2]
type UseTripPackingChecklistTripId = Parameters<
  typeof useGetTripPackingChecklist
>[0]
type UseTripPackingChecklistChecklistId = Parameters<
  typeof useGetTripPackingChecklist
>[1]
type UseTripPackingChecklistOptions = Parameters<
  typeof useGetTripPackingChecklist
>[2]
type UseTripPackingChecklistsTripId = Parameters<
  typeof useListTripPackingChecklists
>[0]
type UseTripPackingChecklistsParams = Parameters<
  typeof useListTripPackingChecklists
>[1]
type UseTripPackingChecklistsOptions = Parameters<
  typeof useListTripPackingChecklists
>[2]
type UseCreatePackingChecklistActionOptions = Parameters<
  typeof useCreatePackingChecklist
>[0]
type UseDeletePackingChecklistActionOptions = Parameters<
  typeof useDeletePackingChecklist
>[0]
type UseUpdatePackingChecklistActionOptions = Parameters<
  typeof useUpdatePackingChecklist
>[0]

export const usePackingChecklist = (
  checklistId: UsePackingChecklistChecklistId,
  options?: UsePackingChecklistOptions,
) => {
  return useGetPackingChecklist(checklistId, options)
}

export const useQueryTripPackingChecklists = (
  tripId: UseQueryTripPackingChecklistsTripId,
  params?: UseQueryTripPackingChecklistsParams,
  options?: UseQueryTripPackingChecklistsOptions,
) => {
  return useGeneratedQueryTripPackingChecklists(tripId, params, options)
}

export const useTripPackingChecklist = (
  tripId: UseTripPackingChecklistTripId,
  checklistId: UseTripPackingChecklistChecklistId,
  options?: UseTripPackingChecklistOptions,
) => {
  return useGetTripPackingChecklist(tripId, checklistId, options)
}

export const useTripPackingChecklists = (
  tripId: UseTripPackingChecklistsTripId,
  params?: UseTripPackingChecklistsParams,
  options?: UseTripPackingChecklistsOptions,
) => {
  return useListTripPackingChecklists(tripId, params, options)
}

export const useCreatePackingChecklistAction = (
  options?: UseCreatePackingChecklistActionOptions,
) => {
  const queryClient = useQueryClient()

  return useCreatePackingChecklist({
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
          packingChecklistsQueryKeys.affectedTripPackingChecklists(
            variables.tripId,
          ),
        )
      },
    },
  })
}

export const useDeletePackingChecklistAction = (
  options?: UseDeletePackingChecklistActionOptions,
) => {
  const queryClient = useQueryClient()

  return useDeletePackingChecklist({
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
          packingChecklistsQueryKeys.affectedPackingChecklist(
            variables.tripId,
            variables.checklistId,
          ),
        )
      },
    },
  })
}

export const useUpdatePackingChecklistAction = (
  options?: UseUpdatePackingChecklistActionOptions,
) => {
  const queryClient = useQueryClient()

  return useUpdatePackingChecklist({
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
          packingChecklistsQueryKeys.affectedPackingChecklist(
            variables.tripId,
            variables.checklistId,
          ),
        )
      },
    },
  })
}
