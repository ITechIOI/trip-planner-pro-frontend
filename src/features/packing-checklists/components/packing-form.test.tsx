import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  PackedStatus,
  PackingCategory,
  RequiredStatus,
} from '@/shared'
import { PackingForm } from './packing-form'

describe('PackingForm', () => {
  it('submits a valid packing item payload', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<PackingForm onClose={vi.fn()} onSubmit={onSubmit} />)
    await user.type(screen.getByLabelText('Item name'), 'Passport')
    await user.clear(screen.getByLabelText('Quantity'))
    await user.type(screen.getByLabelText('Quantity'), '2')
    await user.selectOptions(screen.getByLabelText('Category'), PackingCategory.DOCUMENTS)
    await user.selectOptions(
      screen.getByLabelText('Required status'),
      RequiredStatus.REQUIRED,
    )
    await user.selectOptions(
      screen.getByLabelText('Packed status'),
      PackedStatus.NOT_PACKED,
    )
    await user.click(screen.getByRole('button', { name: 'Add item' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toEqual({
      name: 'Passport',
      quantity: 2,
      category: PackingCategory.DOCUMENTS,
      requiredStatus: RequiredStatus.REQUIRED,
      packedStatus: PackedStatus.NOT_PACKED,
    })
  })
})
