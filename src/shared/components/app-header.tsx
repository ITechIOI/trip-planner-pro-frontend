import { useMemo, useState } from 'react'
import { matchPath, useLocation, useNavigate, useParams } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { SelectChangeEvent } from '@mui/material/Select'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CloseIcon from '@mui/icons-material/Close'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import {
  buildTripBudgetPath,
  buildTripDashboardPath,
  buildTripItineraryPath,
  buildTripMembersPath,
  buildTripPackingPath,
  buildTripsPath,
  routePaths,
} from '@/app/router'
import {
  parseTripIdParam,
  type TripRouteParams,
} from '@/app/router/trip-route-params'
import {
  useTrip,
  useTripDashboard,
  useTrips,
} from '@/features/trips/api/use-trip-action'
import { getTripsErrorMessage } from '@/features/trips/lib/trips-error'
import { useCurrentUser } from '@/features/users/api/use-user-action'
import {
  buildItineraryDashboardStats,
  formatTripCurrency,
} from '@/features/itineraries/lib/itinerary-dashboard-stats'
import type {
  GetTripDashboardQueryError,
  GetTripQueryError,
  ListTripsQueryError,
  TripDashboardResponse,
  TripPageResponse,
  TripResponse,
  UserResponse,
} from '@/shared'
import { clearAccessToken } from '@/shared'

const TRIP_SELECTOR_LIMIT = 50
const MANAGE_TRIPS_VALUE = '__manage_trips'

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

const appendCurrentSearch = (path: string, search: string) =>
  search ? `${path}${search}` : path

const getInitials = (name?: string | null) => {
  const source = name?.trim() || 'User'
  const initials = source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return initials || 'U'
}

const buildSameSectionTripPath = (
  tripId: number,
  pathname: string,
  search: string,
) => {
  if (matchPath({ path: routePaths.tripItinerary, end: true }, pathname)) {
    return appendCurrentSearch(buildTripItineraryPath(tripId), search)
  }

  if (matchPath({ path: routePaths.tripMembers, end: true }, pathname)) {
    return appendCurrentSearch(buildTripMembersPath(tripId), search)
  }

  if (matchPath({ path: routePaths.tripPacking, end: true }, pathname)) {
    return appendCurrentSearch(buildTripPackingPath(tripId), search)
  }

  if (matchPath({ path: routePaths.tripBudget, end: true }, pathname)) {
    return appendCurrentSearch(buildTripBudgetPath(tripId), search)
  }

  return buildTripDashboardPath(tripId)
}

