
export const ITINERARY_CATEGORIES = [
  'TRANSPORT',
  'FOOD',
  'SIGHTSEEING',
  'SHOPPING',
  'HOTEL',
  'OTHER',
]

export const ITINERARY_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']

export const ITINERARY_STATUSES = ['PLANNED', 'IN_PROGRESS', 'DONE']


export function toItineraryEnum(value, allowed, fallback) {
  if (value == null || value === '') return fallback
  const normalized = String(value).trim().toUpperCase().replace(/\s+/g, '_')
  return allowed.includes(normalized) ? normalized : fallback
}


export function toIsoDateTime(date, time) {
  if (!date || !time) return null
  return new Date(`${date}T${time}:00`).toISOString()
}


export function parseIsoToFormFields(isoString) {
  if (!isoString) return { date: '', time: '' }
  const d = new Date(isoString)
  const pad = (n) => String(n).padStart(2, '0')
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  }
}

export function normalizeTripFromApi(trip) {
  if (!trip) return null
  const toDateOnly = (value) => {
    if (!value) return ''
    return String(value).split('T')[0]
  }
  return {
    id: trip.id,
    tripName: trip.name ?? trip.tripName ?? 'Untitled Trip',
    destination: trip.destination ?? '',
    budget: trip.estimatedBudget ?? trip.budget ?? 0,
    startDate: toDateOnly(trip.startDate),
    endDate: toDateOnly(trip.endDate),
    itinerary: [],
  }
}


export function normalizeItineraryFromApi(item) {
  if (!item) return item
  return {
    ...item,
    category: toItineraryEnum(item.category, ITINERARY_CATEGORIES, 'OTHER'),
    priority: toItineraryEnum(item.priority, ITINERARY_PRIORITIES, 'MEDIUM'),
    status: toItineraryEnum(item.status, ITINERARY_STATUSES, 'PLANNED'),
  }
}


export function buildItineraryApiPayload(formFields) {
  const location = formFields.location?.trim()
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
      'SIGHTSEEING',
    ),
    priority: toItineraryEnum(
      formFields.priority,
      ITINERARY_PRIORITIES,
      'MEDIUM',
    ),
    status: toItineraryEnum(
      formFields.status,
      ITINERARY_STATUSES,
      'PLANNED',
    ),
  }
}


export function buildItineraryUpdatePayload(item) {
  const payload = {}
  if (item.activityTitle != null) payload.activityTitle = item.activityTitle
  if (item.location !== undefined) payload.location = item.location ?? null
  if (item.startTime !== undefined) payload.startTime = item.startTime ?? null
  if (item.endTime !== undefined) payload.endTime = item.endTime ?? null
  if (item.category != null) {
    payload.category = toItineraryEnum(
      item.category,
      ITINERARY_CATEGORIES,
      'OTHER',
    )
  }
  if (item.priority != null) {
    payload.priority = toItineraryEnum(
      item.priority,
      ITINERARY_PRIORITIES,
      'MEDIUM',
    )
  }
  if (item.status != null) {
    payload.status = toItineraryEnum(
      item.status,
      ITINERARY_STATUSES,
      'PLANNED',
    )
  }
  return payload
}

export function getApiErrorMessage(error, fallback = 'Request failed') {
  const data = error?.response?.data
  if (typeof data === 'string') return data
  if (data?.message) return data.message
  if (data?.error) return data.error
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.message || e).join(', ')
  }
  return error?.message || fallback
}
