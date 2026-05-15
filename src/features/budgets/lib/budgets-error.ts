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
import { getApiErrorMessage } from "@/shared/api";

type BudgetsApiError =
  | CreateBudgetMutationError
  | DeleteBudgetMutationError
  | GetBudgetQueryError
  | GetTripBudgetSummaryQueryError
  | GetTripBudgetQueryError
  | ListTripBudgetsQueryError
  | QueryTripBudgetsQueryError
  | UpdateBudgetMutationError;

export const getBudgetsErrorMessage = (error: BudgetsApiError) => {
  return getApiErrorMessage(error, {
    400: "Invalid budget information.",
    401: "Invalid session. Please try again.",
    403: "You are not allowed to access this budget.",
    404: "Budget not found.",
    default: "Unable to load budget data. Please try again later.",
  });
};
