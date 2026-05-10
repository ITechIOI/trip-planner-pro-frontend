import {
  BudgetCategory,
  BudgetWarningLevel,
  ItineraryCategory,
  ItineraryPriority,
  ItineraryStatus,
  PackedStatus,
  PackingCategory,
  PaymentStatus,
  RequiredStatus,
} from '@/shared'

export type Option<TValue extends string> = {
  value: TValue
  label: string
}

export const itineraryCategoryOptions: Option<ItineraryCategory>[] = [
  { value: ItineraryCategory.TRANSPORT, label: 'Transport' },
  { value: ItineraryCategory.FOOD, label: 'Food' },
  { value: ItineraryCategory.SIGHTSEEING, label: 'Sightseeing' },
  { value: ItineraryCategory.SHOPPING, label: 'Shopping' },
  { value: ItineraryCategory.HOTEL, label: 'Hotel' },
  { value: ItineraryCategory.OTHER, label: 'Other' },
]

export const itineraryPriorityOptions: Option<ItineraryPriority>[] = [
  { value: ItineraryPriority.LOW, label: 'Low' },
  { value: ItineraryPriority.MEDIUM, label: 'Medium' },
  { value: ItineraryPriority.HIGH, label: 'High' },
]

export const itineraryStatusOptions: Option<ItineraryStatus>[] = [
  { value: ItineraryStatus.PLANNED, label: 'Planned' },
  { value: ItineraryStatus.IN_PROGRESS, label: 'In progress' },
  { value: ItineraryStatus.DONE, label: 'Done' },
]

export const packingCategoryOptions: Option<PackingCategory>[] = [
  { value: PackingCategory.CLOTHES, label: 'Clothes' },
  { value: PackingCategory.DOCUMENTS, label: 'Documents' },
  { value: PackingCategory.ELECTRONICS, label: 'Electronics' },
  { value: PackingCategory.MEDICINE, label: 'Medicine' },
  { value: PackingCategory.PERSONAL, label: 'Personal' },
  { value: PackingCategory.OTHER, label: 'Other' },
]

export const requiredStatusOptions: Option<RequiredStatus>[] = [
  { value: RequiredStatus.REQUIRED, label: 'Required' },
  { value: RequiredStatus.OPTIONAL, label: 'Optional' },
]

export const packedStatusOptions: Option<PackedStatus>[] = [
  { value: PackedStatus.NOT_PACKED, label: 'Not packed' },
  { value: PackedStatus.PACKED, label: 'Packed' },
]

export const budgetCategoryOptions: Option<BudgetCategory>[] = [
  { value: BudgetCategory.TRANSPORT, label: 'Transport' },
  { value: BudgetCategory.ACCOMMODATION, label: 'Accommodation' },
  { value: BudgetCategory.FOOD, label: 'Food' },
  { value: BudgetCategory.SHOPPING, label: 'Shopping' },
  { value: BudgetCategory.ACTIVITY, label: 'Activity' },
  { value: BudgetCategory.OTHER, label: 'Other' },
]

export const paymentStatusOptions: Option<PaymentStatus>[] = [
  { value: PaymentStatus.UNPAID, label: 'Unpaid' },
  { value: PaymentStatus.PAID, label: 'Paid' },
]

const labelFromOptions = <TValue extends string>(
  options: Option<TValue>[],
  value?: TValue,
) => options.find((option) => option.value === value)?.label ?? 'Unknown'

export const getItineraryCategoryLabel = (value?: ItineraryCategory) =>
  labelFromOptions(itineraryCategoryOptions, value)

export const getItineraryPriorityLabel = (value?: ItineraryPriority) =>
  labelFromOptions(itineraryPriorityOptions, value)

export const getItineraryStatusLabel = (value?: ItineraryStatus) =>
  labelFromOptions(itineraryStatusOptions, value)

export const getPackingCategoryLabel = (value?: PackingCategory) =>
  labelFromOptions(packingCategoryOptions, value)

export const getRequiredStatusLabel = (value?: RequiredStatus) =>
  labelFromOptions(requiredStatusOptions, value)

export const getPackedStatusLabel = (value?: PackedStatus) =>
  labelFromOptions(packedStatusOptions, value)

export const getBudgetCategoryLabel = (value?: BudgetCategory) =>
  labelFromOptions(budgetCategoryOptions, value)

export const getPaymentStatusLabel = (value?: PaymentStatus) =>
  labelFromOptions(paymentStatusOptions, value)

export const getWarningTone = (warning?: BudgetWarningLevel) => {
  if (warning === BudgetWarningLevel.CRITICAL) {
    return 'critical'
  }

  if (warning === BudgetWarningLevel.WARNING) {
    return 'warning'
  }

  return 'success'
}
