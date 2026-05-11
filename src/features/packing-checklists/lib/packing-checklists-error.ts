import type {
  CreatePackingChecklistMutationError,
  DeletePackingChecklistMutationError,
  GetPackingChecklistQueryError,
  GetTripPackingChecklistQueryError,
  ListTripPackingChecklistsQueryError,
  QueryTripPackingChecklistsQueryError,
  UpdatePackingChecklistMutationError,
} from "@/shared";
import { getApiErrorMessage } from "@/features/shared/lib";

type PackingChecklistsApiError =
  | CreatePackingChecklistMutationError
  | DeletePackingChecklistMutationError
  | GetPackingChecklistQueryError
  | GetTripPackingChecklistQueryError
  | ListTripPackingChecklistsQueryError
  | QueryTripPackingChecklistsQueryError
  | UpdatePackingChecklistMutationError;

const packingActionMessages = {
  401: "Your session expired. Sign in again.",
  403: "You do not have permission to change this checklist.",
  404: "This packing item no longer exists.",
  network: "Connection lost. Check your internet and retry.",
  timeout: "The packing request took too long. Please try again.",
};

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

export const getCreatePackingChecklistErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...packingActionMessages,
    400: "Check the packing item details and try again.",
    default: "Packing item could not be added. Please try again.",
  });

export const getUpdatePackingChecklistErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...packingActionMessages,
    400: "Check the packing item details and try again.",
    default: "Packing item could not be saved. Please try again.",
  });

export const getDeletePackingChecklistErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...packingActionMessages,
    default: "Packing item could not be deleted. Please try again.",
  });

export const getTogglePackedErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...packingActionMessages,
    400: "Packed status could not be changed with the current values.",
    default: "Packed status could not be updated. Please try again.",
  });
