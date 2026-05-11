import { describe, expect, it } from 'vitest'
import { TripMemberRole, type TripMemberResponse, type TripResponse, type UserResponse } from '@/shared'
import { resolveTripAccess } from './trip-access'

const currentUser: UserResponse = {
  id: 501,
  fullName: 'Demo Traveler',
  email: 'demo@example.com',
  avatarUrl: null,
  phone: null,
  username: 'demo',
}

const trip: TripResponse = {
  id: 1,
  name: 'Da Nang Family Trip',
  estimatedBudget: 12_000_000,
  ownerId: 999,
  startDate: '2026-06-10T00:00:00',
  endDate: '2026-06-14T00:00:00',
}

const member = (role: TripMemberRole): TripMemberResponse => ({
  id: 401,
  userId: 501,
  tripId: 1,
  role,
})

describe('resolveTripAccess', () => {
  it('allows owners to manage members and resources', () => {
    expect(
      resolveTripAccess({
        currentUser,
        trip: { ...trip, ownerId: currentUser.id },
        members: [],
      }),
    ).toMatchObject({
      role: 'OWNER',
      canManageMembers: true,
      canManageResources: true,
    })
  })

  it('allows editors to manage resources but not members', () => {
    expect(
      resolveTripAccess({
        currentUser,
        trip,
        members: [member(TripMemberRole.EDIT)],
      }),
    ).toMatchObject({
      role: TripMemberRole.EDIT,
      canManageMembers: false,
      canManageResources: true,
    })
  })

  it('keeps viewers and unknown members read-only', () => {
    expect(
      resolveTripAccess({
        currentUser,
        trip,
        members: [member(TripMemberRole.VIEW)],
      }),
    ).toMatchObject({
      role: TripMemberRole.VIEW,
      canManageMembers: false,
      canManageResources: false,
    })

    expect(
      resolveTripAccess({
        currentUser,
        trip,
        members: [],
      }),
    ).toMatchObject({
      role: null,
      canManageMembers: false,
      canManageResources: false,
    })
  })
})
