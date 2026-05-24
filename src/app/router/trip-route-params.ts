export type TripRouteParams = {
  tripId: string
}

export const parseTripIdParam = (tripId: string | undefined): number | null => {
  if (!tripId) {
    return null
  }

  const parsed = Number.parseInt(tripId, 10)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}
