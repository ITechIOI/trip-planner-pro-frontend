import { BudgetCategory, BudgetWarningLevel, PaymentStatus } from '@/shared'

export const formatBudgetCurrency = (amount?: number | null) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount ?? 0)

export const formatBudgetNumber = (amount?: number | null) =>
  new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(amount ?? 0)

export const formatBudgetPercent = (percent?: number | null) =>
  `${Math.round(percent ?? 0)}%`

export const clampBudgetPercent = (percent?: number | null) =>
  Math.min(Math.max(percent ?? 0, 0), 100)

export const getBudgetCategoryLabel = (category: BudgetCategory) => {
  switch (category) {
    case BudgetCategory.TRANSPORT:
      return 'Transport'
    case BudgetCategory.ACCOMMODATION:
      return 'Accommodation'
    case BudgetCategory.FOOD:
      return 'Food'
    case BudgetCategory.SHOPPING:
      return 'Shopping'
    case BudgetCategory.ACTIVITY:
      return 'Activity'
    case BudgetCategory.OTHER:
    default:
      return 'Other'
  }
}

export const getPaymentStatusLabel = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PAID:
      return 'Paid'
    case PaymentStatus.UNPAID:
    default:
      return 'Unpaid'
  }
}

export const budgetCategoryColors: Record<BudgetCategory, string> = {
  [BudgetCategory.TRANSPORT]: '#0284c7',
  [BudgetCategory.ACCOMMODATION]: '#16a34a',
  [BudgetCategory.FOOD]: '#ea580c',
  [BudgetCategory.SHOPPING]: '#db2777',
  [BudgetCategory.ACTIVITY]: '#7c3aed',
  [BudgetCategory.OTHER]: '#475569',
}

export const budgetCategoryBackgroundColors: Record<BudgetCategory, string> = {
  [BudgetCategory.TRANSPORT]: 'rgba(14, 165, 233, 0.12)',
  [BudgetCategory.ACCOMMODATION]: 'rgba(34, 197, 94, 0.12)',
  [BudgetCategory.FOOD]: 'rgba(249, 115, 22, 0.12)',
  [BudgetCategory.SHOPPING]: 'rgba(236, 72, 153, 0.12)',
  [BudgetCategory.ACTIVITY]: 'rgba(139, 92, 246, 0.12)',
  [BudgetCategory.OTHER]: 'rgba(100, 116, 139, 0.12)',
}

export const getBudgetWarningText = (
  warningLevel?: BudgetWarningLevel | null,
  usagePercent?: number | null,
) => {
  if (warningLevel === BudgetWarningLevel.CRITICAL) {
    return 'Budget exceeded! Total actual cost has reached 100% of your budget.'
  }

  if (warningLevel === BudgetWarningLevel.WARNING) {
    return `Warning: You have used ${formatBudgetPercent(usagePercent)} of your budget.`
  }

  return null
}
