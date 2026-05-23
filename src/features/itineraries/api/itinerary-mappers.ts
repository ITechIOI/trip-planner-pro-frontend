import type {
  CreateItineraryRequest,
  ItineraryCategory,
  ItineraryPriority,
  ItineraryResponse,
  ItineraryStatus,
  TripResponse,
  UpdateItineraryRequest,
} from '@/shared'
import {
  ItineraryCategory as ItineraryCategoryEnum,
  ItineraryPriority as ItineraryPriorityEnum,
  ItineraryStatus as ItineraryStatusEnum,
} from '@/shared'

export type ItineraryRequest = CreateItineraryRequest

export const ITINERARY_CATEGORIES = Object.values(
  ItineraryCategoryEnum,
) as ItineraryCategory[]

export const ITINERARY_PRIORITIES = Object.values(
  ItineraryPriorityEnum,
) as ItineraryPriority[]

export const ITINERARY_STATUSES = Object.values(
  ItineraryStatusEnum,
) as ItineraryStatus[]

export interface ItineraryFormFields {
  activityTitle: string
  location: string
  date: string
  startTime: string
  endTime: string
  category: ItineraryCategory
  priority: ItineraryPriority
  status: ItineraryStatus
}

export interface ParsedIsoFormFields {
  date: string
  time: string
}

export interface NormalizedTrip {
  id?: number
  tripName: string
  destination: string
  budget: number
  startDate: string
  endDate: string
  itinerary: ItineraryResponse[]
}

export function toItineraryEnum<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  if (value == null || value === '') {
    return fallback
  }

  const normalized = String(value).trim().toUpperCase().replace(/\s+/g, '_')
  return (allowed as readonly string[]).includes(normalized)
    ? (normalized as T)
    : fallback
}

export function toIsoDateTime(date: string, time: string): string | null {
  if (!date || !time) {
    return null
  }

  return new Date(`${date}T${time}:00`).toISOString()
}

export function parseIsoToFormFields(isoString?: string | null): ParsedIsoFormFields {
  if (!isoString) {
    return { date: '', time: '' }
  }

  const parsed = new Date(isoString)
  const pad = (value: number) => String(value).padStart(2, '0')

  return {
    date: `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`,
    time: `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`,
  }
}

export function normalizeTripFromApi(trip: TripResponse | null | undefined): NormalizedTrip | null {
  if (!trip) {
    return null
  }

  const toDateOnly = (value?: string | null) => {
    if (!value) {
      return ''
    }

    return String(value).split('T')[0] ?? ''
  }

  return {
    id: trip.id,
    tripName: trip.name ?? 'Untitled Trip',
    destination: '',
    budget: trip.estimatedBudget ?? 0,
    startDate: toDateOnly(trip.startDate),
    endDate: toDateOnly(trip.endDate),
    itinerary: [],
  }
}

export function normalizeItineraryFromApi(
  item: ItineraryResponse | null | undefined,
): ItineraryResponse | null | undefined {
  if (!item) {
    return item
  }

  return {
    ...item,
    category: toItineraryEnum(
      item.category,
      ITINERARY_CATEGORIES,
      ItineraryCategoryEnum.OTHER,
    ),
    priority: toItineraryEnum(
      item.priority,
      ITINERARY_PRIORITIES,
      ItineraryPriorityEnum.MEDIUM,
    ),
    status: toItineraryEnum(
      item.status,
      ITINERARY_STATUSES,
      ItineraryStatusEnum.PLANNED,
    ),
  }
}

export function buildItineraryApiPayload(
  formFields: ItineraryFormFields,
): CreateItineraryRequest {
  const location = formFields.location.trim()

  return {
    activityTitle: formFields.activityTitle.trim(),
    location: location || null,
    startTime: toIsoDateTime(formFields.date, formFields.startTime),
    endTime: formFields.endTime
      ? toIsoDateTime(formFields.date, formFields.endTime)
      : null,
    category: toItineraryEnum(
      formFields.category,
      ITINERARY_CATEGORIES,
      ItineraryCategoryEnum.SIGHTSEEING,
    ),
    priority: toItineraryEnum(
      formFields.priority,
      ITINERARY_PRIORITIES,
      ItineraryPriorityEnum.MEDIUM,
    ),
    status: toItineraryEnum(
      formFields.status,
      ITINERARY_STATUSES,
      ItineraryStatusEnum.PLANNED,
    ),
  }
}

export function buildItineraryUpdatePayload(
  item: Partial<ItineraryResponse> & {
    activityTitle?: string
    location?: string | null
    startTime?: string | null
    endTime?: string | null
    category?: ItineraryCategory | string
    priority?: ItineraryPriority | string
    status?: ItineraryStatus | string
  },
): UpdateItineraryRequest {
  const payload: UpdateItineraryRequest = {}

  if (item.activityTitle != null) {
    payload.activityTitle = item.activityTitle
  }

  if (item.location !== undefined) {
    payload.location = item.location ?? null
  }

  if (item.startTime !== undefined) {
    payload.startTime = item.startTime ?? null
  }

  if (item.endTime !== undefined) {
    payload.endTime = item.endTime ?? null
  }

  if (item.category != null) {
    payload.category = toItineraryEnum(
      item.category,
      ITINERARY_CATEGORIES,
      ItineraryCategoryEnum.OTHER,
    )
  }

  if (item.priority != null) {
    payload.priority = toItineraryEnum(
      item.priority,
      ITINERARY_PRIORITIES,
      ItineraryPriorityEnum.MEDIUM,
    )
  }

  if (item.status != null) {
    payload.status = toItineraryEnum(
      item.status,
      ITINERARY_STATUSES,
      ItineraryStatusEnum.PLANNED,
    )
  }

  return payload
}
