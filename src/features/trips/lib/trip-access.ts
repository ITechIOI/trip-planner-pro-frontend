import {
  TripMemberRole,
  type TripMemberResponse,
  type TripResponse,
  type UserResponse,
} from '@/shared'

export const OWNER_TRIP_ROLE = 'OWNER' as const

export type TripAccessRole =
  | typeof OWNER_TRIP_ROLE
  | TripMemberRole
  | null

export type TripAccess = {
  role: TripAccessRole
  canManageMembers: boolean
  canManageResources: boolean
  canViewMembers: boolean
  canViewResources: boolean
}

const readOnlyAccess: TripAccess = {
  role: null,
  canManageMembers: false,
  canManageResources: false,
  canViewMembers: false,
  canViewResources: false,
}

export const resolveTripAccess = ({
  currentUser,
  trip,
  members,
}: {
  currentUser?: UserResponse
  trip?: TripResponse
  members?: TripMemberResponse[]
}): TripAccess => {
  const currentUserId = currentUser?.id

  if (!currentUserId || !trip) {
    return readOnlyAccess
  }

  if (trip.ownerId === currentUserId) {
    return {
      role: OWNER_TRIP_ROLE,
      canManageMembers: true,
      canManageResources: true,
      canViewMembers: true,
      canViewResources: true,
    }
  }

  const memberRole = members?.find(
    (member) => member.userId === currentUserId || member.user?.id === currentUserId,
  )?.role

  if (memberRole === TripMemberRole.EDIT) {
    return {
      role: TripMemberRole.EDIT,
      canManageMembers: false,
      canManageResources: true,
      canViewMembers: true,
      canViewResources: true,
    }
  }

  if (memberRole === TripMemberRole.VIEW) {
    return {
      role: TripMemberRole.VIEW,
      canManageMembers: false,
      canManageResources: false,
      canViewMembers: true,
      canViewResources: true,
    }
  }

  return readOnlyAccess
}

export const getTripAccessLabel = (role: TripAccessRole) => {
  if (role === OWNER_TRIP_ROLE) {
    return 'Owner'
  }

  if (role === TripMemberRole.EDIT) {
    return 'Editor'
  }

  if (role === TripMemberRole.VIEW) {
    return 'Viewer'
  }

  return 'Unknown'
}

export const getTripAccessTone = (role: TripAccessRole) => {
  if (role === OWNER_TRIP_ROLE) {
    return 'success'
  }

  if (role === TripMemberRole.EDIT) {
    return 'warning'
  }

  if (role === TripMemberRole.VIEW) {
    return 'info'
  }

  return 'neutral'
}
