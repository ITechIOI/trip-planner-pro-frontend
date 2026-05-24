import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import { AppLayout } from '@/shared/components/app-layout'
import { EmptyState } from '@/shared/components/empty-state'
import {
  useTrip,
  useTripDashboard,
} from '@/features/trips/api/use-trip-action'
import { useTripBudgetSummary } from '@/features/budgets/api'
import {
  DashboardMetrics,
  DashboardSidePanels,
  DashboardTimeline,
} from '@/features/trips/components'
import { formatDashboardDateRange } from '@/features/trips/lib/dashboard-fields'
import { getTripsErrorMessage } from '@/features/trips/lib/trips-error'
import { normalizeTripFromApi } from '@/features/itineraries/api/itinerary-mappers'
import type {
  BudgetSummaryResponse,
  GetTripDashboardQueryError,
  GetTripQueryError,
  TripDashboardResponse,
  TripResponse,
} from '@/shared'

export type TripDashboardPageProps = {
  tripId: number
}

const DashboardLoadingState = () => (
  <Stack spacing={2}>
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(5, minmax(0, 1fr))',
        },
      }}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="45%" height={42} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="rounded" height={8} sx={{ mt: 2 }} />
        </Paper>
      ))}
    </Box>
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          lg: 'minmax(0, 2fr) minmax(300px, 1fr)',
        },
      }}
    >
      <Skeleton variant="rounded" height={420} />
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={180} />
        <Skeleton variant="rounded" height={210} />
      </Stack>
    </Box>
  </Stack>
)

const DashboardContent = ({ tripId }: TripDashboardPageProps) => {
  const tripQuery = useTrip(tripId)
  const dashboardQuery = useTripDashboard(tripId)
  const budgetSummaryQuery = useTripBudgetSummary(tripId)

  const trip = normalizeTripFromApi(tripQuery.data as TripResponse | undefined)
  const dashboard = dashboardQuery.data as TripDashboardResponse | undefined
  const budgetSummary = budgetSummaryQuery.data as
    | BudgetSummaryResponse
    | undefined
  const tripName = dashboard?.tripName ?? trip?.tripName ?? 'this trip'
  const dateRange = formatDashboardDateRange(trip?.startDate, trip?.endDate)
  const errorMessage = tripQuery.error
    ? getTripsErrorMessage(tripQuery.error as GetTripQueryError)
    : dashboardQuery.error
      ? getTripsErrorMessage(dashboardQuery.error as GetTripDashboardQueryError)
      : null

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <DashboardOutlinedIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography component="h1" variant="h5" sx={{ fontWeight: 800 }}>
            Dashboard
          </Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {tripName}
          {dateRange !== 'No date - No date' ? ` - ${dateRange}` : ''}
        </Typography>
      </Box>

      {errorMessage ? (
        <Alert
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                void tripQuery.refetch()
                void dashboardQuery.refetch()
              }}
            >
              Retry
            </Button>
          }
          severity="error"
        >
          {errorMessage}
        </Alert>
      ) : null}

      {tripQuery.isLoading || dashboardQuery.isLoading ? (
        <DashboardLoadingState />
      ) : null}

      {!tripQuery.isLoading && !dashboardQuery.isLoading && dashboard ? (
        <>
          <DashboardMetrics dashboard={dashboard} />
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                lg: 'minmax(0, 2fr) minmax(300px, 1fr)',
              },
              alignItems: 'start',
            }}
          >
            <DashboardTimeline dashboard={dashboard} tripId={tripId} />
            <DashboardSidePanels
              budgetSummary={budgetSummary}
              dashboard={dashboard}
              isBudgetSummaryLoading={budgetSummaryQuery.isLoading}
              tripId={tripId}
            />
          </Box>
        </>
      ) : null}

      {!tripQuery.isLoading &&
      !dashboardQuery.isLoading &&
      !errorMessage &&
      !dashboard ? (
        <EmptyState
          icon={DashboardOutlinedIcon}
          title="Dashboard data is not available"
          description="This trip does not have dashboard data yet."
        />
      ) : null}
    </Stack>
  )
}

export const TripDashboardPage = ({ tripId }: TripDashboardPageProps) => (
  <AppLayout tripId={tripId}>
    <DashboardContent tripId={tripId} />
  </AppLayout>
)

export default TripDashboardPage
