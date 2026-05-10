import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AuthForm } from './auth-form'

describe('AuthForm', () => {
  it('shows validation errors for an empty login submit', async () => {
    const user = userEvent.setup()

    render(<AuthForm mode="login" onSubmit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Username is required')).toBeVisible()
    expect(screen.getByText('Password is required')).toBeVisible()
  })

  it('submits entered login credentials', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<AuthForm mode="login" onSubmit={onSubmit} />)
    await user.type(screen.getByLabelText('Username'), 'demo')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toEqual({
      username: 'demo',
      password: 'password123',
    })
  })
})
