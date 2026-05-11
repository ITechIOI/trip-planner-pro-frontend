import { screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setAccessToken } from '@/shared'
import { AuthPage } from '@/features/auth/pages/auth-page'
import { BudgetPage } from '@/features/budgets/pages/budget-page'
import { ItineraryPage } from '@/features/itineraries/pages/itinerary-page'
import { PackingPage } from '@/features/packing-checklists/pages/packing-page'
import { TripMembersPage } from '@/features/trip-members/pages/trip-members-page'
import { TripDashboardPage } from '@/features/trips/pages/trip-dashboard-page'
import { TripsPage } from '@/features/trips/pages/trips-page'
import { ACCESS_TOKEN } from '../../shared/mock-api'
import { renderWithProviders } from '../render'

const authenticate = () => {
  setAccessToken(ACCESS_TOKEN)
}

const closestArticle = (element: HTMLElement) => {
  const row = element.closest('article')

  if (!(row instanceof HTMLElement)) {
    throw new Error('Expected heading to be inside an article row')
  }

  return row
}

describe('mocked application flows', () => {
  it('shows an auth boundary error for failed login', async () => {
    const { user } = renderWithProviders(<AuthPage mode="login" />, {
      route: '/login',
    })

    await user.type(screen.getByLabelText('Username'), 'wrong-user')
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Username or password is incorrect.',
    )
  })

  it('loads the trips list through MSW and React Query', async () => {
    authenticate()

    renderWithProviders(<TripsPage />, { route: '/trips' })

    expect(
      await screen.findByRole('heading', { name: 'Da Nang Family Trip' }),
    ).toBeVisible()
    expect(screen.getByRole('button', { name: /new trip/i })).toBeVisible()
  })

  it('loads dashboard metrics and timeline data through MSW', async () => {
    authenticate()

    renderWithProviders(<TripDashboardPage />, {
      route: '/trips/1/dashboard',
      routePath: '/trips/:tripId/dashboard',
    })

    expect(await screen.findByText('Itinerary complete')).toBeVisible()
    expect(screen.getByText('Flight to Da Nang')).toBeVisible()
  })

  it('blocks invalid itinerary time filters before querying', async () => {
    authenticate()
    const { user } = renderWithProviders(<ItineraryPage />, {
      route: '/trips/1/itinerary',
      routePath: '/trips/:tripId/itinerary',
    })

    await screen.findByText('Flight to Da Nang')
    await user.click(screen.getByRole('group', { name: 'Start time' }))
    await user.keyboard('08:00')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Choose a date before filtering by start or end time.',
    )
  })

  it('updates packing item status through a mocked mutation', async () => {
    authenticate()
    const { user } = renderWithProviders(<PackingPage />, {
      route: '/trips/1/packing',
      routePath: '/trips/:tripId/packing',
    })

    const passportRow = await screen.findByRole('heading', { name: 'Passport' })
    const row = closestArticle(passportRow)

    await user.click(within(row).getByRole('button', { name: 'Mark unpacked' }))

    await waitFor(() =>
      expect(within(row).getByRole('button', { name: 'Mark packed' })).toBeVisible(),
    )
  })

  it('loads budget summary and toggles payment status through MSW', async () => {
    authenticate()
    const { user } = renderWithProviders(<BudgetPage />, {
      route: '/trips/1/budget',
      routePath: '/trips/:tripId/budget',
    })

    const flightTicketsRow = await screen.findByRole('heading', {
      name: 'Flight tickets',
    })
    const row = closestArticle(flightTicketsRow)

    await user.click(within(row).getByRole('button', { name: 'Mark unpaid' }))

    await waitFor(() =>
      expect(within(row).getByRole('button', { name: 'Mark paid' })).toBeVisible(),
    )
    expect(screen.getByText('Initial budget')).toBeVisible()
  })

  it('keeps viewers read-only on resource pages', async () => {
    authenticate()

    renderWithProviders(<BudgetPage />, {
      route: '/trips/2/budget',
      routePath: '/trips/:tripId/budget',
    })

    expect(await screen.findByText('No budget items yet')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Add cost' })).not.toBeInTheDocument()
  })

  it('allows editors to manage resources but not trip members', async () => {
    authenticate()

    const { unmount } = renderWithProviders(<BudgetPage />, {
      route: '/trips/3/budget',
      routePath: '/trips/:tripId/budget',
    })

    expect(await screen.findByText('Warning hotel deposit')).toBeVisible()
    expect(await screen.findByRole('button', { name: 'Add cost' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeVisible()

    unmount()

    renderWithProviders(<TripMembersPage />, {
      route: '/trips/3/members',
      routePath: '/trips/:tripId/members',
    })

    expect(await screen.findByRole('heading', { name: 'Demo Traveler' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Add member' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Role')).not.toBeInTheDocument()
  })
})
