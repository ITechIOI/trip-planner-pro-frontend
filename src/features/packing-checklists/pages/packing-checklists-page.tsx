import { useMemo, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import packingIcon from "@/assets/images/packing.png";
import { AppLayout } from "@/shared/components/app-layout";
import { ConfirmActionDialog } from "@/shared/components/confirm-action-dialog";
import { EmptyState } from "@/shared/components/empty-state";
import { filterPanelSx } from "@/shared/components/filter-panel";
import { TablePaginationToolbar } from "@/shared/components/table-pagination-toolbar";
import { useDebouncedValue } from "@/shared/lib";
import { useTripAccess } from "@/features/trips/api/use-trip-access";
import { useTripDashboard } from "@/features/trips/api/use-trip-action";
import {
  PackedStatus,
  type CreatePackingChecklistMutationError,
  type DeletePackingChecklistMutationError,
  type PackingChecklistPageResponse,
  type PackingChecklistResponse,
  type QueryTripPackingChecklistsParams,
  type QueryTripPackingChecklistsQueryError,
  type TripDashboardResponse,
  type UpdatePackingChecklistMutationError,
} from "@/shared";
import {
  useCreatePackingChecklistAction,
  useDeletePackingChecklistAction,
  useQueryTripPackingChecklists,
  useUpdatePackingChecklistAction,
} from "../api";
import { normalizePackingItemFromApi } from "../api/packing-checklist-mappers";
import { PackingCategoryProgress } from "../components/packing-category-progress";
import { PackingCategorySection } from "../components/packing-category-section";
import { PackingFilters } from "../components/packing-filters";
import { PackingItemModal } from "../components/packing-item-modal";
import { PackingProgress } from "../components/packing-progress";
import { getPackingChecklistsErrorMessage } from "../lib";
import { PACKING_CATEGORIES } from "../lib/packing-category-meta";
import type {
  PackedStatus as PackedStatusValue,
  PackingCategory,
  PackingItem,
  PackingItemFormValues,
} from "../types/packing-item";

type PackingChecklistsPageProps = {
  tripId: number;
};

const DEFAULT_PACKING_PAGE_LIMIT = 10;
const PACKING_PROGRESS_ITEM_LIMIT = 50;

type PackingConfirmAction =
  | { type: "delete"; item: PackingItem }
  | { type: "edit"; item: PackingItem; fields: PackingItemFormValues };

const getPageCount = (total: number, limit: number) =>
  Math.max(1, Math.ceil(total / limit));

const groupItemsByCategory = (items: PackingItem[]) => {
  const groups = items.reduce(
    (accumulator, item) => {
      const categoryItems = accumulator[item.category] ?? [];
      categoryItems.push(item);
      accumulator[item.category] = categoryItems;

      return accumulator;
    },
    {} as Partial<Record<PackingCategory, PackingItem[]>>,
  );

  return PACKING_CATEGORIES.map((category) => ({
    category,
    items: groups[category] ?? [],
  })).filter((group) => group.items.length > 0);
};

const PackingChecklistsContent = ({ tripId }: PackingChecklistsPageProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);
  const [confirmAction, setConfirmAction] =
    useState<PackingConfirmAction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PackingCategory | "">(
    "",
  );
  const [packedFilter, setPackedFilter] = useState<PackedStatusValue | "">("");
  const [offset, setOffset] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const debouncedSearchTerm = useDebouncedValue(searchTerm);
  const normalizedSearch = debouncedSearchTerm.trim();
  const queryParams = useMemo<QueryTripPackingChecklistsParams>(
    () => ({
      offset,
      limit: DEFAULT_PACKING_PAGE_LIMIT,
      ...(normalizedSearch ? { search: normalizedSearch } : {}),
      ...(categoryFilter ? { category: categoryFilter } : {}),
      ...(packedFilter ? { packedStatus: packedFilter } : {}),
    }),
    [categoryFilter, normalizedSearch, offset, packedFilter],
  );
  const progressQueryParams = useMemo<QueryTripPackingChecklistsParams>(
    () => ({
      offset: 0,
      limit: PACKING_PROGRESS_ITEM_LIMIT,
    }),
    [],
  );

  const access = useTripAccess(tripId);
  const dashboardQuery = useTripDashboard(tripId);
  const packingQuery = useQueryTripPackingChecklists(tripId, queryParams, {
    query: {
      enabled: Boolean(tripId),
      placeholderData: keepPreviousData,
    },
  });
  const packingProgressQuery = useQueryTripPackingChecklists(
    tripId,
    progressQueryParams,
    {
      query: {
        enabled: Boolean(tripId),
        placeholderData: keepPreviousData,
      },
    },
  );
  const createItemAction = useCreatePackingChecklistAction();
  const deleteItemAction = useDeletePackingChecklistAction();
  const updateItemAction = useUpdatePackingChecklistAction();
  const canManagePacking = access.canEditTrip;
  const isMutationPending =
    createItemAction.isPending ||
    deleteItemAction.isPending ||
    updateItemAction.isPending;

  const packingPage = packingQuery.data as
    | PackingChecklistPageResponse
    | undefined;
  const items = useMemo(
    () =>
      ((packingPage?.items ?? []) as PackingChecklistResponse[])
        .map(normalizePackingItemFromApi)
        .filter((item): item is PackingItem => item != null),
    [packingPage],
  );
  const progressPage = packingProgressQuery.data as
    | PackingChecklistPageResponse
    | undefined;
  const progressItems = useMemo(
    () =>
      ((progressPage?.items ?? []) as PackingChecklistResponse[])
        .map(normalizePackingItemFromApi)
        .filter((item): item is PackingItem => item != null),
    [progressPage],
  );
  const categoryProgressItems =
    packingProgressQuery.isError || (!progressPage && items.length > 0)
      ? items
      : progressItems;
  const groupedItems = useMemo(() => groupItemsByCategory(items), [items]);
  const dashboard = dashboardQuery.data as TripDashboardResponse | undefined;
  const dashboardPackingProgress = dashboard?.packingProgress;
  const total = packingPage?.total ?? 0;
  const rawLimit = packingPage?.limit ?? DEFAULT_PACKING_PAGE_LIMIT;
  const limit = rawLimit > 0 ? rawLimit : DEFAULT_PACKING_PAGE_LIMIT;
  const currentOffset = packingPage?.offset ?? offset;
  const pageCount = getPageCount(total, limit);
  const currentPage = Math.min(
    pageCount,
    Math.floor(currentOffset / limit) + 1,
  );
  const hasActiveFilters = Boolean(
    searchTerm || categoryFilter || packedFilter,
  );
  const isInitialLoading = packingQuery.isLoading && !packingQuery.data;
  const pageErrorMessage = packingQuery.error
    ? getPackingChecklistsErrorMessage(
        packingQuery.error as QueryTripPackingChecklistsQueryError,
      )
    : access.error
      ? "Trip permissions could not be fully loaded."
      : null;

  const resetOffset = () => setOffset(0);
  const clearFeedback = () => {
    setActionError(null);
    setSubmitError(null);
  };

  const handleSearchChange = (value: string) => {
    clearFeedback();
    setSearchTerm(value);
    resetOffset();
  };

  const handleCategoryChange = (value: PackingCategory | "") => {
    clearFeedback();
    setCategoryFilter(value);
    resetOffset();
  };

  const handlePackedChange = (value: PackedStatusValue | "") => {
    clearFeedback();
    setPackedFilter(value);
    resetOffset();
  };

  const handlePageChange = (page: number) => {
    clearFeedback();
    setOffset((page - 1) * limit);
  };

  const openAddModal = () => {
    clearFeedback();
    setIsAddModalOpen(true);
  };

  const addItem = (values: PackingItemFormValues) => {
    clearFeedback();
    createItemAction.mutate(
      {
        tripId,
        data: values,
      },
      {
        onError: (error) =>
          setSubmitError(
            getPackingChecklistsErrorMessage(
              error as CreatePackingChecklistMutationError,
            ),
          ),
        onSuccess: () => {
          setIsAddModalOpen(false);
          resetOffset();
        },
      },
    );
  };

  const togglePacked = (id: number) => {
    if (!canManagePacking) {
      return;
    }

    clearFeedback();
    const currentItem = items.find((item) => item.id === id);

    if (!currentItem) {
      return;
    }

    updateItemAction.mutate(
      {
        tripId,
        checklistId: id,
        data: {
          packedStatus:
            currentItem.packedStatus === PackedStatus.PACKED
              ? PackedStatus.NOT_PACKED
              : PackedStatus.PACKED,
        },
      },
      {
        onError: (error) =>
          setActionError(
            getPackingChecklistsErrorMessage(
              error as UpdatePackingChecklistMutationError,
            ),
          ),
      },
    );
  };

  const requestDelete = (id: number) => {
    if (!canManagePacking) {
      return;
    }

    clearFeedback();
    const item = items.find((candidate) => candidate.id === id);

    if (!item) {
      return;
    }

    setConfirmAction({ type: "delete", item });
  };

  const requestEdit = (id: number) => {
    if (!canManagePacking) {
      return;
    }

    clearFeedback();
    const item = items.find((candidate) => candidate.id === id);

    if (!item) {
      return;
    }

    setEditingItem(item);
  };

  const saveEdit = (values: PackingItemFormValues) => {
    if (!editingItem) {
      return;
    }

    clearFeedback();
    setConfirmAction({ type: "edit", item: editingItem, fields: values });
  };

  const handleConfirmAction = () => {
    if (!confirmAction) {
      return;
    }

    if (confirmAction.type === "edit") {
      clearFeedback();
      updateItemAction.mutate(
        {
          tripId,
          checklistId: confirmAction.item.id,
          data: confirmAction.fields,
        },
        {
          onError: (error) => {
            setSubmitError(
              getPackingChecklistsErrorMessage(
                error as UpdatePackingChecklistMutationError,
              ),
            );
            setConfirmAction(null);
          },
          onSuccess: () => {
            setConfirmAction(null);
            setEditingItem(null);
          },
        },
      );
      return;
    }

    const { item } = confirmAction;

    clearFeedback();
    deleteItemAction.mutate(
      {
        tripId,
        checklistId: item.id,
      },
      {
        onError: (error) =>
          setActionError(
            getPackingChecklistsErrorMessage(
              error as DeletePackingChecklistMutationError,
            ),
          ),
        onSuccess: () => {
          setConfirmAction(null);
          resetOffset();
        },
      },
    );
  };

  const confirmTitle =
    confirmAction?.type === "edit" ? "Save item changes?" : "Delete item?";
  const confirmDescription =
    confirmAction?.type === "edit"
      ? `Save changes to "${
          confirmAction.fields.name ?? confirmAction.item.name ?? "this item"
        }"?`
      : `Delete "${
          confirmAction?.item.name ?? "this item"
        }"? This action cannot be undone.`;
  const confirmLabel =
    confirmAction?.type === "edit" ? "Save changes" : "Delete";
  const confirmColor = confirmAction?.type === "delete" ? "error" : "primary";
  const isConfirmPending =
    confirmAction?.type === "edit"
      ? updateItemAction.isPending
      : deleteItemAction.isPending;

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
              src={packingIcon}
              alt="Packing"
              sx={{ width: 36, height: 36 }}
            />
            <Typography component="h1" variant="h5" sx={{ fontWeight: 800 }}>
              Packing checklist
            </Typography>
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Track and manage items for your trip.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <PackingProgress
            packed={dashboardPackingProgress?.packed ?? 0}
            total={dashboardPackingProgress?.total ?? 0}
            percent={dashboardPackingProgress?.percent}
            isLoading={dashboardQuery.isLoading}
          />
          {canManagePacking ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddModal}
            >
              Add Item
            </Button>
          ) : null}
        </Stack>
      </Stack>

      {pageErrorMessage || actionError ? (
        <Alert severity="error">{pageErrorMessage ?? actionError}</Alert>
      ) : null}

      <Paper variant="outlined" sx={filterPanelSx}>
        <PackingFilters
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          packedFilter={packedFilter}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onPackedChange={handlePackedChange}
        />
      </Paper>

      <PackingCategoryProgress items={categoryProgressItems} />

      {isInitialLoading ? (
        <Typography color="text.secondary">Loading packing items...</Typography>
      ) : null}

      {!isInitialLoading && !packingQuery.error && items.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title={
            hasActiveFilters
              ? "No matching packing items"
              : "No packing items yet"
          }
          description={
            hasActiveFilters
              ? "Try adjusting your filters or search query."
              : canManagePacking
                ? "Add the first item to start tracking your packing progress."
                : "This trip does not have packing items yet."
          }
          action={
            !hasActiveFilters && canManagePacking
              ? { label: "Add First Item", onClick: openAddModal }
              : undefined
          }
        />
      ) : null}

      {groupedItems.length > 0 ? (
        <Stack spacing={3}>
          {groupedItems.map((group) => (
            <PackingCategorySection
              key={group.category}
              category={group.category}
              items={group.items}
              canManage={canManagePacking}
              isActionPending={isMutationPending}
              onTogglePacked={togglePacked}
              onDelete={requestDelete}
              onEdit={requestEdit}
            />
          ))}
        </Stack>
      ) : null}

      {!isInitialLoading && total > 0 ? (
        <TablePaginationToolbar
          currentOffset={currentOffset}
          currentPage={currentPage}
          isFetching={packingQuery.isFetching}
          limit={limit}
          pageCount={pageCount}
          total={total}
          onPageChange={handlePageChange}
        />
      ) : null}

      <PackingItemModal
        isOpen={isAddModalOpen}
        mode="add"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addItem}
        isSubmitting={createItemAction.isPending}
        submitError={submitError}
      />

      <PackingItemModal
        isOpen={Boolean(editingItem)}
        mode="edit"
        editingItem={editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={saveEdit}
        isSubmitting={updateItemAction.isPending}
        submitError={submitError}
      />

      <ConfirmActionDialog
        open={confirmAction != null}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        confirmColor={confirmColor}
        isPending={isConfirmPending}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />
    </Stack>
  );
};

export const PackingChecklistsPage = ({
  tripId,
}: PackingChecklistsPageProps) => (
  <AppLayout tripId={tripId}>
    <PackingChecklistsContent tripId={tripId} />
  </AppLayout>
);
