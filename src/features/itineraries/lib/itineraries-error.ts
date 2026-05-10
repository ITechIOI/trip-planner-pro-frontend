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

export const getItinerariesErrorMessage = (error: ItinerariesApiError) => {
  return getApiErrorMessage(error, {
    400: "Invalid itinerary information.",
    401: "Invalid session. Please try again.",
    403: "You are not allowed to access this itinerary.",
    404: "Itinerary not found.",
    default: "Unable to load itinerary data. Please try again later.",
  });
};
