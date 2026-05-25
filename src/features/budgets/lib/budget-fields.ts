import {
  BudgetCategory,
  PaymentStatus,
  type BudgetCategorySummaryResponse,
  type BudgetResponse,
  type BudgetSummaryResponse,
  type CreateBudgetRequest,
  type UpdateBudgetRequest,
} from '@/shared'

export const DEFAULT_BUDGET_PAGE_LIMIT = 10

export const BUDGET_CATEGORIES = [
  BudgetCategory.TRANSPORT,
  BudgetCategory.ACCOMMODATION,
  BudgetCategory.FOOD,
  BudgetCategory.SHOPPING,
  BudgetCategory.ACTIVITY,
  BudgetCategory.OTHER,
] as const

export const BUDGET_PAYMENT_STATUSES = [
  PaymentStatus.UNPAID,
  PaymentStatus.PAID,
] as const

export type BudgetCategoryFilterValue = '' | BudgetCategory
export type BudgetStatusFilterValue = '' | PaymentStatus

export type BudgetItemView = {
  id: number
  itemName: string
  category: BudgetCategory
  estimatedCost: number
  actualCost: number | null
  paymentStatus: PaymentStatus
  tripId: number
}

export type BudgetCategoryTotals = {
  category: BudgetCategory
  itemCount: number
  totalEstimatedCost: number
  totalActualCost: number
}

export type BudgetItemFormValues = {
  itemName: string
  category: BudgetCategory
  estimatedCost: string
  actualCost: string
  paymentStatus: PaymentStatus
}

export type BudgetItemFormErrors = Partial<
  Record<keyof BudgetItemFormValues, string>
>

export type BudgetTotalFormErrors = {
  totalBudget?: string
}

export const buildBlankBudgetItemFormValues = (): BudgetItemFormValues => ({
  itemName: '',
  category: BudgetCategory.TRANSPORT,
  estimatedCost: '',
  actualCost: '',
  paymentStatus: PaymentStatus.UNPAID,
})

export const toBudgetItemView = (
  budget: BudgetResponse,
): BudgetItemView | null => {
  if (budget.id == null || budget.tripId == null) {
    return null
  }

  return {
    id: budget.id,
    itemName: budget.itemName ?? 'Untitled expense',
    category: budget.category ?? BudgetCategory.OTHER,
    estimatedCost: budget.estimatedCost ?? 0,
    actualCost: budget.actualCost ?? null,
    paymentStatus: budget.paymentStatus ?? PaymentStatus.UNPAID,
    tripId: budget.tripId,
  }
}

export const toBudgetItemFormValues = (
  item: BudgetItemView,
): BudgetItemFormValues => ({
  itemName: item.itemName,
  category: item.category,
  estimatedCost: String(item.estimatedCost),
  actualCost: item.actualCost == null ? '' : String(item.actualCost),
  paymentStatus: item.paymentStatus,
})

const parseMoneyInput = (value: string) => {
  const normalized = value.trim()

  return normalized ? Number(normalized) : null
}

const validateMoneyInput = (
  value: string,
  fieldName: string,
  required: boolean,
) => {
  const amount = parseMoneyInput(value)

  if (amount == null) {
    return required ? `${fieldName} is required` : undefined
  }

  if (!Number.isFinite(amount) || amount < 0) {
    return `${fieldName} must be zero or greater`
  }

  return undefined
}

export const validateBudgetItemForm = (
  values: BudgetItemFormValues,
): BudgetItemFormErrors => {
  const errors: BudgetItemFormErrors = {}
  const estimatedCostError = validateMoneyInput(
    values.estimatedCost,
    'Estimated cost',
    true,
  )
  const actualCostError = validateMoneyInput(
    values.actualCost,
    'Actual cost',
    values.paymentStatus === PaymentStatus.PAID,
  )

  if (!values.itemName.trim()) {
    errors.itemName = 'Expense name is required'
  }

  if (estimatedCostError) {
    errors.estimatedCost = estimatedCostError
  }

  if (actualCostError) {
    errors.actualCost = actualCostError
  }

  return errors
}

export const buildBudgetItemPayload = (
  values: BudgetItemFormValues,
): CreateBudgetRequest => ({
  itemName: values.itemName.trim(),
  category: values.category,
  estimatedCost: Number(values.estimatedCost),
  actualCost: parseMoneyInput(values.actualCost),
  paymentStatus: values.paymentStatus,
})

export const buildUpdateBudgetItemPayload = (
  values: BudgetItemFormValues,
): UpdateBudgetRequest => buildBudgetItemPayload(values)

export const validateBudgetTotal = (value: string): BudgetTotalFormErrors => {
  const totalBudget = parseMoneyInput(value)

  if (totalBudget == null || !Number.isFinite(totalBudget) || totalBudget < 0) {
    return { totalBudget: 'Total budget must be zero or greater' }
  }

  return {}
}

export const buildBudgetCategoryTotals = (
  summary?: BudgetSummaryResponse,
): Record<BudgetCategory, BudgetCategoryTotals> => {
  const initial = Object.fromEntries(
    BUDGET_CATEGORIES.map((category) => [
      category,
      {
        category,
        itemCount: 0,
        totalEstimatedCost: 0,
        totalActualCost: 0,
      },
    ]),
  ) as Record<BudgetCategory, BudgetCategoryTotals>

  for (const categorySummary of summary?.categorySummaries ?? []) {
    const category = categorySummary.category

    if (category) {
      initial[category] = toBudgetCategoryTotals(categorySummary, category)
    }
  }

  return initial
}

const toBudgetCategoryTotals = (
  summary: BudgetCategorySummaryResponse,
  category: BudgetCategory,
): BudgetCategoryTotals => ({
  category,
  itemCount: summary.itemCount ?? 0,
  totalEstimatedCost: summary.totalEstimatedCost ?? 0,
  totalActualCost: summary.totalActualCost ?? 0,
})

export const getBudgetItemCount = (
  byCategory: Record<BudgetCategory, BudgetCategoryTotals>,
) =>
  Object.values(byCategory).reduce(
    (total, category) => total + category.itemCount,
    0,
  )
