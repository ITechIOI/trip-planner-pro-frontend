import {
  getGetTripDashboardQueryKey,
  getGetTripQueryKey,
  getListTripsQueryKey,
  getQueryTripsQueryKey,
} from "@/shared";

type TripId = Parameters<typeof getGetTripQueryKey>[0];

const affectedTripCollection = () => [
  getListTripsQueryKey(),
  getQueryTripsQueryKey(),
];

const affectedTrip = (tripId: TripId) => [
  ...affectedTripCollection(),
  getGetTripQueryKey(tripId),
  getGetTripDashboardQueryKey(tripId),
];

export const tripsQueryKeys = {
  list: getListTripsQueryKey,
  query: getQueryTripsQueryKey,
  detail: getGetTripQueryKey,
  dashboard: getGetTripDashboardQueryKey,
  affectedTripCollection,
  affectedTrip,
};
