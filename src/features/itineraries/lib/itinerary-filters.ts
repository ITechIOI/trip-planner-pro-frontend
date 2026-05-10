import type { QueryTripItinerariesParams } from '@/shared'
import { compactParams } from '@/shared/lib/display'
import { DEFAULT_PAGE_LIMIT, getPageOffset } from '@/shared/lib/pagination'

const CLOCK_PATTERN = /^\d{2}:\d{2}$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const toStartDateTime = (date: string, clock?: string) =>
  `${date}T${clock || '00:00'}:00`

const toEndDateTime = (date: string, clock?: string) =>
  clock ? `${date}T${clock}:00` : `${date}T23:59:59`

export type ItineraryQueryFiltersResult = {
  params: QueryTripItinerariesParams
  filterError?: string
}

export const buildItineraryQueryFilters = (
  searchParams: URLSearchParams,
): ItineraryQueryFiltersResult => {
  const date = searchParams.get('date') ?? ''
  const startClock = searchParams.get('startClock') ?? ''
  const endClock = searchParams.get('endClock') ?? ''
  const baseParams = compactParams({
    search: searchParams.get('search') ?? '',
    category: searchParams.get('category') ?? '',
    status: searchParams.get('status') ?? '',
    priority: searchParams.get('priority') ?? '',
    offset: getPageOffset(searchParams.get('offset')),
    limit: DEFAULT_PAGE_LIMIT,
  }) as QueryTripItinerariesParams

  if ((startClock || endClock) && !date) {
    return {
      params: { limit: DEFAULT_PAGE_LIMIT },
      filterError: 'Choose a date before filtering by start or end time.',
    }
  }

  if (date && !DATE_PATTERN.test(date)) {
    return {
      params: { limit: DEFAULT_PAGE_LIMIT },
      filterError: 'Choose a valid date.',
    }
  }

  if (
    (startClock && !CLOCK_PATTERN.test(startClock)) ||
    (endClock && !CLOCK_PATTERN.test(endClock))
  ) {
    return {
      params: { limit: DEFAULT_PAGE_LIMIT },
      filterError: 'Choose valid start and end times.',
    }
  }

  if (date && startClock && endClock && startClock > endClock) {
    return {
      params: { limit: DEFAULT_PAGE_LIMIT },
      filterError: 'End time must be after start time.',
    }
  }

  if (!date) {
    return { params: baseParams }
  }

  return {
    params: {
      ...baseParams,
      startTime: toStartDateTime(date, startClock),
      endTime: toEndDateTime(date, endClock),
    },
  }
}
