import { Box } from '@mui/material'
import { useRequiredTripId } from '@/app/route-helpers'
import { DashboardMetrics } from '@/features/trips/components/dashboard-metrics'
import { DashboardSidePanels } from '@/features/trips/components/dashboard-side-panels'
import { DashboardTimeline } from '@/features/trips/components/dashboard-timeline'
import { useTripDashboard } from '@/features/trips'
import type { TripDashboardResponse } from '@/shared'
import { Button, ErrorState, PageHeader, Skeleton } from '@/shared/components/ui'

export const TripDashboardPage = () => {
  const tripId = useRequiredTripId()
  const dashboardQuery = useTripDashboard(tripId ?? 0)
  const dashboard = dashboardQuery.data as TripDashboardResponse | undefined

  return (
    <Box
      className="page-stack"
      component="section"
      sx={{ display: 'grid', gap: 2.75 }}
    >
      <PageHeader
        title="Dashboard"
        description="A focused overview of the itinerary, packing progress, budget usage, unpaid items, and overdue activities."
      />

      {dashboardQuery.isLoading ? <Skeleton rows={6} /> : null}

      {dashboardQuery.error ? (
        <ErrorState
          description="Dashboard data could not be loaded."
          action={<Button onClick={() => dashboardQuery.refetch()}>Retry</Button>}
        />
      ) : null}

      {dashboard ? (
        <>
          <DashboardMetrics dashboard={dashboard} />

          <Box
            className="dashboard-grid"
            sx={{
              display: 'grid',
              alignItems: 'start',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                lg: 'minmax(0, 1.7fr) minmax(320px, 0.8fr)',
              },
            }}
          >
            <DashboardTimeline dashboard={dashboard} />
            <DashboardSidePanels dashboard={dashboard} />
          </Box>
        </>
      ) : null}
    </Box>
  )
}
