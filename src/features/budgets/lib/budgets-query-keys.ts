import {
  getGetBudgetQueryKey,
  getGetTripBudgetSummaryQueryKey,
  getGetTripBudgetQueryKey,
  getGetTripDashboardQueryKey,
  getListTripBudgetsQueryKey,
  getQueryTripBudgetsQueryKey,
} from "@/shared";

type TripId = Parameters<typeof getListTripBudgetsQueryKey>[0];
type BudgetId = Parameters<typeof getGetTripBudgetQueryKey>[1];

const affectedTripBudgets = (tripId: TripId) => [
  getListTripBudgetsQueryKey(tripId),
  getQueryTripBudgetsQueryKey(tripId),
  getGetTripBudgetSummaryQueryKey(tripId),
  getGetTripDashboardQueryKey(tripId),
];

const affectedBudget = (tripId: TripId, budgetId: BudgetId) => [
  ...affectedTripBudgets(tripId),
  getGetTripBudgetQueryKey(tripId, budgetId),
  getGetBudgetQueryKey(budgetId),
];

export const budgetsQueryKeys = {
  tripList: getListTripBudgetsQueryKey,
  tripQuery: getQueryTripBudgetsQueryKey,
  tripDetail: getGetTripBudgetQueryKey,
  tripSummary: getGetTripBudgetSummaryQueryKey,
  detail: getGetBudgetQueryKey,
  affectedTripBudgets,
  affectedBudget,
};
