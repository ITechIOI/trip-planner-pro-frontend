import type {
  AddTripMemberMutationError,
  DeleteTripMemberMutationError,
  ListTripMembersQueryError,
  UpdateTripMemberRoleMutationError,
} from "@/shared";
import { getApiErrorMessage } from "@/features/shared/lib";

type TripMembersApiError =
  | AddTripMemberMutationError
  | DeleteTripMemberMutationError
  | ListTripMembersQueryError
  | UpdateTripMemberRoleMutationError;

type ApiErrorLike = TripMembersApiError | { response?: { status?: number } };

const memberActionMessages = {
  401: "Your session expired. Sign in again.",
  403: "You do not have permission to manage trip members.",
  404: "This member no longer exists on the trip.",
  network: "Connection lost. Check your internet and retry.",
  timeout: "The member request took too long. Please try again.",
};

export const getTripMembersErrorMessage = (error: ApiErrorLike) => {
  return getApiErrorMessage(error as TripMembersApiError, {
    400: "Invalid trip member information.",
    401: "Invalid session. Please try again.",
    403: "You are not allowed to manage trip members.",
    404: "Trip member not found.",
    409: "This member already exists on the trip.",
    default: "Unable to load trip member data. Please try again later.",
  });
};

export const getAddTripMemberErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...memberActionMessages,
    400: "Check the member email and role, then try again.",
    409: "This member is already on the trip.",
    default: "Member could not be added. Please try again.",
  });

export const getUpdateTripMemberRoleErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...memberActionMessages,
    400: "This role change is invalid. Refresh and try again.",
    default: "Member role could not be updated. Please try again.",
  });

export const getDeleteTripMemberErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...memberActionMessages,
    default: "Member could not be removed. Please try again.",
  });
