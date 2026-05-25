import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { buildTripDashboardPath, buildTripMembersPath } from "@/app/router";
import { ConfirmActionDialog } from "@/shared/components/confirm-action-dialog";
import { EmptyState } from "@/shared/components/empty-state";
import { filterPanelSx } from "@/shared/components/filter-panel";
import { TablePaginationToolbar } from "@/shared/components/table-pagination-toolbar";
import { useDebouncedValue } from "@/shared/lib";
import {
  useCreateTripAction,
  useDeleteTripAction,
  useQueryTrips,
  useTripAccessMap,
  useUpdateTripAction,
} from "../api";
import { TripForm, TripList } from "../components";
import {
  DEFAULT_TRIP_PAGE_LIMIT,
  TRIP_STATUS_FILTER_FETCH_LIMIT,
  buildTripPayload,
  getTripTimeStatus,
  getVietnamNowTimestamp,
  normalizeTripDate,
  tripStatusOptions,
  type TripFormFields,
  type TripStatusFilterValue,
} from "../lib/trip-fields";
import { getTripsErrorMessage } from "../lib/trips-error";
import type {
  CreateTripMutationError,
  DeleteTripMutationError,
  QueryTripsParams,
  QueryTripsQueryError,
  TripPageResponse,
  TripResponse,
  UpdateTripMutationError,
} from "@/shared";

const getOffset = (value: string | null) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
};

const getStatusFilter = (value: string | null): TripStatusFilterValue => {
  const option = tripStatusOptions.find(
    (candidate) => candidate.value === value,
  );

  return option?.value ?? "";
};

const toEndDateTime = (value: string) => {
  const normalized = value.trim();

  return normalized ? `${normalized}T23:59:59` : undefined;
};

type TripConfirmAction =
  | { type: "edit"; trip: TripResponse; fields: TripFormFields }
  | { type: "delete"; trip: TripResponse };

