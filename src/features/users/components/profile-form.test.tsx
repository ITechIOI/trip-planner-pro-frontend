import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { UserResponse } from '@/shared'
import { ProfileForm } from './profile-form'

const currentUser: UserResponse = {
  id: 501,
  fullName: 'Demo Traveler',
  email: 'demo@example.com',
  avatarUrl: null,
  phone: '+84901234567',
  username: 'demo',
}

describe('ProfileForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders username as read-only and submits editable profile values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ProfileForm
        currentUser={currentUser}
        isPending={false}
        onSubmit={onSubmit}
      />,
    )

    expect(screen.getByLabelText('Username')).toHaveValue('demo')
    expect(screen.getByLabelText('Username')).toHaveAttribute('readonly')

    await user.clear(screen.getByLabelText('Full name'))
    await user.type(screen.getByLabelText('Full name'), 'Demo Family Planner')
    await user.clear(screen.getByLabelText('Email'))
    await user.type(screen.getByLabelText('Email'), 'planner@example.com')
    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    expect(onSubmit.mock.calls[0][0]).toEqual({
      fullName: 'Demo Family Planner',
      email: 'planner@example.com',
      avatarAction: { type: 'keep' },
      phone: '+84901234567',
    })
  })

  it('validates optional email fields when provided', async () => {
    const user = userEvent.setup()

    render(
      <ProfileForm
        currentUser={currentUser}
        isPending={false}
        onSubmit={vi.fn()}
      />,
    )

    await user.clear(screen.getByLabelText('Email'))
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    expect(await screen.findByText('Enter a valid email address')).toBeVisible()
  })

  it('submits a selected png avatar file', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:avatar-preview'),
      revokeObjectURL: vi.fn(),
    })

    render(
      <ProfileForm
        currentUser={currentUser}
        isPending={false}
        onSubmit={onSubmit}
      />,
    )

    const avatar = new File(['avatar'], 'avatar.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('Choose avatar image'), avatar)
    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      avatarAction: { type: 'upload' },
    })
    expect(onSubmit.mock.calls[0][0].avatarAction.file).toBe(avatar)
  })

  it('shows a field error for unsupported avatar types', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ProfileForm
        currentUser={currentUser}
        isPending={false}
        onSubmit={onSubmit}
      />,
    )

    const avatar = new File(['avatar'], 'avatar.webp', { type: 'image/webp' })
    const input = screen.getByLabelText(
      'Choose avatar image',
    ) as HTMLInputElement
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [avatar],
    })
    fireEvent.change(input)
    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    expect(
      screen.getByText('Choose a PNG or JPG image for your avatar.'),
    ).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows a field error when avatar image is larger than 5MB', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ProfileForm
        currentUser={currentUser}
        isPending={false}
        onSubmit={onSubmit}
      />,
    )

    const oversizedAvatar = new File(
      [new Uint8Array(5 * 1024 * 1024 + 1)],
      'avatar.jpg',
      { type: 'image/jpeg' },
    )
    await user.upload(
      screen.getByLabelText('Choose avatar image'),
      oversizedAvatar,
    )
    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    expect(
      screen.getByText('Avatar image must be 5MB or smaller.'),
    ).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits remove avatar when the current avatar is removed', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ProfileForm
        currentUser={{
          ...currentUser,
          avatarUrl: 'https://cdn.example.test/avatar.png',
        }}
        isPending={false}
        onSubmit={onSubmit}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Remove avatar' }))
    await user.click(screen.getByRole('button', { name: 'Save profile' }))

    await waitFor(() =>
      expect(onSubmit.mock.calls[0][0]).toMatchObject({
        avatarAction: { type: 'remove' },
      }),
    )
  })
})
