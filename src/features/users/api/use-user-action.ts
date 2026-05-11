import { useQueryClient } from '@tanstack/react-query'
import {
  invalidateFeatureQueries,
  removeFeatureQueries,
} from '@/features/shared/lib'
import {
  clearAccessToken,
  useDeleteCurrentUser,
  useGetCurrentUser,
  useGetUserById,
  useUpdateCurrentUserPassword,
  useUpdateCurrentUserProfile,
  useUploadCurrentUserAvatar,
  type UserResponse,
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
type UseUploadCurrentUserAvatarActionOptions = Parameters<
  typeof useUploadCurrentUserAvatar
>[0]
type UseUserByIdOptions = Parameters<typeof useGetUserById>[1]

const setCurrentUserCaches = (
  queryClient: ReturnType<typeof useQueryClient>,
  data: unknown,
) => {
  queryClient.setQueryData(usersQueryKeys.current(), data)
  if (data && typeof data === 'object' && 'id' in data) {
    const id = (data as { id?: number }).id

    if (id) {
      queryClient.setQueryData(usersQueryKeys.detail(id), data)
    }
  }
}

const hasOwn = (value: object, key: string) =>
  Object.prototype.hasOwnProperty.call(value, key)

const isUserResponse = (data: unknown): data is UserResponse => {
  return Boolean(data && typeof data === 'object' && 'id' in data)
}

const profileUpdateIncludesAvatarUrl = (variables: unknown) => {
  if (!variables || typeof variables !== 'object' || !('data' in variables)) {
    return false
  }

  const data = (variables as { data?: unknown }).data

  return Boolean(data && typeof data === 'object' && hasOwn(data, 'avatarUrl'))
}

const mergeProfileUpdateCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  data: unknown,
  variables: unknown,
) => {
  if (!isUserResponse(data)) {
    return data
  }

  if (profileUpdateIncludesAvatarUrl(variables) || data.avatarUrl) {
    return data
  }

  const currentUser = queryClient.getQueryData<UserResponse>(
    usersQueryKeys.current(),
  )
  const detailUser = data.id
    ? queryClient.getQueryData<UserResponse>(usersQueryKeys.detail(data.id))
    : undefined
  const cachedAvatarUrl = currentUser?.avatarUrl ?? detailUser?.avatarUrl

  return cachedAvatarUrl ? { ...data, avatarUrl: cachedAvatarUrl } : data
}

export const useCurrentUser = (options?: UseCurrentUserOptions) => {
  return useGetCurrentUser(options)
}

export const useUserById = (userId: number, options?: UseUserByIdOptions) => {
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
        setCurrentUserCaches(
          queryClient,
          mergeProfileUpdateCache(queryClient, data, variables),
        )
        await invalidateFeatureQueries(
          queryClient,
          usersQueryKeys.affectedCurrentUser(),
        )
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
        setCurrentUserCaches(queryClient, data)
        await invalidateFeatureQueries(
          queryClient,
          usersQueryKeys.affectedCurrentUser(),
        )
      },
    },
  })
}
