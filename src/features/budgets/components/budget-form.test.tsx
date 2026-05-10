import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PaymentStatus } from '@/shared'
import { BudgetForm } from './budget-form'

describe('BudgetForm', () => {
  it('requires actual cost when payment status is paid', async () => {
    const user = userEvent.setup()

    render(<BudgetForm onClose={vi.fn()} onSubmit={vi.fn()} />)
    await user.type(screen.getByLabelText('Item name'), 'Hotel')
    await user.clear(screen.getByLabelText('Estimated cost'))
    await user.type(screen.getByLabelText('Estimated cost'), '1000000')
    await user.selectOptions(
      screen.getByLabelText('Payment status'),
      PaymentStatus.PAID,
    )
    await user.click(screen.getByRole('button', { name: 'Add cost' }))

    expect(
      await screen.findByText(
        'Actual cost is required when payment status is Paid',
      ),
    ).toBeVisible()
  })
})
