import type {
  CreateItineraryMutationError,
  DeleteItineraryMutationError,
  GetItineraryQueryError,
  GetTripItineraryQueryError,
  ListTripItinerariesQueryError,
  QueryTripItinerariesQueryError,
  UpdateItineraryMutationError,
} from "@/shared";
import { getApiErrorMessage } from "@/shared/api";

type ItinerariesApiError =
  | CreateItineraryMutationError
  | DeleteItineraryMutationError
  | GetItineraryQueryError
  | GetTripItineraryQueryError
  | ListTripItinerariesQueryError
  | QueryTripItinerariesQueryError
  | UpdateItineraryMutationError;

const technicalDateTimeErrorPattern =
  /^(startTime|endTime) must be an ISO-8601 local date-time string$/;

export const getItinerariesErrorMessage = (error: ItinerariesApiError) => {
  const backendMessage = error.response?.data?.message;

  if (
    error.response?.status === 400 &&
    backendMessage &&
    !technicalDateTimeErrorPattern.test(backendMessage)
  ) {
    return backendMessage;
  }

  return getApiErrorMessage(error, {
    400: "Invalid itinerary information.",
    401: "Invalid session. Please try again.",
    403: "You are not allowed to access this itinerary.",
    404: "Itinerary not found.",
    default: "Unable to load itinerary data. Please try again later.",
  });
};
