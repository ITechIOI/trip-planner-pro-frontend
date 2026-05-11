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
import { getApiErrorMessage } from "@/features/shared/lib";

type TripsApiError =
  | CreateTripMutationError
  | DeleteTripMutationError
  | GetTripDashboardQueryError
  | GetTripQueryError
  | ListTripsQueryError
  | QueryTripsQueryError
  | UpdateTripMutationError;

const tripActionMessages = {
  401: "Your session expired. Sign in again.",
  403: "You do not have permission to change this trip.",
  404: "This trip no longer exists.",
  network: "Connection lost. Check your internet and retry.",
  timeout: "The trip request took too long. Please try again.",
};

export const getTripsErrorMessage = (error: TripsApiError) => {
  return getApiErrorMessage(error, {
    400: "Invalid request.",
    401: "Invalid session. Please sign in again.",
    403: "You are not allowed to perform this action.",
    404: "Trip not found.",
    default: "Unable to load trip data. Please try again later.",
  });
};

export const getCreateTripErrorMessage = (error: unknown) =>
  getApiErrorMessage(error, {
    ...tripActionMessages,
    400: "Check the trip details and try again.",
    default: "Trip could not be created. Please try again.",
  });

export const getUpdateTripErrorMessage = (error: unknown) =>
  getApiErrorMessage(error, {
    ...tripActionMessages,
    400: "Check the trip details and try again.",
    default: "Trip could not be saved. Please try again.",
  });

export const getDeleteTripErrorMessage = (error: unknown) =>
  getApiErrorMessage(error, {
    ...tripActionMessages,
    default: "Trip could not be deleted. Please try again.",
  });
