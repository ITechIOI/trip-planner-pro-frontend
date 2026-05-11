import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../tests/vitest/render'
import { TripForm } from './trip-form'

describe('TripForm', () => {
  it('validates required name before submit', async () => {
    const user = userEvent.setup()

    renderWithProviders(<TripForm onClose={vi.fn()} onSubmit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Create trip' }))

    expect(await screen.findByText('Trip name is required')).toBeVisible()
  })

  it('submits a valid trip payload', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithProviders(<TripForm onClose={vi.fn()} onSubmit={onSubmit} />)
    await user.type(screen.getByLabelText('Trip name'), 'Da Nang')
    await user.clear(screen.getByLabelText('Initial travel budget'))
    await user.type(screen.getByLabelText('Initial travel budget'), '10000000')
    await user.click(screen.getByRole('button', { name: 'Create trip' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      name: 'Da Nang',
      estimatedBudget: 10_000_000,
    })
  })
})
