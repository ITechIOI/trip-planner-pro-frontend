import { Box } from '@mui/material'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import emptyTravelUrl from '@/assets/generated/empty-travel.svg'
import { useRequiredTripId } from '@/app/route-helpers'
import {
  useAddTripMemberAction,
  useDeleteTripMemberAction,
  useTripMembers,
  useUpdateTripMemberRoleAction,
} from '@/features/trip-members'
import { TripMemberForm } from '@/features/trip-members/components/trip-member-form'
import { TripMemberList } from '@/features/trip-members/components/trip-member-list'
import {
  getAddTripMemberErrorMessage,
  getDeleteTripMemberErrorMessage,
  getTripMembersErrorMessage,
  getUpdateTripMemberRoleErrorMessage,
  type TripMemberFormValues,
} from '@/features/trip-members/lib'
import {
  type TripMemberPageResponse,
  type TripMemberResponse,
  TripMemberRole,
} from '@/shared'
import { useTripAccess } from '@/features/trips'
import {
  EmptyIllustration,
  EmptyState,
  ErrorState,
  PageHeader,
  PaginationControls,
  Panel,
  Skeleton,
} from '@/shared/components/ui'
import { DEFAULT_PAGE_LIMIT, getPageOffset } from '@/shared/lib/pagination'
import { showErrorToast, showSuccessToast } from '@/shared/components/toast-store'

export const TripMembersPage = () => {
  const tripId = useRequiredTripId()
  const [searchParams, setSearchParams] = useSearchParams()
  const offset = getPageOffset(searchParams.get('offset'))
  const membersQuery = useTripMembers(
    tripId ?? 0,
    { offset, limit: DEFAULT_PAGE_LIMIT },
    { query: { enabled: Boolean(tripId) } },
  )
  const addMember = useAddTripMemberAction()
  const updateMemberRole = useUpdateTripMemberRoleAction()
  const deleteMember = useDeleteTripMemberAction()
  const tripAccess = useTripAccess(tripId)
  const canManageMembers = tripAccess.canManageMembers
  const membersPage = membersQuery.data as TripMemberPageResponse | undefined
  const members = useMemo(
    () => (membersPage?.items ?? []) as TripMemberResponse[],
    [membersPage],
  )
  const updateOffset = (nextOffset: number) => {
    const next = new URLSearchParams(searchParams)

    if (nextOffset > 0) {
      next.set('offset', String(nextOffset))
    } else {
      next.delete('offset')
    }

    setSearchParams(next)
  }

  const handleAddMember = (
    values: TripMemberFormValues,
    onSuccess: () => void,
  ) => {
    if (!tripId) {
      return
    }

    if (!canManageMembers) {
      showErrorToast('Only the trip owner can manage members.')
      return
    }

    addMember.mutate(
      {
        tripId,
        data: {
          email: values.email.trim(),
          role: values.role,
        },
      },
      {
        onError: (error) => showErrorToast(getAddTripMemberErrorMessage(error)),
        onSuccess: () => {
          onSuccess()
          showSuccessToast('Member added.')
        },
      },
    )
  }

  const handleRoleChange = (
    member: TripMemberResponse,
    role: TripMemberRole,
  ) => {
    if (!tripId || !member.id || member.role === role) {
      return
    }

    if (!canManageMembers) {
      showErrorToast('Only the trip owner can manage members.')
      return
    }

    updateMemberRole.mutate(
      {
        tripId,
        memberId: member.id,
        data: { role },
      },
      {
        onError: (error) =>
          showErrorToast(getUpdateTripMemberRoleErrorMessage(error)),
        onSuccess: () => showSuccessToast('Member role updated.'),
      },
    )
  }

  const handleDelete = (member: TripMemberResponse) => {
    if (!tripId || !member.id) {
      return
    }

    if (!canManageMembers) {
      showErrorToast('Only the trip owner can manage members.')
      return
    }

    deleteMember.mutate(
      { tripId, memberId: member.id },
      {
        onError: (error) => showErrorToast(getDeleteTripMemberErrorMessage(error)),
        onSuccess: () => showSuccessToast('Member removed.'),
      },
    )
  }

  return (
    <Box
      className="page-stack trip-members-page"
      component="section"
      sx={{ display: 'grid', gap: 2.75 }}
    >
      <PageHeader
        title="Members"
        description="Invite collaborators, review access, and keep trip roles up to date."
      />

      {canManageMembers ? (
        <Panel
          title="Add member"
          description="Invite an existing account by email and choose the default trip role."
        >
          <TripMemberForm
            isPending={addMember.isPending}
            onSubmit={handleAddMember}
          />
        </Panel>
      ) : null}

      {membersQuery.isLoading ? <Skeleton rows={4} /> : null}

      {membersQuery.error ? (
        <ErrorState
          title="Members could not be loaded"
          description={getTripMembersErrorMessage(membersQuery.error)}
        />
      ) : null}

      {!membersQuery.isLoading && !membersQuery.error && members.length === 0 ? (
        <EmptyState
          title="No members yet"
          description="Add the first collaborator to share this trip workspace."
          illustration={<EmptyIllustration src={emptyTravelUrl} alt="" />}
        />
      ) : null}

      {members.length > 0 ? (
        <TripMemberList
          canManageMembers={canManageMembers}
          members={members}
          offset={membersPage?.offset ?? 0}
          isActionPending={updateMemberRole.isPending || deleteMember.isPending}
          onDelete={handleDelete}
          onRoleChange={handleRoleChange}
        />
      ) : null}

      <PaginationControls
        offset={membersPage?.offset}
        limit={membersPage?.limit}
        total={membersPage?.total}
        disabled={membersQuery.isFetching}
        onOffsetChange={updateOffset}
      />
    </Box>
  )
}
