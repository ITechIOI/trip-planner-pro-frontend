import { describe, expect, it } from 'vitest'
import {
  ItineraryCategory,
  ItineraryPriority,
  ItineraryStatus,
} from '@/shared'
import { itinerarySchema, toItineraryRequestData } from './itinerary-schema'

const validItinerary = {
  activityTitle: 'Airport transfer',
  location: 'Da Nang',
  startTime: '2026-06-10T10:00',
  endTime: '2026-06-10T11:00',
  category: ItineraryCategory.TRANSPORT,
  priority: ItineraryPriority.MEDIUM,
  status: ItineraryStatus.PLANNED,
}

describe('itinerary schema', () => {
  it('rejects an end time before the start time', () => {
    const result = itinerarySchema.safeParse({
      ...validItinerary,
      endTime: '2026-06-10T09:00',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      'End time must be after start time',
    )
  })

  it('normalizes optional fields for API requests', () => {
    expect(
      toItineraryRequestData({
        ...validItinerary,
        location: '',
      }),
    ).toMatchObject({
      location: null,
      startTime: '2026-06-10T10:00:00',
      endTime: '2026-06-10T11:00:00',
    })
  })
})
