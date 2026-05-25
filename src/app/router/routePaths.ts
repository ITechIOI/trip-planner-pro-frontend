export const routePaths = {
  root: '/',
  login: '/login',
  signup: '/signup',
  recoverPassword: '/recover-password',
  dashboard: '/dashboard',
  profile: '/profile',
  trips: '/trips',
  tripDashboard: '/trips/:tripId/dashboard',
  tripItinerary: '/trips/:tripId/itinerary',
  tripMembers: '/trips/:tripId/members',
  tripPacking: '/trips/:tripId/packing',
  tripBudget: '/trips/:tripId/budget',
} as const

export const buildProfilePath = () => '/profile'

export const buildTripsPath = () => '/trips'

export const buildTripDashboardPath = (tripId: number) =>
  `/trips/${tripId}/dashboard`

export const buildTripItineraryPath = (tripId: number) =>
  `/trips/${tripId}/itinerary`

export const buildTripMembersPath = (tripId: number) =>
  `/trips/${tripId}/members`

export const buildTripPackingPath = (tripId: number) =>
  `/trips/${tripId}/packing`

export const buildTripBudgetPath = (tripId: number) =>
  `/trips/${tripId}/budget`
