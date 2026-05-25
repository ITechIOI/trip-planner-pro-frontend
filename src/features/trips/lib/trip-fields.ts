import {
  TripStatusFilterParameter,
  type CreateTripRequest,
  type TripResponse,
  type TripStatusFilterParameter as TripStatusFilter,
} from '@/shared'

export const DEFAULT_TRIP_PAGE_LIMIT = 10
export const TRIP_STATUS_FILTER_FETCH_LIMIT = 50

const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh'

const vietnamDateTimeFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: VIETNAM_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

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

const getDatePart = (parts: Intl.DateTimeFormatPart[], type: string) =>
  Number(parts.find((part) => part.type === type)?.value ?? 0)

export const getVietnamNowTimestamp = () => {
  const parts = vietnamDateTimeFormatter.formatToParts(new Date())

  return Date.UTC(
    getDatePart(parts, 'year'),
    getDatePart(parts, 'month') - 1,
    getDatePart(parts, 'day'),
    getDatePart(parts, 'hour'),
    getDatePart(parts, 'minute'),
    getDatePart(parts, 'second'),
  )
}

const parseTripDateTimestamp = (
  value?: string | null,
  options: { endOfDay?: boolean } = {},
) => {
  if (!value) {
    return null
  }

  const match = String(value)
    .trim()
    .match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/,
    )

  if (!match) {
    return null
  }

  const hasTime = match[4] != null
  const hour = Number(match[4] ?? 0)
  const minute = Number(match[5] ?? 0)
  const second = Number(match[6] ?? 0)
  const shouldUseEndOfDay =
    options.endOfDay && (!hasTime || (hour === 0 && minute === 0 && second === 0))

  return Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    shouldUseEndOfDay ? 23 : hour,
    shouldUseEndOfDay ? 59 : minute,
    shouldUseEndOfDay ? 59 : second,
  )
}

export const getTripTimeStatus = (
  trip: Pick<TripResponse, 'startDate' | 'endDate'>,
  nowTimestamp = getVietnamNowTimestamp(),
): TripStatusFilter | null => {
  const startTimestamp = parseTripDateTimestamp(trip.startDate)
  const endTimestamp = parseTripDateTimestamp(trip.endDate, { endOfDay: true })

  if (endTimestamp != null && endTimestamp < nowTimestamp) {
    return TripStatusFilterParameter.done
  }

  if (startTimestamp != null && startTimestamp > nowTimestamp) {
    return TripStatusFilterParameter.to_do
  }

  if (
    startTimestamp != null &&
    endTimestamp != null &&
    startTimestamp <= nowTimestamp &&
    endTimestamp >= nowTimestamp
  ) {
    return TripStatusFilterParameter.in_progress
  }

  return null
}

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