export const TripsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripResponse | null>(null);
  const [confirmAction, setConfirmAction] = useState<TripConfirmAction | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const offset = getOffset(searchParams.get("offset"));
  const search = searchParams.get("search") ?? "";
  const status = getStatusFilter(searchParams.get("status"));
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const debouncedSearch = useDebouncedValue(search);
  const hasStatusFilter = Boolean(status);

  const queryParams = useMemo<QueryTripsParams>(
    () => ({
      offset: hasStatusFilter ? 0 : offset,
      limit: hasStatusFilter
        ? TRIP_STATUS_FILTER_FETCH_LIMIT
        : DEFAULT_TRIP_PAGE_LIMIT,
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      ...(startDate
        ? { startDate: normalizeTripDate(startDate) ?? undefined }
        : {}),
      ...(endDate ? { endDate: toEndDateTime(endDate) } : {}),
    }),
    [debouncedSearch, endDate, hasStatusFilter, offset, startDate],
  );
  const tripsQuery = useQueryTrips(queryParams);
  const createTrip = useCreateTripAction();
  const updateTrip = useUpdateTripAction();
  const deleteTrip = useDeleteTripAction();
  const tripsPage = tripsQuery.data as TripPageResponse | undefined;
  const trips = useMemo(
    () => (tripsPage?.items ?? []) as TripResponse[],
    [tripsPage],
  );
  const accessMap = useTripAccessMap(trips);
  const isAccessLoading = trips.length > 0 && accessMap.isLoading;
  const accessibleTrips = useMemo(
    () =>
      isAccessLoading
        ? []
        : trips.filter((trip) => {
            if (!trip.id) {
              return false;
            }

            return Boolean(accessMap.accessByTripId[trip.id]?.canViewResources);
          }),
    [accessMap.accessByTripId, isAccessLoading, trips],
  );
  const statusFilteredTrips = useMemo(() => {
    if (!status) {
      return accessibleTrips;
    }

    const nowTimestamp = getVietnamNowTimestamp();

    return accessibleTrips.filter(
      (trip) => getTripTimeStatus(trip, nowTimestamp) === status,
    );
  }, [accessibleTrips, status]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    next.delete("offset");
    setSearchParams(next);
  };

  const updateOffset = (nextOffset: number) => {
    const next = new URLSearchParams(searchParams);

    if (nextOffset > 0) {
      next.set("offset", String(nextOffset));
    } else {
      next.delete("offset");
    }

    setSearchParams(next);
  };

  const openCreateDialog = () => {
    setEditingTrip(null);
    setActionError(null);
    setSubmitError(null);
    setDialogOpen(true);
  };

  const requestEditDialog = (trip: TripResponse) => {
    openEditDialog(trip);
  };

  const openEditDialog = (trip: TripResponse) => {
    setEditingTrip(trip);
    setActionError(null);
    setSubmitError(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTrip(null);
    setSubmitError(null);
  };

  const handleSubmit = (fields: TripFormFields) => {
    setActionError(null);
    setSubmitError(null);
    const data = buildTripPayload(fields);

    if (editingTrip?.id) {
      setConfirmAction({ type: "edit", trip: editingTrip, fields });
      return;
    }

    createTrip.mutate(
      { data },
      {
        onError: (error) =>
          setSubmitError(
            getTripsErrorMessage(error as CreateTripMutationError),
          ),
        onSuccess: (createdTrip) => {
          closeDialog();
          if (createdTrip.id) {
            navigate(buildTripDashboardPath(createdTrip.id));
          }
        },
      },
    );
  };

  const requestDelete = (trip: TripResponse) => {
    if (!trip.id) {
      return;
    }

    setActionError(null);
    setConfirmAction({ type: "delete", trip });
  };

  const handleConfirmAction = () => {
    if (!confirmAction) {
      return;
    }

    if (confirmAction.type === "edit") {
      const { trip, fields } = confirmAction;

      if (!trip.id) {
        setConfirmAction(null);
        return;
      }

      updateTrip.mutate(
        { tripId: trip.id, data: buildTripPayload(fields) },
        {
          onError: (error) => {
            setSubmitError(
              getTripsErrorMessage(error as UpdateTripMutationError),
            );
            setConfirmAction(null);
          },
          onSuccess: () => {
            setConfirmAction(null);
            closeDialog();
          },
        },
      );
      return;
    }

    const { trip } = confirmAction;

    if (!trip.id) {
      setConfirmAction(null);
      return;
    }

    deleteTrip.mutate(
      { tripId: trip.id },
      {
        onError: (error) => {
          setActionError(
            getTripsErrorMessage(error as DeleteTripMutationError),
          );
        },
        onSuccess: () => setConfirmAction(null),
      },
    );
  };

  const confirmTitle =
    confirmAction?.type === "edit" ? "Save trip changes?" : "Delete trip?";
  const confirmDescription =
    confirmAction?.type === "edit"
      ? `Save changes to "${confirmAction.trip.name ?? "this trip"}"?`
      : `Delete "${confirmAction?.trip.name ?? "this trip"}"? This action cannot be undone.`;
  const isConfirmPending =
    confirmAction?.type === "edit"
      ? updateTrip.isPending
      : deleteTrip.isPending;

  const pageErrorMessage = tripsQuery.error
    ? getTripsErrorMessage(tripsQuery.error as QueryTripsQueryError)
    : accessMap.error
      ? "Trip permissions could not be fully loaded."
      : null;
  const total = hasStatusFilter
    ? statusFilteredTrips.length
    : tripsPage?.total ?? 0;
  const rawLimit = tripsPage?.limit ?? DEFAULT_TRIP_PAGE_LIMIT;
  const limit = hasStatusFilter
    ? DEFAULT_TRIP_PAGE_LIMIT
    : rawLimit > 0
      ? rawLimit
      : DEFAULT_TRIP_PAGE_LIMIT;
  const rawCurrentOffset = hasStatusFilter ? offset : tripsPage?.offset ?? offset;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const maxOffset = Math.max(0, (pageCount - 1) * limit);
  const currentOffset = Math.min(rawCurrentOffset, maxOffset);
  const currentPage = Math.min(
    pageCount,
    Math.floor(currentOffset / limit) + 1,
  );
  const handlePageChange = (page: number) => updateOffset((page - 1) * limit);
  const visibleTrips = hasStatusFilter
    ? statusFilteredTrips.slice(currentOffset, currentOffset + limit)
    : statusFilteredTrips;

  return (
    <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ width: "100%", maxWidth: 1280, mx: "auto" }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { md: "center" },
            }}
          >
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <FlightTakeoffOutlinedIcon
                  sx={{ color: "primary.main", fontSize: 44 }}
                />
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{ fontWeight: 700 }}
                >
                  Trip Management
                </Typography>
              </Stack>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Ready for your next adventure?
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
            >
              Create New Trip
            </Button>
          </Stack>

          <Paper variant="outlined" sx={filterPanelSx}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={2}
              sx={{
                alignItems: { lg: "center" },
                justifyContent: { lg: "space-between" },
                width: "100%",
              }}
            >
              <TextField
                label="Search"
                placeholder="Search trips by name"
                size="small"
                value={search}
                onChange={(event) => updateFilter("search", event.target.value)}
                sx={{
                  width: { xs: "100%", lg: 420 },
                  flexShrink: 0,
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={2}
                sx={{
                  flex: { lg: 1 },
                  justifyContent: { lg: "flex-end" },
                  width: { xs: "100%", lg: "auto" },
                }}
              >
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={status}
                    onChange={(event) =>
                      updateFilter("status", event.target.value)
                    }
                  >
                    {tripStatusOptions.map((option) => (
                      <MenuItem key={option.label} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Start date"
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={(event) =>
                    updateFilter("startDate", event.target.value)
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ width: 160 }}
                />
                <TextField
                  label="End date"
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(event) =>
                    updateFilter("endDate", event.target.value)
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ width: 160 }}
                />
              </Stack>
            </Stack>
          </Paper>

          {pageErrorMessage || actionError ? (
            <Alert severity="error">{pageErrorMessage ?? actionError}</Alert>
          ) : null}

          {tripsQuery.isLoading ? (
            <Typography color="text.secondary">Loading trips...</Typography>
          ) : null}

          {!tripsQuery.isLoading && isAccessLoading ? (
            <Typography color="text.secondary">
              Loading trip permissions...
            </Typography>
          ) : null}

          {!tripsQuery.isLoading &&
          !tripsQuery.error &&
          !isAccessLoading &&
          visibleTrips.length === 0 ? (
            <EmptyState
              icon={FlightTakeoffOutlinedIcon}
              title="Your Next Adventure Begins Here!"
              description="No trips found matching your search."
              action={{ label: "Create New Trip", onClick: openCreateDialog }}
            />
          ) : null}

          {visibleTrips.length > 0 ? (
            <Paper variant="outlined" sx={{ overflow: "hidden" }}>
              <TripList
                accessByTripId={accessMap.accessByTripId}
                trips={visibleTrips}
                offset={currentOffset}
                isActionPending={deleteTrip.isPending}
                onDelete={requestDelete}
                onEdit={requestEditDialog}
                onMembers={(trip) => {
                  if (trip.id) {
                    navigate(buildTripMembersPath(trip.id));
                  }
                }}
                onOpen={(trip) => {
                  if (trip.id) {
                    navigate(buildTripDashboardPath(trip.id));
                  }
                }}
              />
              <TablePaginationToolbar
                currentOffset={currentOffset}
                currentPage={currentPage}
                isFetching={tripsQuery.isFetching}
                limit={limit}
                pageCount={pageCount}
                total={total}
                onPageChange={handlePageChange}
              />
            </Paper>
          ) : null}
        </Stack>
      </Box>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingTrip ? "Edit trip" : "Create New Trip"}
        </DialogTitle>
        <DialogContent>
          <TripForm
            key={editingTrip?.id ?? "create"}
            trip={editingTrip}
            isPending={createTrip.isPending || updateTrip.isPending}
            submitError={submitError}
            onCancel={closeDialog}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
      <ConfirmActionDialog
        open={confirmAction != null}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmAction?.type === "edit" ? "Save trip" : "Delete"}
        confirmColor={confirmAction?.type === "delete" ? "error" : "primary"}
        isPending={isConfirmPending}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />
    </Box>
  );
};

export default TripsPage;