export const AppHeader = () => {
  const { tripId } = useParams<TripRouteParams>()
  const selectedTripId = parseTripIdParam(tripId)
  const location = useLocation()
  const navigate = useNavigate()
  const [showAlerts, setShowAlerts] = useState(true)
  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null)

  const currentUserQuery = useCurrentUser()
  const tripsQuery = useTrips({
    offset: 0,
    limit: TRIP_SELECTOR_LIMIT,
  })
  const tripQuery = useTrip(selectedTripId ?? 0, {
    query: { enabled: Boolean(selectedTripId) },
  })
  const dashboardQuery = useTripDashboard(selectedTripId ?? 0, {
    query: { enabled: Boolean(selectedTripId) },
  })

  const tripsPage = tripsQuery.data as TripPageResponse | undefined
  const tripOptions = useMemo(
    () => (tripsPage?.items ?? []) as TripResponse[],
    [tripsPage],
  )
  const currentUser = currentUserQuery.data as UserResponse | undefined
  const currentTrip = tripQuery.data as TripResponse | undefined
  const selectedTrip =
    currentTrip ?? tripOptions.find((trip) => trip.id === selectedTripId)
  const stats = buildItineraryDashboardStats(
    dashboardQuery.data as TripDashboardResponse | undefined,
  )

  const tripsErrorMessage = tripsQuery.error
    ? getTripsErrorMessage(tripsQuery.error as ListTripsQueryError)
    : null
  const tripErrorMessage = tripQuery.error
    ? getTripsErrorMessage(tripQuery.error as GetTripQueryError)
    : dashboardQuery.error
      ? getTripsErrorMessage(dashboardQuery.error as GetTripDashboardQueryError)
      : null
  const errorMessage = tripsErrorMessage ?? tripErrorMessage
  const hasAlerts =
    Boolean(selectedTripId) &&
    (stats.hasOverdueActivities || stats.isBudgetWarning || stats.isBudgetCritical)
  const selectedTripValue = selectedTripId ? String(selectedTripId) : ''

  const handleTripChange = (event: SelectChangeEvent) => {
    const nextTripId = Number(event.target.value)

    if (!Number.isInteger(nextTripId) || nextTripId <= 0) {
      return
    }

    navigate(
      buildSameSectionTripPath(nextTripId, location.pathname, location.search),
    )
  }

  const signOut = () => {
    clearAccessToken()
    navigate(routePaths.login, { replace: true })
  }

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
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
          display: 'grid',
          gridTemplateColumns: {
            xs: 'auto minmax(0, 1fr) auto',
            md: '256px minmax(0, 1fr) 256px',
          },
          alignItems: 'center',
          minHeight: 64,
          width: '100%',
          px: { xs: 1.5, md: 0 },
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'center' },
            minWidth: 0,
          }}
        >
          <Button
            variant="text"
            onClick={() => navigate(buildTripsPath())}
            sx={{ minWidth: 'auto', px: 0 }}
          >
            Trips
          </Button>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        >
          <FormControl size="small" sx={{ minWidth: { xs: 180, sm: 280 } }}>
            <Select
              inputProps={{ 'aria-label': 'Select trip' }}
              value={selectedTripValue}
              onChange={handleTripChange}
              displayEmpty
              renderValue={(value) => {
                const trip = tripOptions.find(
                  (candidate) => String(candidate.id) === value,
                )

                return (
                  <Typography
                    component="span"
                    color={trip || selectedTrip ? 'text.primary' : 'text.secondary'}
                  >
                    {trip?.name ?? selectedTrip?.name ?? 'Select trip'}
                  </Typography>
                )
              }}
            >
              {tripOptions.length === 0 ? (
                <MenuItem disabled value="">
                  No trips yet
                </MenuItem>
              ) : null}
              {tripOptions.map((trip) => (
                <MenuItem key={trip.id} value={String(trip.id)}>
                  {trip.name ?? `Trip #${trip.id}`}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem
                value={MANAGE_TRIPS_VALUE}
                onClick={() => navigate(buildTripsPath())}
                sx={{
                  mt: 0.5,
                  fontWeight: 700,
                  color: 'primary.main',
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'rgba(18, 132, 248, 0.08)' },
                }}
              >
                Manage trips
              </MenuItem>
            </Select>
          </FormControl>

          {selectedTrip ? (
            <Box sx={{ display: { xs: 'none', lg: 'block' }, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                {selectedTrip.name}
              </Typography>
              {selectedTrip.startDate ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}
                  noWrap
                >
                  <CalendarMonthOutlinedIcon sx={{ fontSize: 14 }} />
                  {formatDate(selectedTrip.startDate)} -{' '}
                  {formatDate(selectedTrip.endDate)}
                </Typography>
              ) : null}
            </Box>
          ) : null}
        </Stack>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'flex-end', md: 'center' },
          }}
        >
          <IconButton
            aria-label="Account menu"
            onClick={(event) => setAccountAnchor(event.currentTarget)}
          >
            {currentUser?.avatarUrl ? (
              <Avatar
                src={currentUser.avatarUrl}
                alt={currentUser.fullName ?? currentUser.username ?? 'User'}
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
                {getInitials(currentUser?.fullName ?? currentUser?.username)}
              </Avatar>
            )}
          </IconButton>
          <Menu
            anchorEl={accountAnchor}
            open={Boolean(accountAnchor)}
            onClose={() => setAccountAnchor(null)}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {currentUser?.fullName ?? currentUser?.username ?? 'Account'}
                </Typography>
                {currentUser?.email ? (
                  <Typography variant="caption" color="text.secondary">
                    {currentUser.email}
                  </Typography>
                ) : null}
              </Box>
            </MenuItem>
            <MenuItem onClick={() => navigate(routePaths.profile)}>
              View Profile
            </MenuItem>
            <MenuItem onClick={signOut}>Sign out</MenuItem>
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
                : `${stats.overdueActivities} overdue ${
                    stats.overdueActivities === 1 ? 'activity' : 'activities'
                  } detected.`}
          </AlertTitle>
        </Alert>
      ) : null}
    </Box>
  )
}
