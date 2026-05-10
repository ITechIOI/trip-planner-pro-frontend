import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  useCreateTripAction,
  useDeleteTripAction,
  useTrips,
  useUpdateTripAction,
} from '@/features/trips'
import { TripCard } from '@/features/trips/components/trip-card'
import { TripForm } from '@/features/trips/components/trip-form'
import {
  normalizeTripDate,
  type TripFormValues,
} from '@/features/trips/lib/trip-schema'
import type { TripPageResponse, TripResponse } from '@/shared'
import {
  AppDialog,
  Button,
  EmptyState,
  ErrorState,
  PaginationControls,
  PageHeader,
  Skeleton,
} from '@/shared/components/ui'
import { DEFAULT_PAGE_LIMIT, getPageOffset } from '@/shared/lib/pagination'

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
  const createTrip = useCreateTripAction({
    mutation: {
      onSuccess: (createdTrip) => {
        closeDialog()
        if (createdTrip.id) {
          navigate(`/trips/${createdTrip.id}/dashboard`)
        }
      },
    },
  })
  const updateTrip = useUpdateTripAction({
    mutation: {
      onSuccess: () => closeDialog(),
    },
  })
  const tripsPage = tripsQuery.data as TripPageResponse | undefined
  const trips = useMemo(
    () => (tripsPage?.items ?? []) as TripResponse[],
    [tripsPage],
  )

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
      updateTrip.mutate({ tripId: editingTrip.id, data })
      return
    }

    createTrip.mutate({ data })
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
    <main className="standalone-page trips-page">
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
          action={
            <Button type="button" variant="primary" onClick={openCreateDialog}>
              <Plus size={16} />
              Create trip
            </Button>
          }
        />
      ) : null}

      <div className="trip-grid">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onEdit={openEditDialog}
            onDelete={(tripId) => deleteTrip.mutate({ tripId })}
          />
        ))}
      </div>

      <PaginationControls
        offset={tripsPage?.offset}
        limit={tripsPage?.limit}
        total={tripsPage?.total}
        disabled={tripsQuery.isFetching}
        onOffsetChange={updateOffset}
      />

      {deleteTrip.error ? (
        <p className="form-error" role="alert">
          Trip could not be deleted. Please retry.
        </p>
      ) : null}

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingTrip ? 'Edit trip' : 'Create trip'}
        description="Set the trip name, date range, and initial budget."
      >
        <TripForm
          trip={editingTrip}
          isPending={createTrip.isPending || updateTrip.isPending}
          hasSubmitError={Boolean(createTrip.error ?? updateTrip.error)}
          onClose={closeDialog}
          onSubmit={handleTripSubmit}
        />
      </AppDialog>
    </main>
  )
}
