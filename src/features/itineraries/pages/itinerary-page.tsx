import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRequiredTripId } from '@/app/route-helpers'
import {
  useCreateItineraryAction,
  useDeleteItineraryAction,
  useQueryTripItineraries,
  useUpdateItineraryAction,
} from '@/features/itineraries'
import { ItineraryForm } from '@/features/itineraries/components/itinerary-form'
import { ItineraryFilters } from '@/features/itineraries/components/itinerary-filters'
import { ItineraryList } from '@/features/itineraries/components/itinerary-list'
import { buildItineraryQueryFilters } from '@/features/itineraries/lib/itinerary-filters'
import {
  type ItineraryFormValues,
  toItineraryRequestData,
} from '@/features/itineraries/lib/itinerary-schema'
import {
  ItineraryStatus,
  type ItineraryPageResponse,
  type ItineraryResponse,
} from '@/shared'
import {
  AppDialog,
  Button,
  EmptyState,
  ErrorState,
  PaginationControls,
  PageHeader,
  Skeleton,
} from '@/shared/components/ui'

export const ItineraryPage = () => {
  const tripId = useRequiredTripId()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItinerary, setEditingItinerary] = useState<
    ItineraryResponse | undefined
  >()
  const createItinerary = useCreateItineraryAction({
    mutation: { onSuccess: () => closeDialog() },
  })
  const updateItinerary = useUpdateItineraryAction()
  const deleteItinerary = useDeleteItineraryAction()
  const filterState = useMemo(
    () => buildItineraryQueryFilters(searchParams),
    [searchParams],
  )
  const itineraryQuery = useQueryTripItineraries(
    tripId ?? 0,
    filterState.params,
    {
      query: {
        enabled: Boolean(tripId) && !filterState.filterError,
      },
    },
  )
  const itineraryPage = itineraryQuery.data as ItineraryPageResponse | undefined
  const items = filterState.filterError
    ? []
    : ((itineraryPage?.items ?? []) as ItineraryResponse[])

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

  function closeDialog() {
    setIsDialogOpen(false)
    setEditingItinerary(undefined)
  }

  const handleFormSubmit = (values: ItineraryFormValues) => {
    if (!tripId) {
      return
    }

    const data = toItineraryRequestData(values)

    if (editingItinerary?.id) {
      updateItinerary.mutate(
        { tripId, itineraryId: editingItinerary.id, data },
        { onSuccess: closeDialog },
      )
      return
    }

    createItinerary.mutate({ tripId, data })
  }

  const handleStatusChange = (
    itinerary: ItineraryResponse,
    status: ItineraryStatus,
  ) => {
    if (!tripId || !itinerary.id || !itinerary.activityTitle) {
      return
    }

    updateItinerary.mutate({
      tripId,
      itineraryId: itinerary.id,
      data: {
        activityTitle: itinerary.activityTitle,
        location: itinerary.location,
        startTime: itinerary.startTime,
        endTime: itinerary.endTime,
        category: itinerary.category,
        priority: itinerary.priority,
        status,
      },
    })
  }

  return (
    <section className="page-stack">
      <PageHeader
        title="Itinerary"
        description="Plan activities, filter by date/category/status/priority, and keep overdue items visible."
        action={
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus size={16} />
            Add activity
          </Button>
        }
      />

      <ItineraryFilters searchParams={searchParams} onFilterChange={updateFilter} />

      {filterState.filterError ? (
        <p className="form-error" role="alert">
          {filterState.filterError}
        </p>
      ) : null}

      {itineraryQuery.isLoading && !filterState.filterError ? (
        <Skeleton rows={5} />
      ) : null}
      {itineraryQuery.error && !filterState.filterError ? (
        <ErrorState
          description="Itinerary items could not be loaded."
          action={<Button onClick={() => itineraryQuery.refetch()}>Retry</Button>}
        />
      ) : null}
      {!filterState.filterError &&
      !itineraryQuery.isLoading &&
      !itineraryQuery.error &&
      items.length === 0 ? (
        <EmptyState
          title="No itinerary items yet"
          description="Add the first activity to start building the trip timeline."
          action={
            <Button
              type="button"
              variant="primary"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus size={16} />
              Add activity
            </Button>
          }
        />
      ) : null}

      <ItineraryList
        items={items}
        onDelete={(item) =>
          tripId &&
          item.id &&
          deleteItinerary.mutate({ tripId, itineraryId: item.id })
        }
        onEdit={(item) => {
          setEditingItinerary(item)
          setIsDialogOpen(true)
        }}
        onStatusChange={handleStatusChange}
      />

      {!filterState.filterError ? (
        <PaginationControls
          offset={itineraryPage?.offset}
          limit={itineraryPage?.limit}
          total={itineraryPage?.total}
          disabled={itineraryQuery.isFetching}
          onOffsetChange={updateOffset}
        />
      ) : null}

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingItinerary ? 'Edit activity' : 'Add activity'}
        description="Capture timing, category, priority, and status for this trip activity."
      >
        {tripId ? (
          <ItineraryForm
            itinerary={editingItinerary}
            isPending={createItinerary.isPending || updateItinerary.isPending}
            hasSubmitError={Boolean(createItinerary.error ?? updateItinerary.error)}
            onClose={closeDialog}
            onSubmit={handleFormSubmit}
          />
        ) : null}
      </AppDialog>
    </section>
  )
}
