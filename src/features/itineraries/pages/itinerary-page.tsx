import { Alert, Box, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { keepPreviousData } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import emptyTravelUrl from '@/assets/generated/empty-travel.svg'
import { useRequiredTripId } from '@/app/route-helpers'
import {
  useCreateItineraryAction,
  useDeleteItineraryAction,
  useItineraryCalendar,
  useQueryTripItineraries,
  useUpdateItineraryAction,
} from '@/features/itineraries'
import { ItineraryCalendar } from '@/features/itineraries/components/itinerary-calendar'
import { ItineraryForm } from '@/features/itineraries/components/itinerary-form'
import { ItineraryFilters } from '@/features/itineraries/components/itinerary-filters'
import { ItineraryList } from '@/features/itineraries/components/itinerary-list'
import { normalizeCalendarMonth } from '@/features/itineraries/lib/itinerary-calendar'
import {
  getCreateItineraryErrorMessage,
  getDeleteItineraryErrorMessage,
  getUpdateItineraryErrorMessage,
  getUpdateItineraryStatusErrorMessage,
} from '@/features/itineraries/lib/itineraries-error'
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
import { useTripAccess } from '@/features/trips'
import { showErrorToast, showSuccessToast } from '@/shared/components/toast-store'
import { useDebouncedSearchParam } from '@/shared/lib/use-debounced-search-param'
import {
  AppDialog,
  Button,
  EmptyState,
  EmptyIllustration,
  ErrorState,
  PaginationControls,
  PageHeader,
  Skeleton,
} from '@/shared/components/ui'

export const ItineraryPage = () => {
  const tripId = useRequiredTripId()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = useDebouncedSearchParam({ searchParams, setSearchParams })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItinerary, setEditingItinerary] = useState<
    ItineraryResponse | undefined
  >()
  const createItinerary = useCreateItineraryAction()
  const updateItinerary = useUpdateItineraryAction()
  const deleteItinerary = useDeleteItineraryAction()
  const tripAccess = useTripAccess(tripId)
  const canManageResources = tripAccess.canManageResources
  const filterState = useMemo(
    () => buildItineraryQueryFilters(searchParams),
    [searchParams],
  )
  const viewMode = searchParams.get('view') === 'calendar' ? 'calendar' : 'list'
  const calendarMonth = normalizeCalendarMonth(
    searchParams.get('month') ?? searchParams.get('date')?.slice(0, 7),
  )
  const itineraryQuery = useQueryTripItineraries(
    tripId ?? 0,
    filterState.params,
    {
      query: {
        enabled: Boolean(tripId) && viewMode === 'list' && !filterState.filterError,
        placeholderData: keepPreviousData,
      },
    },
  )
  const calendarQuery = useItineraryCalendar(
    tripId,
    calendarMonth,
    viewMode === 'calendar',
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

  const resetFilters = () => {
    const next = new URLSearchParams()
    const view = searchParams.get('view')
    const month = searchParams.get('month')

    if (view) {
      next.set('view', view)
    }

    if (month) {
      next.set('month', month)
    }

    setSearchParams(next)
  }

  const updateView = (nextView: 'list' | 'calendar') => {
    const next = new URLSearchParams(searchParams)

    next.set('view', nextView)
    next.delete('offset')
    setSearchParams(next)
  }

  const updateCalendarMonth = (month: string) => {
    const next = new URLSearchParams(searchParams)

    next.set('view', 'calendar')
    next.set('month', month)
    next.delete('offset')

    if (!next.get('date')?.startsWith(month)) {
      next.delete('date')
    }

    setSearchParams(next)
  }

  const updateCalendarDate = (date: string) => {
    const next = new URLSearchParams(searchParams)

    next.set('view', 'calendar')
    next.set('month', date.slice(0, 7))
    next.set('date', date)
    next.delete('offset')
    setSearchParams(next)
  }

  function closeDialog() {
    setIsDialogOpen(false)
    setEditingItinerary(undefined)
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

  const openEditDialog = (item: ItineraryResponse) => {
    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    setEditingItinerary(item)
    setIsDialogOpen(true)
  }

  const handleFormSubmit = (values: ItineraryFormValues) => {
    if (!tripId) {
      return
    }

    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    const data = toItineraryRequestData(values)

    if (editingItinerary?.id) {
      updateItinerary.mutate(
        { tripId, itineraryId: editingItinerary.id, data },
        {
          onError: (error) => showErrorToast(getUpdateItineraryErrorMessage(error)),
          onSuccess: () => {
            closeDialog()
            showSuccessToast('Activity saved.')
          },
        },
      )
      return
    }

    createItinerary.mutate(
      { tripId, data },
      {
        onError: (error) => showErrorToast(getCreateItineraryErrorMessage(error)),
        onSuccess: () => {
          closeDialog()
          showSuccessToast('Activity added.')
        },
      },
    )
  }

  const handleStatusChange = (
    itinerary: ItineraryResponse,
    status: ItineraryStatus,
  ) => {
    if (!tripId || !itinerary.id || !itinerary.activityTitle) {
      return
    }

    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    updateItinerary.mutate(
      {
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
      },
      {
        onError: (error) =>
          showErrorToast(getUpdateItineraryStatusErrorMessage(error)),
        onSuccess: () => showSuccessToast('Activity status updated.'),
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
        title="Itinerary"
        description="Plan activities, filter by date/category/status/priority, and keep overdue items visible."
        action={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <ToggleButtonGroup
              exclusive
              aria-label="Itinerary view"
              onChange={(_event, nextView: 'list' | 'calendar' | null) => {
                if (nextView) {
                  updateView(nextView)
                }
              }}
              size="small"
              value={viewMode}
            >
              <ToggleButton value="list">List</ToggleButton>
              <ToggleButton value="calendar">Calendar</ToggleButton>
            </ToggleButtonGroup>
            {canManageResources ? (
              <Button
                type="button"
                variant="primary"
                onClick={openCreateDialog}
              >
                <Plus size={16} />
                Add activity
              </Button>
            ) : null}
          </Stack>
        }
      />

      {viewMode === 'list' ? (
        <ItineraryFilters
          onSearchChange={search.onChange}
          searchParams={searchParams}
          searchValue={search.value}
          onFilterChange={updateFilter}
          onReset={resetFilters}
        />
      ) : null}

      {viewMode === 'list' && filterState.filterError ? (
        <Alert className="form-error" role="alert" severity="error">
          {filterState.filterError}
        </Alert>
      ) : null}

      {viewMode === 'list' && itineraryQuery.isLoading && !filterState.filterError ? (
        <Skeleton rows={5} />
      ) : null}
      {viewMode === 'list' && itineraryQuery.error && !filterState.filterError ? (
        <ErrorState
          description="Itinerary items could not be loaded."
          action={<Button onClick={() => itineraryQuery.refetch()}>Retry</Button>}
        />
      ) : null}
      {viewMode === 'list' &&
      !filterState.filterError &&
      !itineraryQuery.isLoading &&
      !itineraryQuery.error &&
      items.length === 0 ? (
        <EmptyState
          title="No itinerary items yet"
          description="Add the first activity to start building the trip timeline."
          illustration={<EmptyIllustration src={emptyTravelUrl} alt="" />}
          action={
            canManageResources ? (
              <Button
                type="button"
                variant="primary"
                onClick={openCreateDialog}
              >
                <Plus size={16} />
                Add activity
              </Button>
            ) : undefined
          }
        />
      ) : null}

      {viewMode === 'list' ? (
        <ItineraryList
          canManage={canManageResources}
          items={items}
          onDelete={(item) =>
            canManageResources
              ? tripId &&
                item.id &&
                deleteItinerary.mutate(
                  { tripId, itineraryId: item.id },
                  {
                    onError: (error) =>
                      showErrorToast(getDeleteItineraryErrorMessage(error)),
                    onSuccess: () => showSuccessToast('Activity deleted.'),
                  },
                )
              : showReadOnlyToast()
          }
          onEdit={openEditDialog}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <ItineraryCalendar
          canManage={canManageResources}
          items={(calendarQuery.data?.items ?? []) as ItineraryResponse[]}
          month={calendarMonth}
          selectedDate={searchParams.get('date') ?? undefined}
          isLoading={calendarQuery.isLoading}
          hasError={Boolean(calendarQuery.error)}
          onDateSelect={updateCalendarDate}
          onMonthChange={updateCalendarMonth}
          onRetry={() => calendarQuery.refetch()}
          onDelete={(item) =>
            canManageResources
              ? tripId &&
                item.id &&
                deleteItinerary.mutate(
                  { tripId, itineraryId: item.id },
                  {
                    onError: (error) =>
                      showErrorToast(getDeleteItineraryErrorMessage(error)),
                    onSuccess: () => showSuccessToast('Activity deleted.'),
                  },
                )
              : showReadOnlyToast()
          }
          onEdit={openEditDialog}
        />
      )}

      {viewMode === 'list' && !filterState.filterError ? (
        <PaginationControls
          offset={itineraryPage?.offset}
          limit={itineraryPage?.limit}
          total={itineraryPage?.total}
          disabled={itineraryQuery.isFetching}
          onOffsetChange={updateOffset}
        />
      ) : null}

      <AppDialog
        open={canManageResources && isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingItinerary ? 'Edit activity' : 'Add activity'}
        description="Capture timing, category, priority, and status for this trip activity."
      >
        {tripId ? (
          <ItineraryForm
            itinerary={editingItinerary}
            isPending={createItinerary.isPending || updateItinerary.isPending}
            onClose={closeDialog}
            onSubmit={handleFormSubmit}
          />
        ) : null}
      </AppDialog>
    </Box>
  )
}
