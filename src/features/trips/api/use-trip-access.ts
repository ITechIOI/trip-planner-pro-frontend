import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTripMembers } from '@/features/trip-members'
import { useCurrentUser } from '@/features/users'
import {
  getListTripMembersQueryKey,
  listTripMembers,
  type TripMemberPageResponse,
  type TripMemberResponse,
  type TripResponse,
  type UserResponse,
} from '@/shared'
import { DEFAULT_PAGE_LIMIT } from '@/shared/lib/pagination'
import {
  resolveTripAccess,
  type TripAccess,
} from '../lib/trip-access'
import { useTrip } from './use-trip-action'

const tripAccessMemberParams = { limit: DEFAULT_PAGE_LIMIT }

export const useTripAccess = (tripId?: number | null) => {
  const currentUserQuery = useCurrentUser()
  const tripQuery = useTrip(tripId ?? 0, {
    query: { enabled: Boolean(tripId) },
  })
  const membersQuery = useTripMembers(
    tripId ?? 0,
    tripAccessMemberParams,
    {
      query: { enabled: Boolean(tripId && currentUserQuery.data) },
    },
  )
  const currentUser = currentUserQuery.data as UserResponse | undefined
  const trip = tripQuery.data as TripResponse | undefined
  const membersPage = membersQuery.data as TripMemberPageResponse | undefined
  const access = useMemo(
    () =>
      resolveTripAccess({
        currentUser,
        trip,
        members: (membersPage?.items ?? []) as TripMemberResponse[],
      }),
    [currentUser, membersPage, trip],
  )

  return {
    ...access,
    error: currentUserQuery.error ?? tripQuery.error ?? membersQuery.error,
    isFetching:
      currentUserQuery.isFetching || tripQuery.isFetching || membersQuery.isFetching,
    isLoading:
      currentUserQuery.isLoading || tripQuery.isLoading || membersQuery.isLoading,
  }
}

export const useTripAccessMap = (trips: TripResponse[]) => {
  const currentUserQuery = useCurrentUser()
  const currentUser = currentUserQuery.data as UserResponse | undefined
  const tripIds = useMemo(
    () =>
      trips
        .map((trip) => trip.id)
        .filter((tripId): tripId is number => Boolean(tripId)),
    [trips],
  )
  const memberQueries = useQueries({
    queries: tripIds.map((tripId) => ({
      enabled: Boolean(currentUser),
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        listTripMembers(tripId, tripAccessMemberParams, signal),
      queryKey: getListTripMembersQueryKey(tripId, tripAccessMemberParams),
    })),
  })
  const accessByTripId = useMemo(() => {
    return trips.reduce<Record<number, TripAccess>>((accumulator, trip, index) => {
      if (!trip.id) {
        return accumulator
      }

      const membersPage = memberQueries[index]?.data as
        | TripMemberPageResponse
        | undefined
      const members = (membersPage?.items ?? []) as TripMemberResponse[]

      accumulator[trip.id] = resolveTripAccess({
        currentUser,
        trip,
        members,
      })

      return accumulator
    }, {})
  }, [currentUser, memberQueries, trips])

  return {
    accessByTripId,
    isFetching:
      currentUserQuery.isFetching ||
      memberQueries.some((query) => query.isFetching),
    isLoading:
      currentUserQuery.isLoading ||
      memberQueries.some((query) => query.isLoading),
  }
}
