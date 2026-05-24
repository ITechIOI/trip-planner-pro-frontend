import { useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { keepPreviousData } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import type {
  GetTripDashboardQueryError,
  DeleteItineraryMutationError,
  ItineraryCategory,
  ItineraryPageResponse,
  ItineraryPriority,
  QueryTripItinerariesQueryError,
  QueryTripItinerariesParams,
  ItineraryResponse,
  ItineraryStatus,
  TripDashboardResponse,
} from "@/shared";
import { AppLayout } from "@/shared/components/app-layout";
import { ConfirmActionDialog } from "@/shared/components/confirm-action-dialog";
import { EmptyState } from "@/shared/components/empty-state";
import { ProgressRing } from "@/shared/components/progress-ring";
import { TablePaginationToolbar } from "@/shared/components/table-pagination-toolbar";
import { useTripDashboard } from "@/features/trips/api/use-trip-action";
import { useTripAccess } from "@/features/trips/api/use-trip-access";
import { getTripsErrorMessage } from "@/features/trips/lib/trips-error";
import {
  useDeleteItineraryAction,
  useItineraryCalendar,
  useQueryTripItineraries,
} from "@/features/itineraries/api";
import { getItinerariesErrorMessage } from "@/features/itineraries/lib/itineraries-error";
import { buildItineraryDashboardStats } from "@/features/itineraries/lib/itinerary-dashboard-stats";
import { normalizeCalendarMonth } from "@/features/itineraries/lib/itinerary-calendar";
import { normalizeItineraryFromApi } from "@/features/itineraries/api/itinerary-mappers";
import { ItineraryCard } from "@/features/itineraries/components/itinerary-card";
import { ItineraryCalendar } from "@/features/itineraries/components/itinerary-calendar";
import { ItineraryForm } from "@/features/itineraries/components/itinerary-form";
import {
  ITINERARY_CATEGORIES,
  ITINERARY_PRIORITIES,
  ITINERARY_STATUSES,
} from "@/features/itineraries/api/itinerary-mappers";
import { ItineraryStatus as ItineraryStatusEnum } from "@/shared";
import itinerariesIcon from "@/assets/images/itineraries.png";

export type ItineraryPageProps = {
  tripId: number;
  viewMode?: "view" | "edit";
};

type PageViewMode = "list" | "calendar";

const DATE_FORMAT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_ITINERARY_PAGE_LIMIT = 8;
const UNSCHEDULED_DATE_KEY = "__unscheduled__";

const padDatePart = (value: number) => String(value).padStart(2, "0");

const getTodayDateKey = () => {
  const today = new Date();

  return [
    today.getFullYear(),
    padDatePart(today.getMonth() + 1),
    padDatePart(today.getDate()),
  ].join("-");
};

const getDefaultCalendarDate = (month: string) => {
  const today = getTodayDateKey();

  return today.startsWith(month) ? today : `${month}-01`;
};

const normalizeCalendarDate = (date: string | null, month: string) => {
  if (date && DATE_FORMAT_PATTERN.test(date)) {
    return date;
  }

  return getDefaultCalendarDate(month);
};

const getOffset = (value: string | null) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
};

const toDayStartTime = (value: string) => {
  const normalized = value.trim();

  return normalized ? `${normalized}T00:00:00` : undefined;
};

const toDayEndTime = (value: string) => {
  const normalized = value.trim();

  return normalized ? `${normalized}T23:59:59` : undefined;
};

type ItineraryConfirmAction = { type: "delete"; item: ItineraryResponse };
type GroupedItineraryDay = {
  dateKey: string;
  title: string;
  items: ItineraryResponse[];
};

const getItineraryDateKey = (item: ItineraryResponse) => {
  const dateKey = item.startTime?.split("T")[0];

  return dateKey && DATE_FORMAT_PATTERN.test(dateKey)
    ? dateKey
    : UNSCHEDULED_DATE_KEY;
};

