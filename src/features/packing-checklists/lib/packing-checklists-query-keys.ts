import {
  getGetPackingChecklistQueryKey,
  getGetTripDashboardQueryKey,
  getGetTripPackingChecklistQueryKey,
  getListTripPackingChecklistsQueryKey,
  getQueryTripPackingChecklistsQueryKey,
} from "@/shared";

type TripId = Parameters<typeof getListTripPackingChecklistsQueryKey>[0];
type ChecklistId = Parameters<typeof getGetTripPackingChecklistQueryKey>[1];

const affectedTripPackingChecklists = (tripId: TripId) => [
  getListTripPackingChecklistsQueryKey(tripId),
  getQueryTripPackingChecklistsQueryKey(tripId),
  getGetTripDashboardQueryKey(tripId),
];

const affectedPackingChecklist = (
  tripId: TripId,
  checklistId: ChecklistId,
) => [
  ...affectedTripPackingChecklists(tripId),
  getGetTripPackingChecklistQueryKey(tripId, checklistId),
  getGetPackingChecklistQueryKey(checklistId),
];

export const packingChecklistsQueryKeys = {
  tripList: getListTripPackingChecklistsQueryKey,
  tripQuery: getQueryTripPackingChecklistsQueryKey,
  tripDetail: getGetTripPackingChecklistQueryKey,
  detail: getGetPackingChecklistQueryKey,
  affectedTripPackingChecklists,
  affectedPackingChecklist,
};
