import type { ReactElement } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getAccessToken } from '@/shared'
import { AuthPage } from '@/features/auth/pages/auth-page'
import { TripsPage } from '@/features/trips/pages/trips-page'
import { TripDashboardPage } from '@/features/trips/pages/trip-dashboard-page'
import { BudgetPage } from '@/features/budgets/pages/budget-page'
import { ItineraryPage } from '@/features/itineraries/pages/itinerary-page'
import { PackingPage } from '@/features/packing-checklists/pages/packing-page'
import { AppShell } from './app-shell'

const RequireAuth = ({ children }: { children: ReactElement }) => {
  return getAccessToken() ? children : <Navigate replace to="/login" />
}

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/trips" />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route
          path="/trips"
          element={
            <RequireAuth>
              <TripsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/trips/:tripId"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<TripDashboardPage />} />
          <Route path="itinerary" element={<ItineraryPage />} />
          <Route path="packing" element={<PackingPage />} />
          <Route path="budget" element={<BudgetPage />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/trips" />} />
      </Routes>
    </BrowserRouter>
  )
}
