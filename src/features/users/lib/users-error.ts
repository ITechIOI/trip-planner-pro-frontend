import type {
  DeleteCurrentUserMutationError,
  GetCurrentUserQueryError,
  UpdateCurrentUserPasswordMutationError,
  UpdateCurrentUserProfileMutationError,
  UploadCurrentUserAvatarMutationError,
} from "@/shared";
import { getApiErrorMessage } from "@/features/shared/lib";

type UsersApiError =
  | DeleteCurrentUserMutationError
  | GetCurrentUserQueryError
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

export const getUpdateCurrentUserProfileErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    400: "Check your profile details and try again.",
    401: "Your session expired. Sign in again.",
    default: "Profile could not be saved. Please try again.",
    network: "Connection lost. Check your internet and retry.",
    timeout: "Profile update took too long. Please try again.",
  });

export const getUploadCurrentUserAvatarErrorMessage = (error: unknown) =>
  getApiErrorMessage(error, {
    400: "Choose a valid PNG or JPG image for your avatar.",
    401: "Your session expired. Sign in again.",
    413: "Avatar image must be 5MB or smaller.",
    502: "Avatar upload is temporarily unavailable. Please try again.",
    default: "Avatar could not be uploaded. Please try again.",
    network: "Connection lost. Check your internet and retry.",
    timeout: "Avatar upload took too long. Please try again.",
  });
