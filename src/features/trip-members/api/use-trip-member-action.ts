import { useQueryClient } from '@tanstack/react-query'
import { invalidateFeatureQueries } from '@/shared/lib'
import {
  useAddTripMember,
  useDeleteTripMember,
  useListTripMembers,
  useUpdateTripMemberRole,
} from '@/shared'
import { tripMembersQueryKeys } from '../lib/trip-members-query-keys'

type UseTripMembersTripId = Parameters<typeof useListTripMembers>[0]
type UseTripMembersParams = Parameters<typeof useListTripMembers>[1]
type UseTripMembersOptions = Parameters<typeof useListTripMembers>[2]
type UseAddTripMemberActionOptions = Parameters<typeof useAddTripMember>[0]
type UseDeleteTripMemberActionOptions = Parameters<typeof useDeleteTripMember>[0]
type UseUpdateTripMemberRoleActionOptions = Parameters<
  typeof useUpdateTripMemberRole
>[0]

export const useTripMembers = (
  tripId: UseTripMembersTripId,
  params?: UseTripMembersParams,
  options?: UseTripMembersOptions,
) => {
  return useListTripMembers(tripId, params, options)
}

export const useAddTripMemberAction = (
  options?: UseAddTripMemberActionOptions,
) => {
  const queryClient = useQueryClient()

  return useAddTripMember({
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
          tripMembersQueryKeys.affectedTripMembers(variables.tripId),
        )
      },
    },
  })
}

export const useDeleteTripMemberAction = (
  options?: UseDeleteTripMemberActionOptions,
) => {
  const queryClient = useQueryClient()

  return useDeleteTripMember({
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
          tripMembersQueryKeys.affectedTripMembers(variables.tripId),
        )
      },
    },
  })
}

export const useUpdateTripMemberRoleAction = (
  options?: UseUpdateTripMemberRoleActionOptions,
) => {
  const queryClient = useQueryClient()

  return useUpdateTripMemberRole({
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
          tripMembersQueryKeys.affectedTripMembers(variables.tripId),
        )
      },
    },
  })
}
