import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import {
  invalidateFeatureQueries,
  removeFeatureQueries,
} from '@/shared/lib'
import {
  clearAccessToken,
  type UserResponse,
  useDeleteCurrentUser,
  useGetCurrentUser,
  useGetUserById,
  useUpdateCurrentUserPassword,
  useUpdateCurrentUserProfile,
  useUploadCurrentUserAvatar,
} from '@/shared'
import { usersQueryKeys } from '../lib/users-query-keys'

type UseCurrentUserOptions = Parameters<typeof useGetCurrentUser>[0]
type UseUserId = Parameters<typeof useGetUserById>[0]
type UseUserOptions = Parameters<typeof useGetUserById>[1]
type UseDeleteCurrentUserActionOptions = Parameters<
  typeof useDeleteCurrentUser
>[0]
type UseUploadCurrentUserAvatarActionOptions = Parameters<
  typeof useUploadCurrentUserAvatar
>[0]
type UseUpdateCurrentUserPasswordActionOptions = Parameters<
  typeof useUpdateCurrentUserPassword
>[0]
type UseUpdateCurrentUserProfileActionOptions = Parameters<
  typeof useUpdateCurrentUserProfile
>[0]

const syncCurrentUserProfileQueries = async (
  queryClient: QueryClient,
  user: UserResponse,
) => {
  queryClient.setQueryData(usersQueryKeys.current(), user)

  if (typeof user.id === 'number') {
    queryClient.setQueryData(usersQueryKeys.detail(user.id), user)
  }

  await invalidateFeatureQueries(
    queryClient,
    usersQueryKeys.affectedCurrentUserProfile(user.id),
  )
}

export const useCurrentUser = (options?: UseCurrentUserOptions) => {
  return useGetCurrentUser(options)
}

export const useUser = (userId: UseUserId, options?: UseUserOptions) => {
  return useGetUserById(userId, options)
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

export const useUploadCurrentUserAvatarAction = (
  options?: UseUploadCurrentUserAvatarActionOptions,
) => {
  const queryClient = useQueryClient()

  return useUploadCurrentUserAvatar({
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
        await syncCurrentUserProfileQueries(queryClient, data)
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
        await syncCurrentUserProfileQueries(queryClient, data)
      },
    },
  })
}
