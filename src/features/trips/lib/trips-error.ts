import type {
  CreateTripMutationError,
  GetTripDashboardQueryError,
  ListTripsQueryError,
  QueryTripsQueryError,
} from "@/shared";
import type {
  DeleteTripMutationError,
  GetTripQueryError,
  UpdateTripMutationError,
} from "@/shared";
import { getApiErrorMessage } from "@/shared/api";

type TripsApiError =
  | CreateTripMutationError
  | DeleteTripMutationError
  | GetTripDashboardQueryError
  | GetTripQueryError
  | ListTripsQueryError
  | QueryTripsQueryError
  | UpdateTripMutationError;

export const getTripsErrorMessage = (error: TripsApiError) => {
  return getApiErrorMessage(error, {
    400: "Invalid request.",
    401: "Invalid session. Please sign in again.",
    403: "You are not allowed to perform this action.",
    404: "Trip not found.",
    default: "Unable to load trip data. Please try again later.",
  });
};
