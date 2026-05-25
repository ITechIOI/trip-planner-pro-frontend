import { decodeTripRouteId } from './trip-route-id'

export type TripRouteParams = {
  tripId: string
}

export const parseTripIdParam = (tripId: string | undefined): number | null =>
  decodeTripRouteId(tripId)
