export const routePaths = {
  root: '/',
  login: '/login',
  signup: '/signup',
  recoverPassword: '/recover-password',
  dashboard: '/dashboard',
  tripDashboard: '/trips/:tripId/dashboard',
  tripItinerary: '/trips/:tripId/itinerary',
} as const

export const buildTripDashboardPath = (tripId: number) =>
  `/trips/${tripId}/dashboard`

export const buildTripItineraryPath = (tripId: number) =>
  `/trips/${tripId}/itinerary`
