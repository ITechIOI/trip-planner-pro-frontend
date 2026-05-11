import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import {
  CalendarCheck,
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  Plane,
  UserRound,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import type { TripPageResponse, TripResponse } from '@/shared'
import {
  getTripAccessLabel,
  getTripAccessTone,
  useTrip,
  useTripAccessMap,
  useTrips,
} from '@/features/trips'
import { AccountMenu } from '@/features/users/components/account-menu'
import {
  Button,
  ErrorState,
  IconButton,
  Skeleton,
  StatusBadge,
} from '@/shared/components/ui'
import { formatDate } from '@/shared/lib/display'
import { DEFAULT_PAGE_LIMIT } from '@/shared/lib/pagination'
import { tripPlannerColors } from './theme'
import { useRequiredTripId } from './route-helpers'
import { useUiStore } from './ui-store'

const globalNavItems = [
  {
    to: '/trips',
    label: 'Trips',
    icon: Map,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: UserRound,
  },
]

const workspaceNavItems = [
  {
    to: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: 'itinerary',
    label: 'Itinerary',
    icon: CalendarCheck,
  },
  {
    to: 'packing',
    label: 'Packing',
    icon: ListChecks,
  },
  {
    to: 'budget',
    label: 'Budget',
    icon: WalletCards,
  },
  {
    to: 'members',
    label: 'Members',
    icon: UsersRound,
  },
]

const workspaceSectionNames = new Set([
  'dashboard',
  'itinerary',
  'packing',
  'budget',
  'members',
])

const isTripWorkspacePath = (pathname: string) =>
  /^\/trips\/[^/]+(?:\/|$)/.test(pathname)

export const AppShell = () => {
  const routeTripId = useRequiredTripId()
  const navigate = useNavigate()
  const location = useLocation()
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const lastActiveTripId = useUiStore((state) => state.lastActiveTripId)
  const setLastActiveTripId = useUiStore((state) => state.setLastActiveTripId)
  const isTripWorkspace = isTripWorkspacePath(location.pathname)
  const shouldLoadTrips =
    location.pathname === '/trips' || isTripWorkspace || Boolean(lastActiveTripId)
  const tripsQuery = useTrips(
    { limit: DEFAULT_PAGE_LIMIT },
    { query: { enabled: shouldLoadTrips } },
  )
  const tripsPage = tripsQuery.data as TripPageResponse | undefined
  const trips = (tripsPage?.items ?? []) as TripResponse[]
  const firstTripId = trips[0]?.id
  const hasLoadedTrips = Boolean(tripsPage)
  const isLastActiveTripListed = lastActiveTripId
    ? trips.some((candidate) => candidate.id === lastActiveTripId)
    : false
  const usableLastActiveTripId =
    lastActiveTripId && (!hasLoadedTrips || isLastActiveTripListed)
      ? lastActiveTripId
      : undefined
  const workspaceTripId = routeTripId ?? usableLastActiveTripId ?? firstTripId
  const hasTripContext = Boolean(workspaceTripId)
  const isInvalidTripRoute = isTripWorkspace && !routeTripId
  const tripQuery = useTrip(workspaceTripId ?? 0, {
    query: { enabled: hasTripContext },
  })

  useEffect(() => {
    if (routeTripId) {
      setLastActiveTripId(routeTripId)
    }
  }, [routeTripId, setLastActiveTripId])

  useEffect(() => {
    if (routeTripId || !hasLoadedTrips) {
      return
    }

    if (!lastActiveTripId && firstTripId) {
      setLastActiveTripId(firstTripId)
      return
    }

    if (lastActiveTripId && !isLastActiveTripListed) {
      setLastActiveTripId(firstTripId)
    }
  }, [
    firstTripId,
    hasLoadedTrips,
    isLastActiveTripListed,
    lastActiveTripId,
    routeTripId,
    setLastActiveTripId,
  ])

  const handleTripChange = (event: SelectChangeEvent<string>) => {
    const nextTripId = event.target.value

    if (!nextTripId) {
      return
    }

    const parsedNextTripId = Number(nextTripId)

    if (!Number.isInteger(parsedNextTripId) || parsedNextTripId <= 0) {
      return
    }

    setLastActiveTripId(parsedNextTripId)

    if (!isTripWorkspace || nextTripId === String(workspaceTripId)) {
      return
    }

    const [, section] =
      location.pathname.match(/^\/trips\/[^/]+\/([^/?#]+)/) ?? []
    const currentSection =
      section && workspaceSectionNames.has(section) ? section : 'dashboard'
    const nextSearchParams = new URLSearchParams(location.search)
    nextSearchParams.delete('offset')

    const nextSearch = nextSearchParams.toString()
    navigate(
      `/trips/${nextTripId}/${currentSection}${nextSearch ? `?${nextSearch}` : ''}`,
    )
  }

  const trip = tripQuery.data as TripResponse | undefined
  const tripOptions = trips.some((candidate) => candidate.id === workspaceTripId)
    ? trips
    : trip
      ? [trip, ...trips]
      : trips
  const tripAccessMap = useTripAccessMap(tripOptions)
  const selectedTripValue =
    hasTripContext && tripOptions.some((candidate) => candidate.id === workspaceTripId)
      ? String(workspaceTripId)
      : ''
  const sidebarWidth = isSidebarCollapsed ? 86 : 282
  const mobileNavItems = hasTripContext
    ? workspaceNavItems.map((item) => ({
        ...item,
        to: `/trips/${workspaceTripId}/${item.to}`,
      }))
    : globalNavItems

  return (
    <Box
      className={`app-shell ${isSidebarCollapsed ? 'app-shell--collapsed' : ''}`}
      sx={{
        display: { xs: 'block', md: 'grid' },
        gridTemplateColumns: `${sidebarWidth}px minmax(0, 1fr)`,
        minHeight: '100svh',
        pb: { xs: 9, md: 0 },
      }}
    >
      <Paper
        className="sidebar"
        component="aside"
        square
        sx={{
          position: 'sticky',
          top: 0,
          display: { xs: 'none', md: 'grid' },
          gridTemplateRows: 'auto auto auto 1fr',
          gap: 2.25,
          height: '100svh',
          p: 2,
          borderRight: `1px solid ${tripPlannerColors.border}`,
          bgcolor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Stack className="brand-mark" direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <Box
            aria-hidden="true"
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 42,
              height: 42,
              borderRadius: 1.5,
              color: '#FFFFFF',
              background: `linear-gradient(135deg, ${tripPlannerColors.primary}, ${tripPlannerColors.secondary})`,
            }}
          >
            <Plane size={22} />
          </Box>
          {!isSidebarCollapsed ? (
            <Typography component="strong" sx={{ fontWeight: 900 }}>
              Trip Planner Pro
            </Typography>
          ) : null}
        </Stack>

        <IconButton
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="sidebar-toggle"
          onClick={toggleSidebar}
          sx={{ justifySelf: 'end', width: 36, height: 36 }}
          type="button"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </IconButton>

        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <List
            aria-label="Application navigation"
            component="nav"
            sx={{
              display: 'grid',
              gap: 0.75,
              p: 0,
            }}
          >
            {globalNavItems.map((item) => {
              const Icon = item.icon

              return (
                <ListItemButton
                  className="sidebar-link"
                  component={NavLink}
                  end={item.to === '/trips'}
                  key={item.to}
                  to={item.to}
                  sx={{
                    minHeight: 46,
                    borderRadius: 1,
                    color: tripPlannerColors.muted,
                    fontWeight: 800,
                    gap: 1.25,
                    px: 1.5,
                    '&.active, &:hover': {
                      color: tripPlannerColors.primaryStrong,
                      bgcolor: '#E0F2FE',
                      boxShadow: 'inset 3px 0 0 #0EA5E9',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
                    <Icon size={18} />
                  </ListItemIcon>
                  {!isSidebarCollapsed ? <ListItemText primary={item.label} /> : null}
                </ListItemButton>
              )
            })}
          </List>

          {hasTripContext ? (
            <List
              aria-label="Trip workspace"
              component="nav"
              sx={{
                display: 'grid',
                gap: 0.75,
                p: 0,
              }}
            >
              {!isSidebarCollapsed ? (
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: 0,
                    px: 1.5,
                    textTransform: 'uppercase',
                  }}
                >
                  Workspace
                </Typography>
              ) : null}
              {workspaceNavItems.map((item) => {
                const Icon = item.icon

                return (
                  <ListItemButton
                    className="sidebar-link"
                    component={NavLink}
                    key={item.to}
                    to={`/trips/${workspaceTripId}/${item.to}`}
                    sx={{
                      minHeight: 46,
                      borderRadius: 1,
                      color: tripPlannerColors.muted,
                      fontWeight: 800,
                      gap: 1.25,
                      px: 1.5,
                      '&.active, &:hover': {
                        color: tripPlannerColors.primaryStrong,
                        bgcolor: '#E0F2FE',
                        boxShadow: 'inset 3px 0 0 #0EA5E9',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
                      <Icon size={18} />
                    </ListItemIcon>
                    {!isSidebarCollapsed ? <ListItemText primary={item.label} /> : null}
                  </ListItemButton>
                )
              })}
            </List>
          ) : null}
        </Stack>
      </Paper>

      <Box className="workspace" sx={{ minWidth: 0 }}>
        <Paper
          className="topbar"
          component="header"
          square
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 1, md: 2 },
            minHeight: 72,
            px: { xs: 1.25, md: 3.5 },
            py: 1.5,
            borderBottom: `1px solid ${tripPlannerColors.border}`,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <Stack
            className="topbar__trip"
            direction="row"
            spacing={{ xs: 1, md: 1.5 }}
            sx={{ alignItems: 'center', flex: '1 1 auto', minWidth: 0 }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 0,
                  textTransform: 'uppercase',
                }}
              >
                {hasTripContext ? 'Current trip' : 'Workspace'}
              </Typography>
              {hasTripContext && tripQuery.isLoading ? (
                <Skeleton rows={1} />
              ) : (
                <>
                  <Typography
                    component="h2"
                    sx={{
                      mt: 0.25,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: { xs: 150, sm: 420 },
                    }}
                    variant="h2"
                  >
                    {hasTripContext ? trip?.name ?? 'Trip workspace' : 'Trip Planner Pro'}
                  </Typography>
                  <Stack
                    component="p"
                    direction="row"
                    spacing={0.75}
                    sx={{
                      alignItems: 'center',
                      color: 'text.secondary',
                      display: { xs: 'none', sm: 'flex' },
                      fontSize: 12.5,
                      fontWeight: 700,
                      m: 0,
                      mt: 0.5,
                    }}
                  >
                    <CalendarDays size={14} />
                    <Box component="span">
                      {hasTripContext
                        ? `${formatDate(trip?.startDate)} - ${formatDate(trip?.endDate)}`
                        : 'Manage trips, profile, and travel workspaces'}
                    </Box>
                  </Stack>
                </>
              )}
            </Box>
          </Stack>

          <Stack
            className="topbar__actions"
            direction="row"
            spacing={{ xs: 0.75, md: 1.5 }}
            sx={{
              alignItems: 'center',
              flex: '0 0 auto',
              minWidth: 0,
            }}
          >
            {hasTripContext ? (
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: 132, sm: 220 },
                  maxWidth: { xs: 142, sm: 280 },
                }}
              >
                <InputLabel id="trip-switcher-label">Switch trip</InputLabel>
                <Select
                  id="trip-switcher"
                  label="Switch trip"
                  labelId="trip-switcher-label"
                  onChange={handleTripChange}
                  renderValue={(selectedTripId) =>
                    tripOptions.find((candidate) => String(candidate.id) === selectedTripId)
                      ?.name ?? 'Trip workspace'
                  }
                  sx={{
                    '& .MuiSelect-select': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                  value={selectedTripValue}
                >
                  {!selectedTripValue ? (
                    <MenuItem disabled value="">
                      Loading trips
                    </MenuItem>
                  ) : null}
                  {tripOptions.map((trip) => (
                    <MenuItem key={trip.id} value={String(trip.id)}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minWidth: 0,
                          width: '100%',
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {trip.name}
                        </Box>
                        <StatusBadge
                          tone={getTripAccessTone(
                            trip.id
                              ? tripAccessMap.accessByTripId[trip.id]?.role ?? null
                              : null,
                          )}
                        >
                          {getTripAccessLabel(
                            trip.id
                              ? tripAccessMap.accessByTripId[trip.id]?.role ?? null
                              : null,
                          )}
                        </StatusBadge>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <AccountMenu />
          </Stack>
        </Paper>

        <Box
          className="workspace__content"
          component="main"
          sx={{
            height: {
              xs: 'calc(100svh - 72px - 92px - env(safe-area-inset-bottom))',
              md: 'auto',
            },
            overflowY: { xs: 'auto', md: 'visible' },
            overscrollBehavior: { xs: 'contain', md: 'auto' },
            width: 'min(1280px, 100%)',
            mx: 'auto',
            p: {
              xs: '18px 14px',
              md: 3.5,
            },
          }}
        >
          {isInvalidTripRoute ? (
            <ErrorState
              title="Invalid trip"
              description="The trip URL is missing a valid trip id."
              action={<Button onClick={() => navigate('/trips')}>Back to trips</Button>}
            />
          ) : (
            <Outlet />
          )}
        </Box>
      </Box>

      <Paper
        aria-label={hasTripContext ? 'Mobile trip workspace' : 'Mobile application navigation'}
        className="mobile-nav"
        component="nav"
        sx={{
          position: 'fixed',
          right: 10,
          bottom: 10,
          left: 10,
          zIndex: 30,
          display: { xs: 'grid', md: 'none' },
          gridTemplateColumns: `repeat(${mobileNavItems.length}, minmax(0, 1fr))`,
          gap: 0.5,
          p: 0.75,
          border: `1px solid ${tripPlannerColors.border}`,
          borderRadius: 2.25,
          bgcolor: 'rgba(255, 255, 255, 0.96)',
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
        }}
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon

          return (
            <ListItemButton
              className="mobile-nav__link"
              component={NavLink}
              key={item.to}
              to={item.to}
              sx={{
                display: 'grid',
                justifyItems: 'center',
                gap: 0.4,
                minHeight: 52,
                p: 0.75,
                borderRadius: 1.75,
                color: tripPlannerColors.muted,
                fontSize: 10.5,
                fontWeight: 800,
                '&.active': {
                  color: tripPlannerColors.primaryStrong,
                  bgcolor: '#E0F2FE',
                },
              }}
            >
              <Icon size={18} />
              <Box component="span">{item.label}</Box>
            </ListItemButton>
          )
        })}
      </Paper>
    </Box>
  )
}
