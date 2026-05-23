import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { LoginPage, RecoverPasswordPage, SignUpPage } from '@/features/auth'
import { ItineraryPage, TripDashboardPage } from '@/features/itineraries'
import { DashboardPage } from '@/pages'
import { hasValidAccessToken } from '@/shared'
import { ProtectedRoute } from './ProtectedRoute'
import { routePaths } from './routePaths'
import { parseTripIdParam, type TripRouteParams } from './trip-route-params'

const TripDashboardRoute = () => {
  const { tripId } = useParams<TripRouteParams>()
  const parsedTripId = parseTripIdParam(tripId)

  if (parsedTripId == null) {
    return <Navigate to={routePaths.dashboard} replace />
  }

  return <TripDashboardPage tripId={parsedTripId} />
}

const TripItineraryRoute = () => {
  const { tripId } = useParams<TripRouteParams>()
  const parsedTripId = parseTripIdParam(tripId)

  if (parsedTripId == null) {
    return <Navigate to={routePaths.dashboard} replace />
  }

  return <ItineraryPage tripId={parsedTripId} />
}

const AuthRedirect = () => {
  return (
    <Navigate
      to={hasValidAccessToken() ? routePaths.dashboard : routePaths.login}
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
        <Route path={routePaths.dashboard} element={<DashboardPage />} />
        <Route path={routePaths.tripDashboard} element={<TripDashboardRoute />} />
        <Route path={routePaths.tripItinerary} element={<TripItineraryRoute />} />
      </Route>
      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  )
}
