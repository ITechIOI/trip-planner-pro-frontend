import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { AppLayout } from '@/shared/components/app-layout'
import { ProgressRing } from '@/shared/components/progress-ring'
import { useTrip, useTripDashboard } from '@/features/trips/api/use-trip-action'
import { getTripsErrorMessage } from '@/features/trips/lib/trips-error'
import {
  buildItineraryDashboardStats,
  formatTripCurrency,
} from '@/features/itineraries/lib/itinerary-dashboard-stats'
import { normalizeTripFromApi } from '@/features/itineraries/api/itinerary-mappers'
import type {
  GetTripDashboardQueryError,
  GetTripQueryError,
  TripDashboardResponse,
  TripResponse,
} from '@/shared'

export type TripDashboardPageProps = {
  tripId: number
}

const DashboardContent = ({ tripId }: TripDashboardPageProps) => {
  const tripQuery = useTrip(tripId)
  const dashboardQuery = useTripDashboard(tripId)

  const trip = normalizeTripFromApi(tripQuery.data as TripResponse | undefined)
  const stats = buildItineraryDashboardStats(
    dashboardQuery.data as TripDashboardResponse | undefined,
  )
  const errorMessage = tripQuery.error
    ? getTripsErrorMessage(tripQuery.error as GetTripQueryError)
    : dashboardQuery.error
      ? getTripsErrorMessage(dashboardQuery.error as GetTripDashboardQueryError)
      : null

  if (tripQuery.isLoading || dashboardQuery.isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Loading dashboard...
      </Typography>
    )
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Overview of {trip?.tripName ?? 'your trip'} — {trip?.destination || 'Trip'}
        </Typography>
      </Box>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <ProgressRing
              progress={stats.itineraryCompletionPercentage}
              size={64}
            />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Itinerary
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stats.completedActivities}/{stats.totalActivities}
              </Typography>
            </Box>
          </Stack>
        </Paper>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Packing
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {stats.packingCompletionPercentage}%
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Budget remaining
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {formatTripCurrency(stats.remainingBudget)}
          </Typography>
        </Paper>
      </Box>
    </Stack>
  )
}

export const TripDashboardPage = ({ tripId }: TripDashboardPageProps) => (
  <AppLayout tripId={tripId}>
    <DashboardContent tripId={tripId} />
  </AppLayout>
)

export default TripDashboardPage
