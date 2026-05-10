import type {
  DeleteCurrentUserMutationError,
  GetCurrentUserQueryError,
  UpdateCurrentUserPasswordMutationError,
  UpdateCurrentUserProfileMutationError,
} from "@/shared";
import { getApiErrorMessage } from "@/features/shared/lib";

type UsersApiError =
  | DeleteCurrentUserMutationError
  | GetCurrentUserQueryError
  | UpdateCurrentUserPasswordMutationError
  | UpdateCurrentUserProfileMutationError;

export const getUsersErrorMessage = (error: UsersApiError) => {
  return getApiErrorMessage(error, {
    400: "Invalid user information.",
    401: "Invalid session. Please try again.",
    default: "Unable to load user data. Please try again later.",
  });
};
