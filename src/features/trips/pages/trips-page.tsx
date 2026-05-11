import { Box } from '@mui/material'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import emptyTravelUrl from '@/assets/generated/empty-travel.svg'
import {
  useCreateTripAction,
  useDeleteTripAction,
  useTripAccessMap,
  useTrips,
  useUpdateTripAction,
} from '@/features/trips'
import { TripForm } from '@/features/trips/components/trip-form'
import { TripList } from '@/features/trips/components/trip-list'
import {
  getCreateTripErrorMessage,
  getDeleteTripErrorMessage,
  getUpdateTripErrorMessage,
} from '@/features/trips/lib/trips-error'
import {
  normalizeTripDate,
  type TripFormValues,
} from '@/features/trips/lib/trip-schema'
import type { TripPageResponse, TripResponse } from '@/shared'
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
import { DEFAULT_PAGE_LIMIT, getPageOffset } from '@/shared/lib/pagination'
import { showErrorToast, showSuccessToast } from '@/shared/components/toast-store'

export const TripsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tripsQuery = useTrips({
    offset: getPageOffset(searchParams.get('offset')),
    limit: DEFAULT_PAGE_LIMIT,
  })
  const deleteTrip = useDeleteTripAction()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<TripResponse | undefined>()
  const navigate = useNavigate()
  const createTrip = useCreateTripAction()
  const updateTrip = useUpdateTripAction()
  const tripsPage = tripsQuery.data as TripPageResponse | undefined
  const trips = useMemo(
    () => (tripsPage?.items ?? []) as TripResponse[],
    [tripsPage],
  )
  const tripAccessMap = useTripAccessMap(trips)

  const openCreateDialog = () => {
    setEditingTrip(undefined)
    setIsDialogOpen(true)
  }

  const openEditDialog = (trip: TripResponse) => {
    setEditingTrip(trip)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingTrip(undefined)
  }

  const handleTripSubmit = (values: TripFormValues) => {
    const data = {
      name: values.name,
      estimatedBudget: values.estimatedBudget,
      startDate: normalizeTripDate(values.startDate),
      endDate: normalizeTripDate(values.endDate),
    }

    if (editingTrip?.id) {
      updateTrip.mutate(
        { tripId: editingTrip.id, data },
        {
          onError: (error) => showErrorToast(getUpdateTripErrorMessage(error)),
          onSuccess: () => {
            closeDialog()
            showSuccessToast('Trip saved.')
          },
        },
      )
      return
    }

    createTrip.mutate(
      { data },
      {
        onError: (error) => showErrorToast(getCreateTripErrorMessage(error)),
        onSuccess: (createdTrip) => {
          closeDialog()
          showSuccessToast('Trip created.')
          if (createdTrip.id) {
            navigate(`/trips/${createdTrip.id}/dashboard`)
          }
        },
      },
    )
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

  return (
    <Box
      className="page-stack trips-page"
      component="section"
      sx={{
        display: 'grid',
        gap: 2.75,
      }}
    >
      <PageHeader
        title="Trips"
        description="Choose a trip workspace or create a new plan for your family."
        action={
          <Button type="button" variant="primary" onClick={openCreateDialog}>
            <Plus size={16} />
            New trip
          </Button>
        }
      />

      {tripsQuery.isLoading ? <Skeleton rows={4} /> : null}

      {tripsQuery.error ? (
        <ErrorState
          description="Trip list could not be loaded. Sign in again or retry the request."
          action={<Button onClick={() => tripsQuery.refetch()}>Retry</Button>}
        />
      ) : null}

      {!tripsQuery.isLoading && !tripsQuery.error && trips.length === 0 ? (
        <EmptyState
          title="No trips yet"
          description="Create your first travel plan to start tracking itinerary, packing, and budget."
          illustration={<EmptyIllustration src={emptyTravelUrl} alt="" />}
          action={
            <Button type="button" variant="primary" onClick={openCreateDialog}>
              <Plus size={16} />
              Create trip
            </Button>
          }
        />
      ) : null}

      <TripList
        accessByTripId={tripAccessMap.accessByTripId}
        offset={tripsPage?.offset ?? 0}
        trips={trips}
        onEdit={openEditDialog}
        onDelete={(tripId) =>
          deleteTrip.mutate(
            { tripId },
            {
              onError: (error) => showErrorToast(getDeleteTripErrorMessage(error)),
              onSuccess: () => showSuccessToast('Trip deleted.'),
            },
          )
        }
      />

      <PaginationControls
        offset={tripsPage?.offset}
        limit={tripsPage?.limit}
        total={tripsPage?.total}
        disabled={tripsQuery.isFetching}
        onOffsetChange={updateOffset}
      />

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingTrip ? 'Edit trip' : 'Create trip'}
        description="Set the trip name, date range, and initial budget."
      >
        <TripForm
          trip={editingTrip}
          isPending={createTrip.isPending || updateTrip.isPending}
          onClose={closeDialog}
          onSubmit={handleTripSubmit}
        />
      </AppDialog>
    </Box>
  )
}
