import { getGetCurrentUserQueryKey, getGetUserByIdQueryKey } from "@/shared";

type UserId = Parameters<typeof getGetUserByIdQueryKey>[0];

const affectedCurrentUser = () => [getGetCurrentUserQueryKey()];

const affectedUser = (userId: UserId) => [getGetUserByIdQueryKey(userId)];

const affectedCurrentUserProfile = (userId?: UserId) => [
  ...affectedCurrentUser(),
  ...(userId === undefined ? [] : affectedUser(userId)),
];

export const usersQueryKeys = {
  current: getGetCurrentUserQueryKey,
  detail: getGetUserByIdQueryKey,
  affectedCurrentUser,
  affectedUser,
  affectedCurrentUserProfile,
};
