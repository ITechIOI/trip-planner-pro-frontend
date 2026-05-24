import { useQuery } from '@tanstack/react-query'
import type { ItineraryPageResponse, ItineraryResponse } from '@/shared'
import {
  getQueryTripItinerariesQueryKey,
  queryTripItineraries,
} from '@/shared'
import {
  CALENDAR_PAGE_LIMIT,
  getCalendarMonthRange,
  normalizeCalendarMonth,
} from '../lib/itinerary-calendar'

const MAX_CALENDAR_PAGES = 12

export const useItineraryCalendar = (
  tripId: number,
  month: string,
  enabled = true,
) => {
  const normalizedMonth = normalizeCalendarMonth(month)

  return useQuery({
    queryKey: [
      ...getQueryTripItinerariesQueryKey(tripId, {
        ...getCalendarMonthRange(normalizedMonth),
        limit: CALENDAR_PAGE_LIMIT,
      }),
      'calendar',
      normalizedMonth,
    ],
    enabled: enabled && Number.isFinite(tripId),
    queryFn: async ({ signal }) => {
      const monthRange = getCalendarMonthRange(normalizedMonth)
      const items: ItineraryResponse[] = []
      let offset = 0
      let total = 0

      for (let page = 0; page < MAX_CALENDAR_PAGES; page += 1) {
        const response = await queryTripItineraries(
          tripId,
          {
            ...monthRange,
            offset,
            limit: CALENDAR_PAGE_LIMIT,
          },
          signal,
        )
        const pageItems = response.items ?? []

        items.push(...pageItems)
        total = response.total ?? items.length

        if (
          pageItems.length < CALENDAR_PAGE_LIMIT ||
          items.length >= total
        ) {
          break
        }

        offset += CALENDAR_PAGE_LIMIT
      }

      return {
        items,
        offset: 0,
        limit: CALENDAR_PAGE_LIMIT,
        total,
      } satisfies ItineraryPageResponse
    },
  })
}
