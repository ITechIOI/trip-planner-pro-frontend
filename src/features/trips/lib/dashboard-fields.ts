import {
  BudgetWarningLevel,
  ItineraryStatus,
  type BudgetWarningLevel as BudgetWarningLevelValue,
  type ItineraryStatus as ItineraryStatusValue,
} from '@/shared'

export type DashboardTone = 'primary' | 'success' | 'warning' | 'error' | 'info'

export const clampDashboardPercent = (value?: number | null) =>
  Math.min(100, Math.max(0, value ?? 0))

export const formatDashboardPercent = (value?: number | null) =>
  `${Math.round(clampDashboardPercent(value))}%`

export const formatDashboardCurrency = (value?: number | null) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value ?? 0)

export const getBudgetWarningTone = (
  warningLevel?: BudgetWarningLevelValue | null,
): DashboardTone => {
  switch (warningLevel) {
    case BudgetWarningLevel.CRITICAL:
      return 'error'
    case BudgetWarningLevel.WARNING:
      return 'warning'
    case BudgetWarningLevel.SAFE:
    default:
      return 'success'
  }
}

export const getBudgetWarningLabel = (
  warningLevel?: BudgetWarningLevelValue | null,
) => {
  switch (warningLevel) {
    case BudgetWarningLevel.CRITICAL:
      return 'Critical'
    case BudgetWarningLevel.WARNING:
      return 'Warning'
    case BudgetWarningLevel.SAFE:
    default:
      return 'Safe'
  }
}

export const getItineraryStatusTone = (
  status?: ItineraryStatusValue | null,
): DashboardTone => {
  switch (status) {
    case ItineraryStatus.DONE:
      return 'success'
    case ItineraryStatus.IN_PROGRESS:
      return 'warning'
    case ItineraryStatus.PLANNED:
    default:
      return 'info'
  }
}

export const getItineraryStatusLabel = (
  status?: ItineraryStatusValue | null,
) => {
  switch (status) {
    case ItineraryStatus.DONE:
      return 'Done'
    case ItineraryStatus.IN_PROGRESS:
      return 'In progress'
    case ItineraryStatus.PLANNED:
    default:
      return 'Planned'
  }
}

export const formatDashboardDate = (value?: string | null) => {
  if (!value) {
    return 'No date'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'No date'
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatDashboardDateRange = (
  startDate?: string | null,
  endDate?: string | null,
) => `${formatDashboardDate(startDate)} - ${formatDashboardDate(endDate)}`

export const formatDashboardTime = (value?: string | null) => {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDashboardTimeRange = (
  startTime?: string | null,
  endTime?: string | null,
) => {
  const start = formatDashboardTime(startTime)
  const end = formatDashboardTime(endTime)

  if (!start && !end) {
    return null
  }

  return end ? `${start ?? 'No start time'} - ${end}` : start
}
