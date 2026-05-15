import type {
  CreatePackingChecklistMutationError,
  DeletePackingChecklistMutationError,
  GetPackingChecklistQueryError,
  GetTripPackingChecklistQueryError,
  ListTripPackingChecklistsQueryError,
  QueryTripPackingChecklistsQueryError,
  UpdatePackingChecklistMutationError,
} from "@/shared";
import { getApiErrorMessage } from "@/shared/api";

type PackingChecklistsApiError =
  | CreatePackingChecklistMutationError
  | DeletePackingChecklistMutationError
  | GetPackingChecklistQueryError
  | GetTripPackingChecklistQueryError
  | ListTripPackingChecklistsQueryError
  | QueryTripPackingChecklistsQueryError
  | UpdatePackingChecklistMutationError;

export const getPackingChecklistsErrorMessage = (
  error: PackingChecklistsApiError,
) => {
  return getApiErrorMessage(error, {
    400: "Invalid checklist information.",
    401: "Invalid session. Please try again.",
    403: "You are not allowed to access this checklist.",
    404: "Checklist item not found.",
    default: "Unable to load checklist data. Please try again later.",
  });
};
