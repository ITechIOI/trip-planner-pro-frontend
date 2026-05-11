import { describe, expect, it } from 'vitest'
import type { ItineraryResponse } from '@/shared'
import {
  buildCalendarDays,
  getCalendarMonthRange,
  groupItinerariesByDate,
  normalizeCalendarMonth,
  shiftCalendarMonth,
} from './itinerary-calendar'

describe('itinerary calendar helpers', () => {
  it('normalizes month params and builds a local month query range', () => {
    expect(normalizeCalendarMonth('2026-06')).toBe('2026-06')
    expect(getCalendarMonthRange('2026-06')).toEqual({
      startTime: '2026-06-01T00:00:00',
      endTime: '2026-06-30T23:59:59',
    })
  })

  it('builds a stable 6-week calendar grid', () => {
    const days = buildCalendarDays('2026-06')

    expect(days).toHaveLength(42)
    expect(days[0].dateKey).toBe('2026-05-31')
    expect(days.some((day) => day.dateKey === '2026-06-10')).toBe(true)
  })

  it('shifts months without UTC timezone drift', () => {
    expect(shiftCalendarMonth('2026-04', 1)).toBe('2026-05')
    expect(shiftCalendarMonth('2026-04', -1)).toBe('2026-03')
    expect(shiftCalendarMonth('2026-12', 1)).toBe('2027-01')
  })

  it('groups only dated itinerary items by day', () => {
    const items = [
      { id: 1, activityTitle: 'Flight', startTime: '2026-06-10T08:00:00' },
      { id: 2, activityTitle: 'Dinner', endTime: '2026-06-10T20:00:00' },
      { id: 3, activityTitle: 'Flexible activity' },
    ] as ItineraryResponse[]

    expect(groupItinerariesByDate(items)).toEqual({
      '2026-06-10': [items[0], items[1]],
    })
  })
})
