import { useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import {
  buildTripDashboardPath,
  buildTripItineraryPath,
  routePaths,
} from '@/app/router'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined'
import { useTrip, useTripDashboard } from '@/features/trips/api/use-trip-action'
import { buildItineraryDashboardStats } from '@/features/itineraries/lib/itinerary-dashboard-stats'
import { normalizeTripFromApi } from '@/features/itineraries/api/itinerary-mappers'
import type { TripDashboardResponse, TripResponse } from '@/shared'

export type AppSidebarProps = {
  tripId: number
}

type NavItem = {
  to: string
  matchPath: string
  label: string
  icon: typeof DashboardOutlinedIcon
  showAlertBadge?: boolean
}

const buildNavItems = (tripId: number): NavItem[] => [
  {
    to: buildTripDashboardPath(tripId),
    matchPath: routePaths.tripDashboard,
    label: 'Dashboard',
    icon: DashboardOutlinedIcon,
    showAlertBadge: true,
  },
  {
    to: buildTripItineraryPath(tripId),
    matchPath: routePaths.tripItinerary,
    label: 'Itinerary',
    icon: EventNoteOutlinedIcon,
  },
  { to: '/packing', matchPath: '/packing', label: 'Packing', icon: CheckBoxOutlinedIcon },
  { to: '/budget', matchPath: '/budget', label: 'Budget', icon: AccountBalanceWalletOutlinedIcon },
]

export const AppSidebar = ({ tripId }: AppSidebarProps) => {
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const navItems = buildNavItems(tripId)

  const tripQuery = useTrip(tripId)
  const dashboardQuery = useTripDashboard(tripId)
  const trip = normalizeTripFromApi(tripQuery.data as TripResponse | undefined)
  const stats = buildItineraryDashboardStats(
    dashboardQuery.data as TripDashboardResponse | undefined,
  )

  const width = collapsed ? 72 : 256

  return (
    <Box
      component="aside"
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        width,
        height: '100vh',
        bgcolor: '#0f172a',
        color: '#e2e8f0',
        transition: 'width 0.3s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'rgba(18, 132, 248, 0.2)',
          }}
        >
          <FlightTakeoffOutlinedIcon sx={{ color: '#38bdf8' }} />
        </Box>
        {!collapsed ? (
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
              Trip Planner Pro
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(226, 232, 240, 0.7)' }} noWrap>
              {trip?.tripName}
            </Typography>
          </Box>
        ) : null}
      </Box>

      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {navItems.map((item) => {
          const isActive = Boolean(
            matchPath({ path: item.matchPath, end: true }, pathname),
          )
          const Icon = item.icon

          const link = (
            <ListItemButton
              component={Link}
              to={item.to}
              selected={isActive}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: isActive ? '#fff' : 'rgba(226, 232, 240, 0.75)',
                bgcolor: isActive ? 'primary.main' : 'transparent',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: '#fff',
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              {!collapsed ? <ListItemText primary={item.label} /> : null}
              {!collapsed &&
                item.showAlertBadge &&
                (stats.hasOverdueActivities || stats.isBudgetCritical) && (
                  <Box
                    component="span"
                    sx={{
                      ml: 'auto',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                      color: 'error.contrastText',
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    !
                  </Box>
                )}
            </ListItemButton>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.to} title={item.label} placement="right">
                {link}
              </Tooltip>
            )
          }

          return <Box key={item.to}>{link}</Box>
        })}
      </List>

      {!collapsed ? (
        <Box sx={{ mx: 1.5, mb: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)' }}>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(226, 232, 240, 0.55)', textTransform: 'uppercase' }}
          >
            Quick Stats
          </Typography>
          <StatRow label="Itinerary" value={`${stats.itineraryCompletionPercentage}%`} />
          <LinearProgress
            variant="determinate"
            value={stats.itineraryCompletionPercentage}
            sx={{ mb: 1.5, height: 6, borderRadius: 999 }}
          />
          <StatRow label="Packing" value={`${stats.packingCompletionPercentage}%`} />
          <LinearProgress
            variant="determinate"
            value={stats.packingCompletionPercentage}
            color="secondary"
            sx={{ mb: 1.5, height: 6, borderRadius: 999 }}
          />
          <StatRow
            label="Budget"
            value={`${stats.budgetUsagePercentage}%`}
            valueColor={
              stats.isBudgetCritical
                ? 'error.light'
                : stats.isBudgetWarning
                  ? 'warning.light'
                  : undefined
            }
          />
          <LinearProgress
            variant="determinate"
            value={Math.min(stats.budgetUsagePercentage, 100)}
            color={
              stats.isBudgetCritical
                ? 'error'
                : stats.isBudgetWarning
                  ? 'warning'
                  : 'primary'
            }
            sx={{ height: 6, borderRadius: 999 }}
          />
        </Box>
      ) : null}

      <IconButton
        onClick={() => setCollapsed((current) => !current)}
        sx={{
          position: 'absolute',
          right: -12,
          top: 80,
          width: 24,
          height: 24,
          bgcolor: 'primary.main',
          color: '#fff',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
        size="small"
      >
        {collapsed ? (
          <ChevronRightIcon sx={{ fontSize: 14 }} />
        ) : (
          <ChevronLeftIcon sx={{ fontSize: 14 }} />
        )}
      </IconButton>
    </Box>
  )
}

type StatRowProps = {
  label: string
  value: string
  valueColor?: string
}

const StatRow = ({ label, value, valueColor }: StatRowProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5, mb: 0.5 }}>
    <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.7)' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, color: valueColor }}>
      {value}
    </Typography>
  </Box>
)
