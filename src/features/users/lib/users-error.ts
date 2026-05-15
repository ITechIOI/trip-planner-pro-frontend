import type {
  DeleteCurrentUserMutationError,
  GetCurrentUserQueryError,
  GetUserByIdQueryError,
  UpdateCurrentUserPasswordMutationError,
  UpdateCurrentUserProfileMutationError,
  UploadCurrentUserAvatarMutationError,
} from "@/shared";
import { getApiErrorMessage } from "@/shared/api";

type UsersApiError =
  | DeleteCurrentUserMutationError
  | GetCurrentUserQueryError
  | GetUserByIdQueryError
  | UpdateCurrentUserPasswordMutationError
  | UpdateCurrentUserProfileMutationError
  | UploadCurrentUserAvatarMutationError;

export const getUsersErrorMessage = (error: UsersApiError) => {
  return getApiErrorMessage(error, {
    400: "Invalid user information.",
    401: "Invalid session. Please try again.",
    default: "Unable to load user data. Please try again later.",
  });
};

export const getUploadCurrentUserAvatarErrorMessage = (
  error: UploadCurrentUserAvatarMutationError,
) => {
  return getApiErrorMessage(error, {
    400: "Invalid avatar image.",
    401: "Invalid session. Please try again.",
    413: "Avatar image is too large.",
    502: "Avatar upload service is unavailable. Please try again later.",
    default: "Unable to upload avatar. Please try again later.",
  });
};
