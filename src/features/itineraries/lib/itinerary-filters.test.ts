import { describe, expect, it } from 'vitest'
import {
  ItineraryCategory,
  ItineraryPriority,
  ItineraryStatus,
} from '@/shared'
import { buildItineraryQueryFilters } from './itinerary-filters'

const buildSearchParams = (entries: Record<string, string>) =>
  new URLSearchParams(entries)

describe('itinerary filters', () => {
  it('maps date-only filters to a full local day range', () => {
    const result = buildItineraryQueryFilters(
      buildSearchParams({ date: '2026-06-10' }),
    )

    expect(result.filterError).toBeUndefined()
    expect(result.params).toMatchObject({
      startTime: '2026-06-10T00:00:00',
      endTime: '2026-06-10T23:59:59',
      limit: 50,
    })
  })

  it('maps date and clock filters to local date-time bounds', () => {
    const result = buildItineraryQueryFilters(
      buildSearchParams({
        date: '2026-06-10',
        startClock: '08:30',
        endClock: '18:45',
        search: 'hotel',
        category: ItineraryCategory.HOTEL,
        status: ItineraryStatus.PLANNED,
        priority: ItineraryPriority.HIGH,
        offset: '50',
      }),
    )

    expect(result.filterError).toBeUndefined()
    expect(result.params).toEqual({
      search: 'hotel',
      category: ItineraryCategory.HOTEL,
      status: ItineraryStatus.PLANNED,
      priority: ItineraryPriority.HIGH,
      startTime: '2026-06-10T08:30:00',
      endTime: '2026-06-10T18:45:00',
      offset: 50,
      limit: 50,
    })
  })

  it('keeps a selected date scoped when only one clock bound is provided', () => {
    expect(
      buildItineraryQueryFilters(
        buildSearchParams({
          date: '2026-06-10',
          startClock: '08:30',
        }),
      ).params,
    ).toMatchObject({
      startTime: '2026-06-10T08:30:00',
      endTime: '2026-06-10T23:59:59',
    })

    expect(
      buildItineraryQueryFilters(
        buildSearchParams({
          date: '2026-06-10',
          endClock: '18:45',
        }),
      ).params,
    ).toMatchObject({
      startTime: '2026-06-10T00:00:00',
      endTime: '2026-06-10T18:45:00',
    })
  })

  it('requires a date when a clock filter is present', () => {
    const result = buildItineraryQueryFilters(
      buildSearchParams({ startClock: '08:00' }),
    )

    expect(result.filterError).toBe(
      'Choose a date before filtering by start or end time.',
    )
    expect(result.params).toEqual({ limit: 50 })
  })

  it('rejects an end time earlier than the start time', () => {
    const result = buildItineraryQueryFilters(
      buildSearchParams({
        date: '2026-06-10',
        startClock: '18:00',
        endClock: '08:00',
      }),
    )

    expect(result.filterError).toBe('End time must be after start time.')
    expect(result.params).toEqual({ limit: 50 })
  })
})
