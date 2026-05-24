import { useState } from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SearchIcon from '@mui/icons-material/Search'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
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

export type AppHeaderProps = {
  tripId: number
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) {
    return ''
  }

  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const AppHeader = ({ tripId }: AppHeaderProps) => {
  const [showAlerts, setShowAlerts] = useState(true)
  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null)

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

  const hasAlerts =
    stats.hasOverdueActivities || stats.isBudgetWarning || stats.isBudgetCritical

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      {errorMessage ? (
        <Alert severity="error" sx={{ borderRadius: 0 }}>
          {errorMessage}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
          px: 3,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {trip?.tripName ?? 'Trip'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 0.5 }}>
              <PlaceOutlinedIcon sx={{ fontSize: 16 }} />
              {trip?.destination || 'No destination set'}
            </Typography>
            {trip?.startDate ? (
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 0.5 }}>
                <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </Typography>
            ) : null}
          </Box>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, maxWidth: 480, mx: 2 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search activities, items, expenses..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={(event) => setAccountAnchor(event.currentTarget)}>
            <PersonOutlineOutlinedIcon />
          </IconButton>
          <Menu
            anchorEl={accountAnchor}
            open={Boolean(accountAnchor)}
            onClose={() => setAccountAnchor(null)}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Export Trip Data</MenuItem>
          </Menu>
        </Box>
      </Box>

      {showAlerts && hasAlerts ? (
        <Alert
          severity={stats.isBudgetCritical ? 'error' : 'warning'}
          icon={
            stats.isBudgetCritical ? (
              <ErrorOutlineOutlinedIcon fontSize="inherit" />
            ) : (
              <WarningAmberOutlinedIcon fontSize="inherit" />
            )
          }
          action={
            <IconButton size="small" onClick={() => setShowAlerts(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          sx={{ borderRadius: 0 }}
        >
          <AlertTitle sx={{ mb: 0 }}>
            {stats.isBudgetCritical
              ? `Critical: Budget exceeded by ${formatTripCurrency(Math.abs(stats.remainingBudget))}!`
              : stats.isBudgetWarning
                ? `Warning: You have used ${stats.budgetUsagePercentage}% of your budget.`
                : `${stats.overdueActivities} overdue ${stats.overdueActivities === 1 ? 'activity' : 'activities'} detected.`}
          </AlertTitle>
        </Alert>
      ) : null}
    </Box>
  )
}
