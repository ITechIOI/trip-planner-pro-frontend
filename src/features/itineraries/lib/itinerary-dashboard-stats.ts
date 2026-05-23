import { BudgetWarningLevel, type TripDashboardResponse } from '@/shared'

export type ItineraryDashboardStats = {
  completedActivities: number
  totalActivities: number
  itineraryCompletionPercentage: number
  packingCompletionPercentage: number
  budgetUsagePercentage: number
  overdueActivities: number
  hasOverdueActivities: boolean
  isBudgetWarning: boolean
  isBudgetCritical: boolean
  remainingBudget: number
}

export const buildItineraryDashboardStats = (
  dashboard: TripDashboardResponse | undefined,
): ItineraryDashboardStats => {
  const itineraryProgress = dashboard?.itineraryProgress
  const packingProgress = dashboard?.packingProgress
  const budgetUsage = dashboard?.budgetUsage

  const initialBudget = budgetUsage?.initialBudget ?? 0
  const totalActualCost = budgetUsage?.totalActualCost ?? 0
  const warningLevel = budgetUsage?.warningLevel ?? BudgetWarningLevel.SAFE

  return {
    completedActivities: itineraryProgress?.done ?? 0,
    totalActivities: itineraryProgress?.total ?? 0,
    itineraryCompletionPercentage: itineraryProgress?.percent ?? 0,
    packingCompletionPercentage: packingProgress?.percent ?? 0,
    budgetUsagePercentage: budgetUsage?.percent ?? 0,
    overdueActivities: dashboard?.overdueActivityCount ?? 0,
    hasOverdueActivities: (dashboard?.overdueActivityCount ?? 0) > 0,
    isBudgetWarning:
      warningLevel === BudgetWarningLevel.WARNING ||
      warningLevel === BudgetWarningLevel.CRITICAL,
    isBudgetCritical: warningLevel === BudgetWarningLevel.CRITICAL,
    remainingBudget: initialBudget - totalActualCost,
  }
}

export const formatTripCurrency = (amount: number, currency = 'VND') =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
