import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  ErrorState,
  PageHeader,
  PaginationControls,
  Skeleton,
} from '@/shared/components/ui'
import { compactParams } from '@/shared/lib/display'
import { DEFAULT_PAGE_LIMIT, getPageOffset } from '@/shared/lib/pagination'

export const PackingPage = () => {
  const tripId = useRequiredTripId()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<
    PackingChecklistResponse | undefined
  >()
  const createItem = useCreatePackingChecklistAction({
    mutation: { onSuccess: () => closeDialog() },
  })
  const updateItem = useUpdatePackingChecklistAction()
  const deleteItem = useDeletePackingChecklistAction()
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
  const packingQuery = useQueryTripPackingChecklists(tripId ?? 0, filters)
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

  const submitItem = (values: PackingFormValues) => {
    if (!tripId) {
      return
    }

    if (editingItem?.id) {
      updateItem.mutate(
        { tripId, checklistId: editingItem.id, data: values },
        { onSuccess: closeDialog },
      )
      return
    }

    createItem.mutate({ tripId, data: values })
  }

  const togglePacked = (item: PackingChecklistResponse) => {
    if (!tripId || !item.id || !item.name) {
      return
    }

    updateItem.mutate({
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
    })
  }

  const deletePackingItem = (item: PackingChecklistResponse) => {
    if (!tripId || !item.id) {
      return
    }

    deleteItem.mutate({ tripId, checklistId: item.id })
  }

  return (
    <section className="page-stack">
      <PageHeader
        title="Packing"
        description="Track packed and unpacked items with real-time progress."
        action={
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus size={16} />
            Add item
          </Button>
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
        searchParams={searchParams}
        onFilterChange={updateFilter}
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
          action={
            <Button
              type="button"
              variant="primary"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus size={16} />
              Add item
            </Button>
          }
        />
      ) : null}

      <PackingList
        items={items}
        onDelete={deletePackingItem}
        onEdit={(item) => {
          setEditingItem(item)
          setIsDialogOpen(true)
        }}
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
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingItem ? 'Edit packing item' : 'Add packing item'}
        description="Keep quantity, category, and packed state accurate."
      >
        {tripId ? (
          <PackingForm
            item={editingItem}
            isPending={createItem.isPending || updateItem.isPending}
            hasSubmitError={Boolean(createItem.error ?? updateItem.error)}
            onClose={closeDialog}
            onSubmit={submitItem}
          />
        ) : null}
      </AppDialog>
    </section>
  )
}
