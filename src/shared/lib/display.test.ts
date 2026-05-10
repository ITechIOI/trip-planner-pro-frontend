import { describe, expect, it } from 'vitest'
import { ItineraryStatus } from '@/shared'
import {
  compactParams,
  formatCurrency,
  formatPercent,
  isItineraryOverdue,
} from './display'

describe('display helpers', () => {
  it('formats currency and clamps percent values for UI display', () => {
    expect(formatCurrency(1_500_000)).toBe('1.500.000 ₫')
    expect(formatPercent(120)).toBe('100%')
    expect(formatPercent(-10)).toBe('0%')
  })

  it('removes empty query params but preserves zero values', () => {
    expect(compactParams({ search: '', offset: 0, limit: 50 })).toEqual({
      offset: 0,
      limit: 50,
    })
  })

  it('detects overdue itinerary items from visible status and times', () => {
    expect(
      isItineraryOverdue(
        {
          status: ItineraryStatus.PLANNED,
          startTime: '2026-06-10T09:00:00',
        },
        new Date('2026-06-10T10:00:00'),
      ),
    ).toBe(true)

    expect(
      isItineraryOverdue(
        {
          status: ItineraryStatus.DONE,
          startTime: '2026-06-10T09:00:00',
        },
        new Date('2026-06-10T10:00:00'),
      ),
    ).toBe(false)
  })
})
