import type { ItineraryResponse } from '@/shared'

type QueryParamValue = string | number | boolean | null | undefined

export const formatCurrency = (value?: number | null) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
    .format(value ?? 0)
    .replace(/\u00a0/g, ' ')
}

export const formatPercent = (value?: number | null) => {
  const percent = Math.max(0, Math.min(100, Math.round(value ?? 0)))
  return `${percent}%`
}

export const isItineraryOverdue = (
  itinerary: Pick<ItineraryResponse, 'endTime' | 'startTime' | 'status'>,
  now = new Date(),
) => {
  if (itinerary.status === 'DONE') {
    return false
  }

  const deadline = itinerary.endTime ?? itinerary.startTime

  if (!deadline) {
    return false
  }

  const deadlineDate = new Date(deadline)

  if (Number.isNaN(deadlineDate.getTime())) {
    return false
  }

  return deadlineDate.getTime() < now.getTime()
}

export const compactParams = <TParams extends Record<string, QueryParamValue>>(
  params: TParams,
) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value != null),
  ) as Partial<TParams>
}

export const formatDate = (value?: string | null) => {
  if (!value) {
    return 'No date'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export const formatDateTime = (value?: string | null) => {
  if (!value) {
    return 'No time'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const toDateInputValue = (value?: string | null) => {
  if (!value) {
    return ''
  }

  return value.slice(0, 10)
}

export const toDateTimeInputValue = (value?: string | null) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 16)
  }

  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export const fromDateTimeInputValue = (value?: string | null) => {
  if (!value) {
    return null
  }

  const normalizedValue = value.trim()

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalizedValue)) {
    return `${normalizedValue}:00`
  }

  return normalizedValue
}

export const isLocalDateTimeInputRangeValid = (
  startTime?: string | null,
  endTime?: string | null,
) => {
  if (!startTime || !endTime) {
    return true
  }

  return fromDateTimeInputValue(startTime)! <= fromDateTimeInputValue(endTime)!
}
