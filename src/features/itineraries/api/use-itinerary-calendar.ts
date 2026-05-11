import { useQuery } from '@tanstack/react-query'
import {
  getQueryTripItinerariesQueryKey,
  queryTripItineraries,
  type ItineraryPageResponse,
  type ItineraryResponse,
} from '@/shared'
import {
  CALENDAR_PAGE_LIMIT,
  getCalendarMonthRange,
} from '../lib/itinerary-calendar'

export const useItineraryCalendar = (
  tripId: number | undefined,
  month: string,
  enabled = true,
) => {
  return useQuery({
    enabled: Boolean(tripId) && enabled,
    queryKey: [
      ...(tripId ? getQueryTripItinerariesQueryKey(tripId) : ['itineraries']),
      'calendar',
      month,
    ],
    queryFn: async ({ signal }) => {
      if (!tripId) {
        return { items: [], offset: 0, limit: CALENDAR_PAGE_LIMIT, total: 0 }
      }

      const range = getCalendarMonthRange(month)
      const items: ItineraryResponse[] = []
      let offset = 0
      let total: number | undefined

      do {
        const page = (await queryTripItineraries(
          tripId,
          {
            ...range,
            offset,
            limit: CALENDAR_PAGE_LIMIT,
          },
          signal,
        )) as ItineraryPageResponse
        const pageItems = (page.items ?? []) as ItineraryResponse[]

        items.push(...pageItems)
        total = page.total ?? items.length

        if (pageItems.length < CALENDAR_PAGE_LIMIT) {
          break
        }

        offset += CALENDAR_PAGE_LIMIT
      } while (total === undefined || items.length < total)

      return {
        items,
        offset: 0,
        limit: CALENDAR_PAGE_LIMIT,
        total: total ?? items.length,
      }
    },
  })
}
