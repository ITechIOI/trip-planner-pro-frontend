import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setAccessToken } from '@/shared'
import { ACCESS_TOKEN } from '../../../../tests/shared/mock-api'
import { getMockApiState } from '../../../../tests/msw/handlers'
import { renderWithProviders } from '../../../../tests/vitest/render'
import { ProfilePage } from './profile-page'

describe('ProfilePage', () => {
  it('updates profile fields before uploading a selected avatar', async () => {
    setAccessToken(ACCESS_TOKEN)
    const { user } = renderWithProviders(<ProfilePage />, { route: '/profile' })

    await screen.findByLabelText('Full name')
    await user.clear(screen.getByLabelText('Full name'))
    await user.type(screen.getByLabelText('Full name'), 'Demo Family Planner')
    await user.upload(
      screen.getByLabelText('Choose avatar image'),
      new File(['avatar'], 'avatar.png', { type: 'image/png' }),
    )
    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    await waitFor(() => {
      expect(getMockApiState().requests.userRequestOrder).toEqual([
        'profile',
        'avatar',
      ])
    })
    expect(getMockApiState().requests.userProfileUpdateBodies[0]).toMatchObject({
      fullName: 'Demo Family Planner',
    })
    expect(getMockApiState().requests.userProfileUpdateBodies[0]).not.toHaveProperty(
      'avatarUrl',
    )
    expect(getMockApiState().requests.userAvatarUploads[0]).toMatchObject({
      avatarUrl: 'https://cdn.example.test/avatar.png',
    })
  })
})
