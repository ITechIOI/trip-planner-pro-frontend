import { useMemo, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import membersIcon from "@/assets/images/members.png";
import { ConfirmActionDialog } from "@/shared/components/confirm-action-dialog";
import { AppLayout } from "@/shared/components/app-layout";
import { EmptyState } from "@/shared/components/empty-state";
import { useTrip } from "@/features/trips/api/use-trip-action";
import { useTripAccess } from "@/features/trips/api/use-trip-access";
import { getTripsErrorMessage } from "@/features/trips/lib/trips-error";
import { OWNER_TRIP_ROLE } from "@/features/trips/lib/trip-access";
import { useUser } from "@/features/users/api/use-user-action";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import {
  TripMemberForm,
  TripMemberList,
  type TripMemberListItem,
  type TripMemberFormValues,
} from "../components";
import {
  useAddTripMemberAction,
  useDeleteTripMemberAction,
  useTripMembers,
  useUpdateTripMemberRoleAction,
} from "../api";
import { getTripMembersErrorMessage } from "../lib/trip-members-error";
import {
  type AddTripMemberMutationError,
  type DeleteTripMemberMutationError,
  type GetTripQueryError,
  type ListTripMembersQueryError,
  type TripMemberPageResponse,
  type TripMemberResponse,
  type TripMemberRole as TripMemberRoleValue,
  type TripResponse,
  type UserResponse,
  type UpdateTripMemberRoleMutationError,
} from "@/shared";

export type TripMembersPageProps = {
  tripId: number;
};

const DEFAULT_MEMBER_LIMIT = 10;

type MemberConfirmAction =
  | {
      type: "role";
      member: TripMemberListItem;
      role: TripMemberRoleValue;
    }
  | {
      type: "delete";
      member: TripMemberListItem;
    };

export const TripMembersPage = ({ tripId }: TripMembersPageProps) => {
  const [offset, setOffset] = useState(0);
  const [confirmAction, setConfirmAction] =
    useState<MemberConfirmAction | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const tripQuery = useTrip(tripId);
  const trip = tripQuery.data as TripResponse | undefined;
  const ownerId = trip?.ownerId;
  const ownerQuery = useUser(ownerId ?? 0, {
    query: { enabled: Boolean(ownerId) },
  });
  const access = useTripAccess(tripId);
  const membersParams = useMemo(
    () => ({
      offset,
      limit: DEFAULT_MEMBER_LIMIT,
    }),
    [offset],
  );
  const membersQuery = useTripMembers(tripId, membersParams, {
    query: { placeholderData: keepPreviousData },
  });
  const addMember = useAddTripMemberAction();
  const updateRole = useUpdateTripMemberRoleAction();
  const deleteMember = useDeleteTripMemberAction();
  const membersPage = membersQuery.data as TripMemberPageResponse | undefined;
  const currentOffset = membersPage?.offset ?? offset;
  const members = useMemo(
    () => (membersPage?.items ?? []) as TripMemberResponse[],
    [membersPage],
  );
  const ownerMember = useMemo<TripMemberListItem | null>(() => {
    if (!ownerId) {
      return null;
    }

    return {
      userId: ownerId,
      tripId,
      role: OWNER_TRIP_ROLE,
      user: ownerQuery.data as UserResponse | undefined,
    };
  }, [ownerId, ownerQuery.data, tripId]);
  const displayedMembers = useMemo<TripMemberListItem[]>(
    () =>
      ownerMember && currentOffset === 0
        ? [ownerMember, ...members]
        : members,
    [currentOffset, members, ownerMember],
  );
  const clearFeedback = () => {
    setFormError(null);
    setActionError(null);
    setActionMessage(null);
  };

  const handleAddMember = (
    values: TripMemberFormValues,
    onSuccess: () => void,
  ) => {
    clearFeedback();

    if (!access.canManageMembers) {
      setFormError("Only the trip owner can manage members.");
      return;
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
        onError: (error) =>
          setFormError(
            getTripMembersErrorMessage(error as AddTripMemberMutationError),
          ),
        onSuccess: () => {
          onSuccess();
          setActionMessage("Member added.");
        },
      },
    );
  };

  const handleRoleChange = (
    member: TripMemberListItem,
    role: TripMemberRoleValue,
  ) => {
    clearFeedback();

    if (!access.canManageMembers) {
      setActionError("Only the trip owner can manage members.");
      return;
    }

    if (!member.id || member.role === role) {
      return;
    }

    setConfirmAction({ type: "role", member, role });
  };

  const confirmRoleChange = (
    member: TripMemberListItem,
    role: TripMemberRoleValue,
  ) => {
    if (!member.id) {
      setConfirmAction(null);
      return;
    }

    updateRole.mutate(
      {
        tripId,
        memberId: member.id,
        data: { role },
      },
      {
        onError: (error) =>
          setActionError(
            getTripMembersErrorMessage(
              error as UpdateTripMemberRoleMutationError,
            ),
          ),
        onSuccess: () => {
          setConfirmAction(null);
          setActionMessage("Member role updated.");
        },
      },
    );
  };

  const handleDelete = (member: TripMemberListItem) => {
    clearFeedback();

    if (!access.canManageMembers) {
      setActionError("Only the trip owner can manage members.");
      return;
    }

    if (!member.id) {
      return;
    }

    setConfirmAction({ type: "delete", member });
  };

  const confirmDelete = (member: TripMemberListItem) => {
    if (!member.id) {
      setConfirmAction(null);
      return;
    }

    deleteMember.mutate(
      { tripId, memberId: member.id },
      {
        onError: (error) =>
          setActionError(
            getTripMembersErrorMessage(error as DeleteTripMemberMutationError),
          ),
        onSuccess: () => {
          setConfirmAction(null);
          setActionMessage("Member removed.");
        },
      },
    );
  };

  const handleConfirmAction = () => {
    if (!confirmAction) {
      return;
    }

    if (confirmAction.type === "role") {
      confirmRoleChange(confirmAction.member, confirmAction.role);
      return;
    }

    confirmDelete(confirmAction.member);
  };

  const confirmMemberTitle =
    confirmAction?.member.user?.fullName ??
    confirmAction?.member.user?.username ??
    confirmAction?.member.user?.email ??
    "this member";
  const confirmTitle =
    confirmAction?.type === "role" ? "Update member role?" : "Remove member?";
  const confirmDescription =
    confirmAction?.type === "role"
      ? `Update ${confirmMemberTitle} to ${confirmAction.role === "EDIT" ? "Editor" : "Viewer"}?`
      : `Remove ${confirmMemberTitle} from this trip? This action cannot be undone.`;

  const errorMessage = tripQuery.error
    ? getTripsErrorMessage(tripQuery.error as GetTripQueryError)
    : membersQuery.error
      ? getTripMembersErrorMessage(
          membersQuery.error as ListTripMembersQueryError,
        )
      : null;
  const limit = membersPage?.limit ?? DEFAULT_MEMBER_LIMIT;
  const total = membersPage?.total ?? 0;
  const displayedTotal = ownerMember ? total + 1 : total;
  const isActionPending =
    addMember.isPending || updateRole.isPending || deleteMember.isPending;

  return (
    <AppLayout tripId={tripId}>
      <Stack spacing={3}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box
              component="img"
              src={membersIcon}
              alt="Members"
              sx={{ width: 36, height: 36 }}
            />
            <Typography component="h1" variant="h5" sx={{ fontWeight: 800 }}>
              Members
            </Typography>
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Invite collaborators, review access, and keep trip roles up to date.
          </Typography>
        </Box>

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        {actionError ? <Alert severity="error">{actionError}</Alert> : null}
        {actionMessage ? (
          <Alert severity="success">{actionMessage}</Alert>
        ) : null}

        {access.canManageMembers ? (
          <TripMemberForm
            isPending={addMember.isPending}
            submitError={formError}
            onSubmit={handleAddMember}
          />
        ) : null}

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <FilterListOutlinedIcon fontSize="small" color="action" />
          {displayedTotal > 0 ? (
            <Typography color="text.secondary" variant="body2">
              Showing {displayedMembers.length} of {displayedTotal} members
            </Typography>
          ) : null}
        </Stack>

        {membersQuery.isLoading || access.isLoading ? (
          <Typography color="text.secondary">Loading members...</Typography>
        ) : null}

        {!membersQuery.isLoading &&
        !membersQuery.error &&
        displayedMembers.length === 0 ? (
          <EmptyState
            icon={GroupOutlinedIcon}
            title="No members yet"
            description={
              access.canManageMembers
                ? "Add the first collaborator to share this trip workspace."
                : "This trip does not have shared members yet."
            }
          />
        ) : null}

        {displayedMembers.length > 0 ? (
          <TripMemberList
            canManageMembers={access.canManageMembers}
            isActionPending={isActionPending}
            members={displayedMembers}
            offset={currentOffset}
            onDelete={handleDelete}
            onRoleChange={handleRoleChange}
          />
        ) : null}

        {total > limit ? (
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "flex-end", alignItems: "center" }}
          >
            <Typography color="text.secondary" variant="body2">
              {currentOffset + 1} - {Math.min(currentOffset + limit, total)} of{" "}
              {total}
            </Typography>
            <Button
              variant="outlined"
              disabled={currentOffset <= 0 || membersQuery.isFetching}
              onClick={() => setOffset(Math.max(0, currentOffset - limit))}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              disabled={
                currentOffset + limit >= total || membersQuery.isFetching
              }
              onClick={() => setOffset(currentOffset + limit)}
            >
              Next
            </Button>
          </Stack>
        ) : null}
        <ConfirmActionDialog
          open={confirmAction != null}
          title={confirmTitle}
          description={confirmDescription}
          confirmLabel={confirmAction?.type === "role" ? "Update" : "Remove"}
          confirmColor={confirmAction?.type === "delete" ? "error" : "primary"}
          isPending={updateRole.isPending || deleteMember.isPending}
          onCancel={() => setConfirmAction(null)}
          onConfirm={handleConfirmAction}
        />
      </Stack>
    </AppLayout>
  );
};

export default TripMembersPage;
