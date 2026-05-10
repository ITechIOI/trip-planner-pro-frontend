import { useQueryClient } from "@tanstack/react-query";
import { invalidateFeatureQueries } from "@/features/shared/lib";
import {
  useCreateBudget,
  useDeleteBudget,
  useGetBudget,
  useGetTripBudget,
  useGetTripBudgetSummary,
  useListTripBudgets,
  useQueryTripBudgets as useGeneratedQueryTripBudgets,
  useUpdateBudget,
} from "@/shared";
import { budgetsQueryKeys } from "../lib/budgets-query-keys";

type UseBudgetBudgetId = Parameters<typeof useGetBudget>[0];
type UseBudgetOptions = Parameters<typeof useGetBudget>[1];
type UseQueryTripBudgetsTripId = Parameters<
  typeof useGeneratedQueryTripBudgets
>[0];
type UseQueryTripBudgetsParams = Parameters<
  typeof useGeneratedQueryTripBudgets
>[1];
type UseQueryTripBudgetsOptions = Parameters<
  typeof useGeneratedQueryTripBudgets
>[2];
type UseTripBudgetTripId = Parameters<typeof useGetTripBudget>[0];
type UseTripBudgetBudgetId = Parameters<typeof useGetTripBudget>[1];
type UseTripBudgetOptions = Parameters<typeof useGetTripBudget>[2];
type UseTripBudgetsTripId = Parameters<typeof useListTripBudgets>[0];
type UseTripBudgetsParams = Parameters<typeof useListTripBudgets>[1];
type UseTripBudgetsOptions = Parameters<typeof useListTripBudgets>[2];
type UseTripBudgetSummaryTripId = Parameters<typeof useGetTripBudgetSummary>[0];
type UseTripBudgetSummaryOptions = Parameters<
  typeof useGetTripBudgetSummary
>[1];
type UseCreateBudgetActionOptions = Parameters<typeof useCreateBudget>[0];
type UseDeleteBudgetActionOptions = Parameters<typeof useDeleteBudget>[0];
type UseUpdateBudgetActionOptions = Parameters<typeof useUpdateBudget>[0];

export const useBudget = (
  budgetId: UseBudgetBudgetId,
  options?: UseBudgetOptions,
) => {
  return useGetBudget(budgetId, options);
};

export const useQueryTripBudgets = (
  tripId: UseQueryTripBudgetsTripId,
  params?: UseQueryTripBudgetsParams,
  options?: UseQueryTripBudgetsOptions,
) => {
  return useGeneratedQueryTripBudgets(tripId, params, options);
};

export const useTripBudget = (
  tripId: UseTripBudgetTripId,
  budgetId: UseTripBudgetBudgetId,
  options?: UseTripBudgetOptions,
) => {
  return useGetTripBudget(tripId, budgetId, options);
};

export const useTripBudgets = (
  tripId: UseTripBudgetsTripId,
  params?: UseTripBudgetsParams,
  options?: UseTripBudgetsOptions,
) => {
  return useListTripBudgets(tripId, params, {
    ...options,
    query: {
      refetchOnWindowFocus: "always",
      refetchOnReconnect: "always",
      ...options?.query,
    },
  });
};

export const useTripBudgetSummary = (
  tripId: UseTripBudgetSummaryTripId,
  options?: UseTripBudgetSummaryOptions,
) => {
  return useGetTripBudgetSummary(tripId, options);
};

export const useCreateBudgetAction = (
  options?: UseCreateBudgetActionOptions,
) => {
  const queryClient = useQueryClient();

  return useCreateBudget({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: async (data, variables, onMutateResult, context) => {
        await options?.mutation?.onSuccess?.(
          data,
          variables,
          onMutateResult,
          context,
        );
        await invalidateFeatureQueries(
          queryClient,
          budgetsQueryKeys.affectedTripBudgets(variables.tripId),
        );
      },
    },
  });
};

export const useDeleteBudgetAction = (
  options?: UseDeleteBudgetActionOptions,
) => {
  const queryClient = useQueryClient();

  return useDeleteBudget({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: async (data, variables, onMutateResult, context) => {
        await options?.mutation?.onSuccess?.(
          data,
          variables,
          onMutateResult,
          context,
        );
        await invalidateFeatureQueries(
          queryClient,
          budgetsQueryKeys.affectedBudget(variables.tripId, variables.budgetId),
        );
      },
    },
  });
};

export const useUpdateBudgetAction = (
  options?: UseUpdateBudgetActionOptions,
) => {
  const queryClient = useQueryClient();

  return useUpdateBudget({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: async (data, variables, onMutateResult, context) => {
        await options?.mutation?.onSuccess?.(
          data,
          variables,
          onMutateResult,
          context,
        );
        await invalidateFeatureQueries(
          queryClient,
          budgetsQueryKeys.affectedBudget(variables.tripId, variables.budgetId),
        );
      },
    },
  });
};
