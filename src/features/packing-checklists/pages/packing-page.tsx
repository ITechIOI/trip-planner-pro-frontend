import { Box } from '@mui/material'
import { keepPreviousData } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import emptyTravelUrl from '@/assets/generated/empty-travel.svg'
import { useRequiredTripId } from '@/app/route-helpers'
import { PackingFilters } from '@/features/packing-checklists/components/packing-filters'
import { PackingForm } from '@/features/packing-checklists/components/packing-form'
import { PackingList } from '@/features/packing-checklists/components/packing-list'
import { PackingProgressSummary } from '@/features/packing-checklists/components/packing-progress-summary'
import {
  useCreatePackingChecklistAction,
  useDeletePackingChecklistAction,
  useQueryTripPackingChecklists,
  useUpdatePackingChecklistAction,
} from '@/features/packing-checklists'
import {
  getCreatePackingChecklistErrorMessage,
  getDeletePackingChecklistErrorMessage,
  getTogglePackedErrorMessage,
  getUpdatePackingChecklistErrorMessage,
} from '@/features/packing-checklists/lib/packing-checklists-error'
import type { PackingFormValues } from '@/features/packing-checklists/lib/packing-schema'
import { useTripDashboard } from '@/features/trips'
import {
  PackedStatus,
  type PackingChecklistPageResponse,
  type PackingChecklistResponse,
  type QueryTripPackingChecklistsParams,
  type TripDashboardResponse,
} from '@/shared'
import {
  AppDialog,
  Button,
  EmptyState,
  EmptyIllustration,
  ErrorState,
  PageHeader,
  PaginationControls,
  Skeleton,
} from '@/shared/components/ui'
import { compactParams } from '@/shared/lib/display'
import { DEFAULT_PAGE_LIMIT, getPageOffset } from '@/shared/lib/pagination'
import { showErrorToast, showSuccessToast } from '@/shared/components/toast-store'
import { useDebouncedSearchParam } from '@/shared/lib/use-debounced-search-param'
import { useTripAccess } from '@/features/trips'

