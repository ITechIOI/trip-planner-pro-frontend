import type {
  CreateItineraryMutationError,
  DeleteItineraryMutationError,
  GetItineraryQueryError,
  GetTripItineraryQueryError,
  ListTripItinerariesQueryError,
  QueryTripItinerariesQueryError,
  UpdateItineraryMutationError,
} from "@/shared";
import { getApiErrorMessage } from "@/features/shared/lib";

type ItinerariesApiError =
  | CreateItineraryMutationError
  | DeleteItineraryMutationError
  | GetItineraryQueryError
  | GetTripItineraryQueryError
  | ListTripItinerariesQueryError
  | QueryTripItinerariesQueryError
  | UpdateItineraryMutationError;

const itineraryActionMessages = {
  401: "Your session expired. Sign in again.",
  403: "You do not have permission to change this itinerary.",
  404: "This activity no longer exists.",
  network: "Connection lost. Check your internet and retry.",
  timeout: "The itinerary request took too long. Please try again.",
};

export const getItinerariesErrorMessage = (error: ItinerariesApiError) => {
  return getApiErrorMessage(error, {
    400: "Invalid itinerary information.",
    401: "Invalid session. Please try again.",
    403: "You are not allowed to access this itinerary.",
    404: "Itinerary not found.",
    default: "Unable to load itinerary data. Please try again later.",
  });
};

export const getCreateItineraryErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...itineraryActionMessages,
    400: "Check the activity details and try again.",
    default: "Activity could not be added. Please try again.",
  });

export const getUpdateItineraryErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...itineraryActionMessages,
    400: "Check the activity details and try again.",
    default: "Activity could not be saved. Please try again.",
  });

export const getDeleteItineraryErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...itineraryActionMessages,
    default: "Activity could not be deleted. Please try again.",
  });

export const getUpdateItineraryStatusErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...itineraryActionMessages,
    400: "This status change is invalid. Refresh and try again.",
    default: "Activity status could not be updated. Please try again.",
  });
