import { QueryClient } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { type UserResponse } from '@/shared'
import { renderWithProviders } from '../../../../tests/vitest/render'
import { usersQueryKeys } from '../lib/users-query-keys'
import {
  useUpdateCurrentUserProfileAction,
  useUploadCurrentUserAvatarAction,
} from './use-user-action'

const ProfileMutationProbe = () => {
  const updateProfile = useUpdateCurrentUserProfileAction()

  return (
    <button
      type="button"
      onClick={() =>
        updateProfile.mutate({
          data: {
            fullName: 'Updated Traveler',
            email: 'updated@example.com',
            phone: '+84909999999',
          },
        })
      }
    >
      Save profile
    </button>
  )
}

const RemoveAvatarMutationProbe = () => {
  const updateProfile = useUpdateCurrentUserProfileAction()

  return (
    <button
      type="button"
      onClick={() =>
        updateProfile.mutate({
          data: {
            fullName: 'Updated Traveler',
            email: 'updated@example.com',
            avatarUrl: null,
            phone: '+84909999999',
          },
        })
      }
    >
      Remove avatar
    </button>
  )
}

const AvatarUploadMutationProbe = () => {
  const uploadAvatar = useUploadCurrentUserAvatarAction()

  return (
    <button
      type="button"
      onClick={() =>
        uploadAvatar.mutate({
          data: {
            file: new File(['avatar'], 'avatar.png', { type: 'image/png' }),
          },
        })
      }
    >
      Upload avatar
    </button>
  )
}

describe('useUpdateCurrentUserProfileAction', () => {
  it('preserves cached avatar when profile update omits avatarUrl', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: Infinity,
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    })
    const { user } = renderWithProviders(<ProfileMutationProbe />, {
      queryClient,
    })

    queryClient.setQueryData<UserResponse>(usersQueryKeys.current(), {
      id: 501,
      fullName: 'Demo Traveler',
      email: 'demo@example.com',
      avatarUrl: 'https://cdn.example.test/avatar.png',
      phone: null,
      username: 'demo',
    })
    queryClient.setQueryData<UserResponse>(usersQueryKeys.detail(501), {
      id: 501,
      fullName: 'Demo Traveler',
      email: 'demo@example.com',
      avatarUrl: 'https://cdn.example.test/avatar.png',
      phone: null,
      username: 'demo',
    })

    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    await waitFor(() => {
      expect(
        queryClient.getQueryData<UserResponse>(usersQueryKeys.current()),
      ).toMatchObject({
        id: 501,
        fullName: 'Updated Traveler',
        email: 'updated@example.com',
        avatarUrl: 'https://cdn.example.test/avatar.png',
      })
    })

    expect(
      queryClient.getQueryData<UserResponse>(usersQueryKeys.detail(501)),
    ).toMatchObject({
      id: 501,
      fullName: 'Updated Traveler',
      email: 'updated@example.com',
      avatarUrl: 'https://cdn.example.test/avatar.png',
    })
  })

  it('clears cached avatar when profile update sends avatarUrl null', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: Infinity,
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    })
    const { user } = renderWithProviders(<RemoveAvatarMutationProbe />, {
      queryClient,
    })

    queryClient.setQueryData<UserResponse>(usersQueryKeys.current(), {
      id: 501,
      fullName: 'Demo Traveler',
      email: 'demo@example.com',
      avatarUrl: 'https://cdn.example.test/avatar.png',
      phone: null,
      username: 'demo',
    })
    queryClient.setQueryData<UserResponse>(usersQueryKeys.detail(501), {
      id: 501,
      fullName: 'Demo Traveler',
      email: 'demo@example.com',
      avatarUrl: 'https://cdn.example.test/avatar.png',
      phone: null,
      username: 'demo',
    })

    await user.click(screen.getByRole('button', { name: 'Remove avatar' }))

    await waitFor(() => {
      expect(
        queryClient.getQueryData<UserResponse>(usersQueryKeys.current()),
      ).toMatchObject({
        id: 501,
        fullName: 'Updated Traveler',
        email: 'updated@example.com',
        avatarUrl: null,
      })
    })

    expect(
      queryClient.getQueryData<UserResponse>(usersQueryKeys.detail(501)),
    ).toMatchObject({
      id: 501,
      fullName: 'Updated Traveler',
      email: 'updated@example.com',
      avatarUrl: null,
    })
  })

  it('sets current-user and user-by-id caches from the uploaded avatar response', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: Infinity,
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    })
    const { user } = renderWithProviders(<AvatarUploadMutationProbe />, {
      queryClient,
    })

    queryClient.setQueryData<UserResponse>(usersQueryKeys.detail(501), {
      id: 501,
      fullName: 'Demo Traveler',
      email: 'demo@example.com',
      avatarUrl: null,
      phone: null,
      username: 'demo',
    })

    await user.click(screen.getByRole('button', { name: 'Upload avatar' }))

    await waitFor(() => {
      expect(
        queryClient.getQueryData<UserResponse>(usersQueryKeys.current()),
      ).toMatchObject({
        id: 501,
        avatarUrl: 'https://cdn.example.test/avatar.png',
      })
    })

    expect(
      queryClient.getQueryData<UserResponse>(usersQueryKeys.detail(501)),
    ).toMatchObject({
      id: 501,
      avatarUrl: 'https://cdn.example.test/avatar.png',
    })
  })
})
