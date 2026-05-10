import { describe, expect, it } from 'vitest'
import { BudgetCategory, PaymentStatus } from '@/shared'
import { budgetSchema, toBudgetRequestData } from './budget-schema'

describe('budget schema', () => {
  it('requires actual cost when a budget item is marked paid', () => {
    const result = budgetSchema.safeParse({
      itemName: 'Hotel',
      category: BudgetCategory.ACCOMMODATION,
      estimatedCost: 1_000_000,
      paymentStatus: PaymentStatus.PAID,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      'Actual cost is required when payment status is Paid',
    )
  })

  it('normalizes missing actual cost to null for API requests', () => {
    expect(
      toBudgetRequestData({
        itemName: 'Hotel',
        category: BudgetCategory.ACCOMMODATION,
        estimatedCost: 1_000_000,
        actualCost: undefined,
        paymentStatus: PaymentStatus.UNPAID,
      }),
    ).toMatchObject({
      actualCost: null,
      paymentStatus: PaymentStatus.UNPAID,
    })
  })
})
