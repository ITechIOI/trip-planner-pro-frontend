import {
  getGetItineraryQueryKey,
  getGetTripDashboardQueryKey,
  getGetTripItineraryQueryKey,
  getListTripItinerariesQueryKey,
  getQueryTripItinerariesQueryKey,
} from "@/shared";

type TripId = Parameters<typeof getListTripItinerariesQueryKey>[0];
type ItineraryId = Parameters<typeof getGetTripItineraryQueryKey>[1];

const affectedTripItineraries = (tripId: TripId) => [
  getListTripItinerariesQueryKey(tripId),
  getQueryTripItinerariesQueryKey(tripId),
  getGetTripDashboardQueryKey(tripId),
];

const affectedItinerary = (tripId: TripId, itineraryId: ItineraryId) => [
  ...affectedTripItineraries(tripId),
  getGetTripItineraryQueryKey(tripId, itineraryId),
  getGetItineraryQueryKey(itineraryId),
];

export const itinerariesQueryKeys = {
  tripList: getListTripItinerariesQueryKey,
  tripQuery: getQueryTripItinerariesQueryKey,
  tripDetail: getGetTripItineraryQueryKey,
  detail: getGetItineraryQueryKey,
  affectedTripItineraries,
  affectedItinerary,
};
