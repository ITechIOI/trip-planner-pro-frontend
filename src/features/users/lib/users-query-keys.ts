import { getGetCurrentUserQueryKey } from "@/shared";

export const usersQueryKeys = {
  current: getGetCurrentUserQueryKey,
  affectedCurrentUser: () => [getGetCurrentUserQueryKey()],
};
