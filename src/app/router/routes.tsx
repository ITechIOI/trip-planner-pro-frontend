import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LoginPage, RecoverPasswordPage, SignUpPage } from '@/features/auth'
import {
  ItineraryPage,
  PlaceholderPage,
  TripDashboardPage,
} from '@/features/itineraries'
import { PackingChecklistsPage } from '@/features/packing-checklists'
import { TripMembersPage } from '@/features/trip-members'
import { TripsPage } from '@/features/trips'
import { DashboardPage, ProfilePage } from '@/pages'
import { hasValidAccessToken } from '@/shared'
import { AuthenticatedLayout } from '@/shared/components'
import { ProtectedRoute } from './ProtectedRoute'
import { routePaths } from './routePaths'
import { parseTripIdParam, type TripRouteParams } from './trip-route-params'

type TripRouteRendererProps = {
  children: (tripId: number) => ReactNode
}

const TripRouteRenderer = ({ children }: TripRouteRendererProps) => {
  const { tripId } = useParams<TripRouteParams>()
  const parsedTripId = parseTripIdParam(tripId)

  if (parsedTripId == null) {
    return <Navigate to={routePaths.trips} replace />
  }

  return <>{children(parsedTripId)}</>
}

const TripDashboardRoute = () => {
  return (
    <TripRouteRenderer>
      {(tripId) => <TripDashboardPage tripId={tripId} />}
    </TripRouteRenderer>
  )
}

const TripItineraryRoute = () => {
  return (
    <TripRouteRenderer>
      {(tripId) => <ItineraryPage tripId={tripId} />}
    </TripRouteRenderer>
  )
}

const TripMembersRoute = () => {
  return (
    <TripRouteRenderer>
      {(tripId) => <TripMembersPage tripId={tripId} />}
    </TripRouteRenderer>
  )
}

const TripPackingRoute = () => {
  return (
    <TripRouteRenderer>
      {(tripId) => <PackingChecklistsPage tripId={tripId} />}
    </TripRouteRenderer>
  )
}

const TripBudgetRoute = () => {
  return (
    <TripRouteRenderer>
      {(tripId) => (
        <PlaceholderPage
          tripId={tripId}
          title="Budget"
          description="Budget management will be available in this workspace."
        />
      )}
    </TripRouteRenderer>
  )
}

const AuthRedirect = () => {
  return (
    <Navigate
      to={hasValidAccessToken() ? routePaths.trips : routePaths.login}
      replace
    />
  )
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routePaths.root} element={<AuthRedirect />} />
      <Route path={routePaths.login} element={<LoginPage />} />
      <Route path={routePaths.signup} element={<SignUpPage />} />
      <Route
        path={routePaths.recoverPassword}
        element={<RecoverPasswordPage />}
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path={routePaths.dashboard} element={<DashboardPage />} />
          <Route path={routePaths.profile} element={<ProfilePage />} />
          <Route path={routePaths.trips} element={<TripsPage />} />
          <Route path={routePaths.tripDashboard} element={<TripDashboardRoute />} />
          <Route path={routePaths.tripItinerary} element={<TripItineraryRoute />} />
          <Route path={routePaths.tripMembers} element={<TripMembersRoute />} />
          <Route path={routePaths.tripPacking} element={<TripPackingRoute />} />
          <Route path={routePaths.tripBudget} element={<TripBudgetRoute />} />
        </Route>
      </Route>
      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  )
}
