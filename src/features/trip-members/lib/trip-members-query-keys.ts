import { getListTripMembersQueryKey } from "@/shared";

export const tripMembersQueryKeys = {
  list: getListTripMembersQueryKey,
  affectedTripMembers: (
    tripId: Parameters<typeof getListTripMembersQueryKey>[0],
  ) => [getListTripMembersQueryKey(tripId)],
};