const formatItineraryDayTitle = (dateKey: string) => {
  if (dateKey === UNSCHEDULED_DATE_KEY) {
    return "Unscheduled Activities";
  }

  const date = new Date(`${dateKey}T00:00:00`);
  const todayKey = getTodayDateKey();
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = [
    tomorrow.getFullYear(),
    padDatePart(tomorrow.getMonth() + 1),
    padDatePart(tomorrow.getDate()),
  ].join("-");

  if (dateKey === todayKey) {
    return "Today";
  }

  if (dateKey === tomorrowKey) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const groupItinerariesByDay = (
  items: ItineraryResponse[],
): GroupedItineraryDay[] => {
  const grouped = new Map<string, ItineraryResponse[]>();

  [...items]
    .sort((left, right) =>
      (left.startTime ?? "").localeCompare(right.startTime ?? ""),
    )
    .forEach((item) => {
      const dateKey = getItineraryDateKey(item);
      const groupItems = grouped.get(dateKey) ?? [];

      groupItems.push(item);
      grouped.set(dateKey, groupItems);
    });

  return [...grouped.entries()]
    .sort(([leftKey], [rightKey]) => {
      if (leftKey === UNSCHEDULED_DATE_KEY) {
        return 1;
      }

      if (rightKey === UNSCHEDULED_DATE_KEY) {
        return -1;
      }

      return leftKey.localeCompare(rightKey);
    })
    .map(([dateKey, groupItems]) => ({
      dateKey,
      title: formatItineraryDayTitle(dateKey),
      items: groupItems,
    }));
};

const ItineraryContent = ({
  tripId,
  viewMode = "edit",
}: ItineraryPageProps) => {
  const isViewMode = viewMode === "view";
  const [searchParams, setSearchParams] = useSearchParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<ItineraryResponse | null>(null);
  const [confirmAction, setConfirmAction] =
    useState<ItineraryConfirmAction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<ItineraryCategory | "">(
    "",
  );
  const [filterStatus, setFilterStatus] = useState<ItineraryStatus | "">("");
  const [filterPriority, setFilterPriority] = useState<ItineraryPriority | "">(
    "",
  );
  const [filterDate, setFilterDate] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = deferredSearchQuery.trim();

  const pageViewMode: PageViewMode =
    searchParams.get("view") === "calendar" ? "calendar" : "list";
  const listOffset = getOffset(searchParams.get("offset"));
  const calendarMonth = normalizeCalendarMonth(
    searchParams.get("month") ?? searchParams.get("date")?.slice(0, 7),
  );
  const selectedCalendarDate = normalizeCalendarDate(
    searchParams.get("date"),
    calendarMonth,
  );

  const tripAccess = useTripAccess(tripId);
  const canManageItineraries = !isViewMode && tripAccess.canEditTrip;
  const itineraryListParams = useMemo<QueryTripItinerariesParams>(
    () => ({
      offset: listOffset,
      limit: DEFAULT_ITINERARY_PAGE_LIMIT,
      ...(normalizedSearchQuery ? { search: normalizedSearchQuery } : {}),
      ...(filterCategory ? { category: filterCategory } : {}),
      ...(filterStatus ? { status: filterStatus } : {}),
      ...(filterPriority ? { priority: filterPriority } : {}),
      ...(filterDate ? { startTime: toDayStartTime(filterDate) } : {}),
      ...(filterDate ? { endTime: toDayEndTime(filterDate) } : {}),
    }),
    [
      filterCategory,
      filterDate,
      filterPriority,
      filterStatus,
      listOffset,
      normalizedSearchQuery,
    ],
  );
  const itinerariesQuery = useQueryTripItineraries(
    tripId,
    itineraryListParams,
    {
      query: {
        enabled: pageViewMode === "list",
        placeholderData: keepPreviousData,
      },
    },
  );
  const calendarQuery = useItineraryCalendar(
    tripId,
    calendarMonth,
    pageViewMode === "calendar",
  );
  const dashboardQuery = useTripDashboard(tripId);
  const deleteMutation = useDeleteItineraryAction();

  const stats = buildItineraryDashboardStats(
    dashboardQuery.data as TripDashboardResponse | undefined,
  );
  const errorMessage =
    pageViewMode === "list" && itinerariesQuery.error
      ? getItinerariesErrorMessage(
          itinerariesQuery.error as QueryTripItinerariesQueryError,
        )
      : pageViewMode === "calendar" && calendarQuery.error
        ? getItinerariesErrorMessage(
            calendarQuery.error as QueryTripItinerariesQueryError,
          )
        : deleteMutation.error
          ? getItinerariesErrorMessage(
              deleteMutation.error as DeleteItineraryMutationError,
            )
          : dashboardQuery.error
            ? getTripsErrorMessage(
                dashboardQuery.error as GetTripDashboardQueryError,
              )
            : null;

  const itineraryItems = useMemo(() => {
    const page = itinerariesQuery.data as ItineraryPageResponse | undefined;

    return (page?.items ?? [])
      .map((item: ItineraryResponse) => normalizeItineraryFromApi(item))
      .filter((item): item is ItineraryResponse => item != null);
  }, [itinerariesQuery.data]);
  const groupedItineraryDays = useMemo(
    () => groupItinerariesByDay(itineraryItems),
    [itineraryItems],
  );

  const itinerariesPage = itinerariesQuery.data as
    | ItineraryPageResponse
    | undefined;
  const listTotal = itinerariesPage?.total ?? 0;
  const rawListLimit = itinerariesPage?.limit ?? DEFAULT_ITINERARY_PAGE_LIMIT;
  const listLimit =
    rawListLimit > 0 ? rawListLimit : DEFAULT_ITINERARY_PAGE_LIMIT;
  const currentListOffset = itinerariesPage?.offset ?? listOffset;
  const listPageCount = Math.max(1, Math.ceil(listTotal / listLimit));
  const currentListPage = Math.min(
    listPageCount,
    Math.floor(currentListOffset / listLimit) + 1,
  );

  const calendarItems = useMemo(() => {
    const page = calendarQuery.data as ItineraryPageResponse | undefined;

    return (page?.items ?? [])
      .map((item: ItineraryResponse) => normalizeItineraryFromApi(item))
      .filter((item): item is ItineraryResponse => item != null);
  }, [calendarQuery.data]);

  const hasActiveFilters = Boolean(
    searchQuery ||
    filterCategory ||
    filterStatus ||
    filterPriority ||
    filterDate,
  );
  const isInitialListLoading =
    pageViewMode === "list" &&
    itinerariesQuery.isLoading &&
    !itinerariesQuery.data;

  const updateListOffset = (nextOffset: number) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextOffset > 0) {
      nextParams.set("offset", String(nextOffset));
    } else {
      nextParams.delete("offset");
    }

    setSearchParams(nextParams);
  };

  const resetListOffset = () => {
    if (!searchParams.has("offset")) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("offset");
    setSearchParams(nextParams);
  };

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    resetListOffset();
  };

  const handleCategoryFilterChange = (value: ItineraryCategory | "") => {
    setFilterCategory(value);
    resetListOffset();
  };

  const handleStatusFilterChange = (value: ItineraryStatus | "") => {
    setFilterStatus(value);
    resetListOffset();
  };

  const handlePriorityFilterChange = (value: ItineraryPriority | "") => {
    setFilterPriority(value);
    resetListOffset();
  };

  const handleDateFilterChange = (value: string) => {
    setFilterDate(value);
    resetListOffset();
  };

  const handleListPageChange = (page: number) => {
    updateListOffset((page - 1) * listLimit);
  };

  const handleEdit = (item: ItineraryResponse) => {
    openEditForm(item);
  };

  const openEditForm = (item: ItineraryResponse) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditItem(null);
    setIsFormOpen(true);
  };

  const updateCalendarSearchParams = (
    nextValues: Partial<{
      view: PageViewMode;
      month: string;
      date: string;
    }>,
  ) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextValues.view === "calendar") {
      nextParams.set("view", "calendar");
    } else if (nextValues.view === "list") {
      nextParams.delete("view");
      nextParams.delete("month");
      nextParams.delete("date");
    }

    if (nextValues.month) {
      nextParams.set("month", nextValues.month);
    }

    if (nextValues.date) {
      nextParams.set("date", nextValues.date);
    }

    setSearchParams(nextParams);
  };

  const handlePageViewChange = (value: PageViewMode | null) => {
    if (!value || value === pageViewMode) {
      return;
    }

    if (value === "calendar") {
      updateCalendarSearchParams({
        view: "calendar",
        month: calendarMonth,
        date: selectedCalendarDate,
      });
      return;
    }

    updateCalendarSearchParams({ view: "list" });
  };

  const handleCalendarMonthChange = (nextMonth: string) => {
    updateCalendarSearchParams({
      view: "calendar",
      month: nextMonth,
      date: getDefaultCalendarDate(nextMonth),
    });
  };

  const handleCalendarDateSelect = (date: string) => {
    updateCalendarSearchParams({
      view: "calendar",
      month: date.slice(0, 7),
      date,
    });
  };

  const handleCalendarAdd = (date: string) => {
    handleCalendarDateSelect(date);
    setEditItem(null);
    setIsFormOpen(true);
  };

  const requestDelete = (item: ItineraryResponse) => {
    if (!canManageItineraries || item.id == null) {
      return;
    }

    setConfirmAction({ type: "delete", item });
  };

  const handleConfirmAction = () => {
    if (!confirmAction) {
      return;
    }

    if (!canManageItineraries || confirmAction.item.id == null) {
      setConfirmAction(null);
      return;
    }

    deleteMutation.mutate(
      {
        tripId,
        itineraryId: confirmAction.item.id,
      },
      {
        onSuccess: () => setConfirmAction(null),
      },
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCategory("");
    setFilterStatus("");
    setFilterPriority("");
    setFilterDate("");
    resetListOffset();
  };

  const confirmTitle = "Delete activity?";
  const confirmDescription = `Delete "${confirmAction?.item.activityTitle ?? "this activity"}"? This action cannot be undone.`;
  const confirmLabel = "Delete";

  if (dashboardQuery.isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Loading itinerary...
      </Typography>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box
              component="img"
              src={itinerariesIcon}
              alt="Itinerary"
              sx={{ width: 36, height: 36 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Itinerary
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your travel activities and schedule
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={pageViewMode}
            onChange={(_event, value: PageViewMode | null) =>
              handlePageViewChange(value)
            }
          >
            <ToggleButton value="list" aria-label="List view">
              <ViewListOutlinedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="calendar" aria-label="Calendar view">
              <CalendarMonthOutlinedIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "center",
              display: { xs: "none", md: "flex" },
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <ProgressRing
              progress={stats.itineraryCompletionPercentage}
              size={48}
              strokeWidth={4}
              variant={stats.hasOverdueActivities ? "danger" : "default"}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {stats.completedActivities}/{stats.totalActivities}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Activities Done
              </Typography>
            </Box>
          </Stack>

          {canManageItineraries ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                pageViewMode === "calendar"
                  ? handleCalendarAdd(selectedCalendarDate)
                  : handleAdd()
              }
            >
              Add Activity
            </Button>
          ) : null}
        </Stack>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {stats.hasOverdueActivities ? (
        <Alert
          severity="error"
          icon={<ErrorOutlineOutlinedIcon />}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                handleStatusFilterChange(ItineraryStatusEnum.PLANNED)
              }
            >
              View Overdue
            </Button>
          }
        >
          <Typography sx={{ fontWeight: 600 }}>
            {stats.overdueActivities} Overdue{" "}
            {stats.overdueActivities === 1 ? "Activity" : "Activities"}
          </Typography>
          <Typography variant="body2">
            Some planned activities are past their scheduled date
          </Typography>
        </Alert>
      ) : null}

      {pageViewMode === "calendar" ? (
        <ItineraryCalendar
          items={calendarItems}
          month={calendarMonth}
          selectedDate={selectedCalendarDate}
          canManage={canManageItineraries}
          isLoading={calendarQuery.isFetching}
          hasError={Boolean(calendarQuery.error)}
          deletingId={deleteMutation.variables?.itineraryId ?? null}
          onMonthChange={handleCalendarMonthChange}
          onDateSelect={handleCalendarDateSelect}
          onRetry={() => {
            void calendarQuery.refetch();
          }}
          onEdit={handleEdit}
          onDelete={requestDelete}
        />
      ) : (
        <Stack spacing={2.5}>
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
              size="small"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(event) => handleSearchQueryChange(event.target.value)}
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
              direction="row"
              spacing={1}
              sx={{
                flex: { lg: 1 },
                flexWrap: "wrap",
                justifyContent: { lg: "flex-end" },
                width: { xs: "100%", lg: "auto" },
              }}
              useFlexGap
            >
              <FilterSelect
                label="Category"
                value={filterCategory}
                onChange={handleCategoryFilterChange}
                options={[
                  { value: "", label: "All Categories" },
                  ...ITINERARY_CATEGORIES.map((category) => ({
                    value: category,
                    label: category,
                  })),
                ]}
              />
              <FilterSelect
                label="Status"
                value={filterStatus}
                onChange={handleStatusFilterChange}
                options={[
                  { value: "", label: "All Status" },
                  ...ITINERARY_STATUSES.map((status) => ({
                    value: status,
                    label: status,
                  })),
                ]}
              />
              <FilterSelect
                label="Priority"
                value={filterPriority}
                onChange={handlePriorityFilterChange}
                options={[
                  { value: "", label: "All Priorities" },
                  ...ITINERARY_PRIORITIES.map((priority) => ({
                    value: priority,
                    label: priority,
                  })),
                ]}
              />
              <TextField
                label="Date"
                type="date"
                size="small"
                value={filterDate}
                onChange={(event) => handleDateFilterChange(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ width: 160 }}
              />

              {hasActiveFilters ? (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              ) : null}
            </Stack>
          </Stack>

          {isInitialListLoading ? (
            <Typography variant="body2" color="text.secondary">
              Loading itinerary...
            </Typography>
          ) : null}

          {!isInitialListLoading && (hasActiveFilters || listTotal > 0) ? (
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <FilterListOutlinedIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Showing {itineraryItems.length} of {listTotal} activities
              </Typography>
            </Stack>
          ) : null}

          {!isInitialListLoading && listTotal === 0 ? (
            <EmptyState
              icon={hasActiveFilters ? SearchIcon : CalendarMonthOutlinedIcon}
              title={
                hasActiveFilters
                  ? "No matching activities"
                  : "No activities yet"
              }
              description={
                hasActiveFilters
                  ? "Try adjusting your filters or search query."
                  : "Start planning your trip by adding your first activity."
              }
              action={
                hasActiveFilters
                  ? { label: "Clear Filters", onClick: clearFilters }
                  : canManageItineraries
                    ? { label: "Add First Activity", onClick: handleAdd }
                    : undefined
              }
            />
          ) : !isInitialListLoading && itineraryItems.length === 0 ? (
            <EmptyState
              icon={CalendarMonthOutlinedIcon}
              title="No activities on this page"
              description="Choose another page to continue browsing activities."
            />
          ) : (
            <Stack spacing={3}>
              {groupedItineraryDays.map((group) => (
                <Box key={group.dateKey}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
                      borderBottom: 1,
                      borderColor: "divider",
                      mb: 1.5,
                      pb: 1,
                    }}
                  >
                    <CalendarMonthOutlinedIcon
                      color="action"
                      fontSize="small"
                    />
                    <Typography sx={{ fontWeight: 800 }}>
                      {group.title}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {group.items.length}{" "}
                      {group.items.length === 1 ? "activity" : "activities"}
                    </Typography>
                  </Stack>
                  <Stack spacing={2}>
                    {group.items.map((item) => (
                      <ItineraryCard
                        key={
                          item.id ?? `${item.activityTitle}-${item.startTime}`
                        }
                        tripId={tripId}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={requestDelete}
                        isActionPending={deleteMutation.isPending}
                        viewMode={canManageItineraries ? "edit" : "view"}
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}

          {!isInitialListLoading && listTotal > 0 ? (
            <TablePaginationToolbar
              currentOffset={currentListOffset}
              currentPage={currentListPage}
              isFetching={itinerariesQuery.isFetching}
              limit={listLimit}
              pageCount={listPageCount}
              total={listTotal}
              onPageChange={handleListPageChange}
            />
          ) : null}
        </Stack>
      )}

      {isFormOpen ? (
        <ItineraryForm
          key={
            editItem?.id ??
            `new-${pageViewMode === "calendar" ? selectedCalendarDate : "list"}`
          }
          tripId={tripId}
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          editItem={editItem}
          defaultDate={
            pageViewMode === "calendar" && !editItem ? selectedCalendarDate : ""
          }
        />
      ) : null}

      <ConfirmActionDialog
        open={Boolean(confirmAction)}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        confirmColor={confirmAction?.type === "delete" ? "error" : "primary"}
        isPending={deleteMutation.isPending}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />
    </Stack>
  );
};

type FilterSelectProps<T extends string> = {
  label: string;
  value: T | "";
  onChange: (value: T | "") => void;
  options: { value: T | ""; label: string }[];
};

const FilterSelect = <T extends string>({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps<T>) => (
  <FormControl size="small" sx={{ minWidth: 140 }}>
    <InputLabel>{label}</InputLabel>
    <Select
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value as T | "")}
    >
      {options.map((option) => (
        <MenuItem key={option.value || "__all__"} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export const ItineraryPage = ({ tripId, viewMode }: ItineraryPageProps) => (
  <AppLayout tripId={tripId}>
    <ItineraryContent tripId={tripId} viewMode={viewMode} />
  </AppLayout>
);

export default ItineraryPage;