export const PackingPage = () => {
  const tripId = useRequiredTripId()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = useDebouncedSearchParam({ searchParams, setSearchParams })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<
    PackingChecklistResponse | undefined
  >()
  const createItem = useCreatePackingChecklistAction()
  const updateItem = useUpdatePackingChecklistAction()
  const deleteItem = useDeletePackingChecklistAction()
  const tripAccess = useTripAccess(tripId)
  const canManageResources = tripAccess.canManageResources
  const filters = useMemo(
    () =>
      compactParams({
        search: searchParams.get('search') ?? '',
        category: searchParams.get('category') ?? '',
        packedStatus: searchParams.get('packedStatus') ?? '',
        offset: getPageOffset(searchParams.get('offset')),
        limit: DEFAULT_PAGE_LIMIT,
      }) as QueryTripPackingChecklistsParams,
    [searchParams],
  )
  const packingQuery = useQueryTripPackingChecklists(tripId ?? 0, filters, {
    query: { placeholderData: keepPreviousData },
  })
  const dashboardQuery = useTripDashboard(tripId ?? 0)
  const packingPage = packingQuery.data as PackingChecklistPageResponse | undefined
  const items = (packingPage?.items ?? []) as PackingChecklistResponse[]
  const dashboard = dashboardQuery.data as TripDashboardResponse | undefined
  const packedCount = dashboard?.packingProgress?.packed ?? 0
  const totalCount = dashboard?.packingProgress?.total ?? 0
  const progress = dashboard?.packingProgress?.percent ?? 0

  function closeDialog() {
    setIsDialogOpen(false)
    setEditingItem(undefined)
  }

  const showReadOnlyToast = () => {
    showErrorToast('You can view this trip, but your role cannot make changes.')
  }

  const openCreateDialog = () => {
    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    setIsDialogOpen(true)
  }

  const openEditDialog = (item: PackingChecklistResponse) => {
    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)

    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }

    next.delete('offset')
    setSearchParams(next)
  }

  const updateOffset = (offset: number) => {
    const next = new URLSearchParams(searchParams)

    if (offset > 0) {
      next.set('offset', String(offset))
    } else {
      next.delete('offset')
    }

    setSearchParams(next)
  }

  const resetFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  const submitItem = (values: PackingFormValues) => {
    if (!tripId) {
      return
    }

    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    if (editingItem?.id) {
      updateItem.mutate(
        { tripId, checklistId: editingItem.id, data: values },
        {
          onError: (error) =>
            showErrorToast(getUpdatePackingChecklistErrorMessage(error)),
          onSuccess: () => {
            closeDialog()
            showSuccessToast('Packing item saved.')
          },
        },
      )
      return
    }

    createItem.mutate(
      { tripId, data: values },
      {
        onError: (error) =>
          showErrorToast(getCreatePackingChecklistErrorMessage(error)),
        onSuccess: () => {
          closeDialog()
          showSuccessToast('Packing item added.')
        },
      },
    )
  }

  const togglePacked = (item: PackingChecklistResponse) => {
    if (!tripId || !item.id || !item.name) {
      return
    }

    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    updateItem.mutate(
      {
        tripId,
        checklistId: item.id,
        data: {
          name: item.name,
          quantity: item.quantity ?? 0,
          category: item.category,
          requiredStatus: item.requiredStatus,
          packedStatus:
            item.packedStatus === PackedStatus.PACKED
              ? PackedStatus.NOT_PACKED
              : PackedStatus.PACKED,
        },
      },
      {
        onError: (error) => showErrorToast(getTogglePackedErrorMessage(error)),
        onSuccess: () => showSuccessToast('Packed status updated.'),
      },
    )
  }

  const deletePackingItem = (item: PackingChecklistResponse) => {
    if (!tripId || !item.id) {
      return
    }

    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    deleteItem.mutate(
      { tripId, checklistId: item.id },
      {
        onError: (error) =>
          showErrorToast(getDeletePackingChecklistErrorMessage(error)),
        onSuccess: () => showSuccessToast('Packing item deleted.'),
      },
    )
  }

  return (
    <Box
      className="page-stack"
      component="section"
      sx={{ display: 'grid', gap: 2.75 }}
    >
      <PageHeader
        title="Packing"
        description="Track packed and unpacked items with real-time progress."
        action={
          canManageResources ? (
            <Button type="button" variant="primary" onClick={openCreateDialog}>
              <Plus size={16} />
              Add item
            </Button>
          ) : undefined
        }
      />

      <PackingProgressSummary
        isLoading={dashboardQuery.isLoading}
        hasError={Boolean(dashboardQuery.error)}
        packedCount={packedCount}
        totalCount={totalCount}
        progress={progress}
      />

      <PackingFilters
        onSearchChange={search.onChange}
        searchParams={searchParams}
        searchValue={search.value}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {packingQuery.isLoading ? <Skeleton rows={5} /> : null}
      {packingQuery.error ? (
        <ErrorState
          description="Packing checklist could not be loaded."
          action={<Button onClick={() => packingQuery.refetch()}>Retry</Button>}
        />
      ) : null}
      {!packingQuery.isLoading && !packingQuery.error && items.length === 0 ? (
        <EmptyState
          title="No packing items yet"
          description="Add the first packing item and mark it packed when ready."
          illustration={<EmptyIllustration src={emptyTravelUrl} alt="" />}
          action={
            canManageResources ? (
              <Button type="button" variant="primary" onClick={openCreateDialog}>
                <Plus size={16} />
                Add item
              </Button>
            ) : undefined
          }
        />
      ) : null}

      <PackingList
        canManage={canManageResources}
        items={items}
        onDelete={deletePackingItem}
        onEdit={openEditDialog}
        onTogglePacked={togglePacked}
      />

      <PaginationControls
        offset={packingPage?.offset}
        limit={packingPage?.limit}
        total={packingPage?.total}
        disabled={packingQuery.isFetching}
        onOffsetChange={updateOffset}
      />

      <AppDialog
        open={canManageResources && isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingItem ? 'Edit packing item' : 'Add packing item'}
        description="Keep quantity, category, and packed state accurate."
      >
        {tripId ? (
          <PackingForm
            item={editingItem}
            isPending={createItem.isPending || updateItem.isPending}
            onClose={closeDialog}
            onSubmit={submitItem}
          />
        ) : null}
      </AppDialog>
    </Box>
  )
}
