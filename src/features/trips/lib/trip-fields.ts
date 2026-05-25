import {
  TripStatusFilterParameter,
  type CreateTripRequest,
  type TripResponse,
  type TripStatusFilterParameter as TripStatusFilter,
} from '@/shared'

export const DEFAULT_TRIP_PAGE_LIMIT = 10

export type TripStatusFilterValue = '' | TripStatusFilter

export type TripFormFields = {
  name: string
  estimatedBudget: string
  startDate: string
  endDate: string
}

export type TripFormErrors = Partial<Record<keyof TripFormFields, string>>

export const tripStatusOptions: {
  value: TripStatusFilterValue
  label: string
}[] = [
  { value: '', label: 'All' },
  { value: TripStatusFilterParameter.to_do, label: 'Upcoming' },
  { value: TripStatusFilterParameter.in_progress, label: 'In Progress' },
  { value: TripStatusFilterParameter.done, label: 'Completed' },
]

export const toDateInputValue = (value?: string | null) => {
  if (!value) {
    return ''
  }

  return String(value).slice(0, 10)
}

export const normalizeTripDate = (value: string) => {
  const normalized = value.trim()

  return normalized ? `${normalized}T00:00:00` : null
}

export const buildTripFormFields = (
  trip?: TripResponse | null,
): TripFormFields => ({
  name: trip?.name ?? '',
  estimatedBudget:
    trip?.estimatedBudget !== undefined ? String(trip.estimatedBudget) : '0',
  startDate: toDateInputValue(trip?.startDate),
  endDate: toDateInputValue(trip?.endDate),
})

export const validateTripForm = (fields: TripFormFields): TripFormErrors => {
  const errors: TripFormErrors = {}
  const budget = Number(fields.estimatedBudget)

  if (!fields.name.trim()) {
    errors.name = 'Trip name is required'
  }

  if (!Number.isFinite(budget) || budget < 0) {
    errors.estimatedBudget = 'Budget must be zero or greater'
  }

  if (
    fields.startDate &&
    fields.endDate &&
    fields.startDate > fields.endDate
  ) {
    errors.endDate = 'End date must be after start date'
  }

  return errors
}

export const buildTripPayload = (
  fields: TripFormFields,
): CreateTripRequest => ({
  name: fields.name.trim(),
  estimatedBudget: Number(fields.estimatedBudget),
  startDate: normalizeTripDate(fields.startDate),
  endDate: normalizeTripDate(fields.endDate),
})

export const formatTripDate = (value?: string | null) => {
  if (!value) {
    return 'Not set'
  }

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatTripDateRange = (trip: TripResponse) =>
  `${formatTripDate(trip.startDate)} - ${formatTripDate(trip.endDate)}`

export const formatTripBudget = (value?: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value ?? 0)
