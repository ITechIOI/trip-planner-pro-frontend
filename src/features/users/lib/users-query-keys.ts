import {
  getGetCurrentUserQueryKey,
  getGetUserByIdQueryKey,
} from '@/shared'

export const usersQueryKeys = {
  current: getGetCurrentUserQueryKey,
  detail: getGetUserByIdQueryKey,
  affectedCurrentUser: () => [getGetCurrentUserQueryKey()],
  affectedUser: (userId: Parameters<typeof getGetUserByIdQueryKey>[0]) => [
    getGetUserByIdQueryKey(userId),
  ],
}
