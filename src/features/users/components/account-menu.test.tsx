import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { getAccessToken, setAccessToken } from '@/shared'
import { ACCESS_TOKEN } from '../../../../tests/shared/mock-api'
import { renderWithProviders } from '../../../../tests/vitest/render'
import { AccountMenu } from './account-menu'

const renderAccountRoutes = () =>
  renderWithProviders(
    <Routes>
      <Route path="/trips" element={<AccountMenu />} />
      <Route path="/profile" element={<h1>Profile destination</h1>} />
      <Route path="/login" element={<h1>Login destination</h1>} />
    </Routes>,
    { route: '/trips' },
  )

describe('AccountMenu', () => {
  it('shows current user context and navigates to profile', async () => {
    setAccessToken(ACCESS_TOKEN)
    const { user } = renderAccountRoutes()

    await user.click(screen.getByRole('button', { name: 'Open account menu' }))

    expect(await screen.findByText('Demo Traveler')).toBeVisible()

    await user.click(screen.getByRole('menuitem', { name: 'Profile' }))

    expect(
      await screen.findByRole('heading', { name: 'Profile destination' }),
    ).toBeVisible()
  })

  it('clears auth token and query cache when signing out', async () => {
    setAccessToken(ACCESS_TOKEN)
    const { queryClient, user } = renderAccountRoutes()
    queryClient.setQueryData(['transient'], 'cached')

    await user.click(screen.getByRole('button', { name: 'Open account menu' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Sign out' }))

    await waitFor(() => expect(getAccessToken()).toBeUndefined())
    expect(queryClient.getQueryData(['transient'])).toBeUndefined()
    expect(
      await screen.findByRole('heading', { name: 'Login destination' }),
    ).toBeVisible()
  })
})
