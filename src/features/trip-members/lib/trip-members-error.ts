import type {
  AddTripMemberMutationError,
  DeleteTripMemberMutationError,
  ListTripMembersQueryError,
  UpdateTripMemberRoleMutationError,
} from "@/shared";
import { getApiErrorMessage } from "@/shared/api";

type TripMembersApiError =
  | AddTripMemberMutationError
  | DeleteTripMemberMutationError
  | ListTripMembersQueryError
  | UpdateTripMemberRoleMutationError;

export const getTripMembersErrorMessage = (error: TripMembersApiError) => {
  return getApiErrorMessage(error, {
    400: "Invalid trip member information.",
    401: "Invalid session. Please try again.",
    403: "You are not allowed to manage trip members.",
    404: "Trip member not found.",
    409: "This member already exists on the trip.",
    default: "Unable to load trip member data. Please try again later.",
  });
};
