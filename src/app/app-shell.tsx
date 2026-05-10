import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  CalendarCheck,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plane,
  WalletCards,
} from 'lucide-react'
import { clearAccessToken } from '@/shared'
import type { TripPageResponse, TripResponse } from '@/shared'
import { useTrip, useTrips } from '@/features/trips'
import { Button, ErrorState, IconButton, Skeleton } from '@/shared/components/ui'
import { DEFAULT_PAGE_LIMIT } from '@/shared/lib/pagination'
import { useRequiredTripId } from './route-helpers'
import { useUiStore } from './ui-store'

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
]

export const AppShell = () => {
  const tripId = useRequiredTripId()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const tripQuery = useTrip(tripId ?? 0)
  const tripsQuery = useTrips({ limit: DEFAULT_PAGE_LIMIT })

  if (!tripId) {
    return (
      <main className="standalone-page">
        <ErrorState
          title="Invalid trip"
          description="The trip URL is missing a valid trip id."
          action={<Button onClick={() => navigate('/trips')}>Back to trips</Button>}
        />
      </main>
    )
  }

  const handleTripChange = (nextTripId: string) => {
    if (nextTripId) {
      navigate(`/trips/${nextTripId}/dashboard`)
    }
  }

  const handleSignOut = () => {
    clearAccessToken()
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  const trip = tripQuery.data as TripResponse | undefined
  const tripsPage = tripsQuery.data as TripPageResponse | undefined
  const trips = (tripsPage?.items ?? []) as TripResponse[]

  return (
    <div
      className={`app-shell ${
        isSidebarCollapsed ? 'app-shell--collapsed' : ''
      }`}
    >
      <aside className="sidebar">
        <div className="brand-mark">
          <span aria-hidden="true">
            <Plane size={22} />
          </span>
          <strong>Trip Planner Pro</strong>
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>

        <nav aria-label="Trip workspace">
          {workspaceNavItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink className="sidebar-link" key={item.to} to={item.to}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <Button
          type="button"
          className="sidebar__trips-link"
          onClick={() => navigate('/trips')}
        >
          All trips
        </Button>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar__trip">
            <IconButton
              type="button"
              className="topbar__menu"
              aria-label="Open navigation"
              onClick={toggleSidebar}
            >
              <Menu size={18} />
            </IconButton>
            <div>
              <span>Current trip</span>
              {tripQuery.isLoading ? (
                <Skeleton rows={1} />
              ) : (
                <h2>{trip?.name ?? 'Trip workspace'}</h2>
              )}
            </div>
          </div>

          <div className="topbar__actions">
            <label className="sr-only" htmlFor="trip-switcher">
              Switch trip
            </label>
            <select
              id="trip-switcher"
              value={String(tripId)}
              onChange={(event) => handleTripChange(event.target.value)}
            >
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
            <Button type="button" variant="ghost" onClick={handleSignOut}>
              <LogOut size={16} />
              Sign out
            </Button>
          </div>
        </header>

        <main className="workspace__content">
          <Outlet />
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Mobile trip workspace">
        {workspaceNavItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink className="mobile-nav__link" key={item.to} to={item.to}>
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
