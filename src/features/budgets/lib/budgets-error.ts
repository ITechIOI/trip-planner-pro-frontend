import type {
  CreateBudgetMutationError,
  DeleteBudgetMutationError,
  GetBudgetQueryError,
  GetTripBudgetSummaryQueryError,
  GetTripBudgetQueryError,
  ListTripBudgetsQueryError,
  QueryTripBudgetsQueryError,
  UpdateBudgetMutationError,
} from "@/shared";
import { getApiErrorMessage } from "@/features/shared/lib";

type BudgetsApiError =
  | CreateBudgetMutationError
  | DeleteBudgetMutationError
  | GetBudgetQueryError
  | GetTripBudgetSummaryQueryError
  | GetTripBudgetQueryError
  | ListTripBudgetsQueryError
  | QueryTripBudgetsQueryError
  | UpdateBudgetMutationError;

const budgetActionMessages = {
  401: "Your session expired. Sign in again.",
  403: "You do not have permission to change this budget.",
  404: "This budget item no longer exists.",
  network: "Connection lost. Check your internet and retry.",
  timeout: "The budget request took too long. Please try again.",
};

export const getBudgetsErrorMessage = (error: BudgetsApiError) => {
  return getApiErrorMessage(error, {
    400: "Invalid budget information.",
    401: "Invalid session. Please try again.",
    403: "You are not allowed to access this budget.",
    404: "Budget not found.",
    default: "Unable to load budget data. Please try again later.",
  });
};

export const getCreateBudgetErrorMessage = (error: unknown) =>
  getApiErrorMessage(error, {
    ...budgetActionMessages,
    400: "Check the budget item details and try again.",
    default: "Budget item could not be added. Please try again.",
  });

export const getUpdateBudgetErrorMessage = (error: unknown) =>
  getApiErrorMessage(error, {
    ...budgetActionMessages,
    400: "Check the budget item details and try again.",
    default: "Budget item could not be saved. Please try again.",
  });

export const getDeleteBudgetErrorMessage = (error: unknown) =>
  getApiErrorMessage(error, {
    ...budgetActionMessages,
    default: "Budget item could not be deleted. Please try again.",
  });

export const getToggleBudgetPaymentErrorMessage = (
  error: unknown,
) =>
  getApiErrorMessage(error, {
    ...budgetActionMessages,
    400: "Payment status could not be changed with the current values.",
    default: "Payment status could not be updated. Please try again.",
  });
