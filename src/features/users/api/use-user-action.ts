import { useQueryClient } from '@tanstack/react-query'
import {
  invalidateFeatureQueries,
  removeFeatureQueries,
} from '@/features/shared/lib'
import {
  clearAccessToken,
  useDeleteCurrentUser,
  useGetCurrentUser,
  useUpdateCurrentUserPassword,
  useUpdateCurrentUserProfile,
} from '@/shared'
import { usersQueryKeys } from '../lib/users-query-keys'

type UseCurrentUserOptions = Parameters<typeof useGetCurrentUser>[0]
type UseDeleteCurrentUserActionOptions = Parameters<
  typeof useDeleteCurrentUser
>[0]
type UseUpdateCurrentUserPasswordActionOptions = Parameters<
  typeof useUpdateCurrentUserPassword
>[0]
type UseUpdateCurrentUserProfileActionOptions = Parameters<
  typeof useUpdateCurrentUserProfile
>[0]

export const useCurrentUser = (options?: UseCurrentUserOptions) => {
  return useGetCurrentUser(options)
}

export const useDeleteCurrentUserAction = (
  options?: UseDeleteCurrentUserActionOptions,
) => {
  const queryClient = useQueryClient()

  return useDeleteCurrentUser({
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
        clearAccessToken()
        removeFeatureQueries(queryClient, usersQueryKeys.affectedCurrentUser())
      },
    },
  })
}

export const useUpdateCurrentUserPasswordAction = (
  options?: UseUpdateCurrentUserPasswordActionOptions,
) => {
  return useUpdateCurrentUserPassword(options)
}

export const useUpdateCurrentUserProfileAction = (
  options?: UseUpdateCurrentUserProfileActionOptions,
) => {
  const queryClient = useQueryClient()

  return useUpdateCurrentUserProfile({
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
          usersQueryKeys.affectedCurrentUser(),
        )
      },
    },
  })
}
