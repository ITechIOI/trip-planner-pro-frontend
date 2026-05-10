import { describe, expect, it } from 'vitest'
import {
  BudgetCategory,
  BudgetWarningLevel,
  PaymentStatus,
} from '@/shared'
import {
  getBudgetCategoryLabel,
  getPaymentStatusLabel,
  getWarningTone,
} from './domain'

describe('domain labels', () => {
  it('maps generated enum values to user-facing labels', () => {
    expect(getBudgetCategoryLabel(BudgetCategory.ACCOMMODATION)).toBe(
      'Accommodation',
    )
    expect(getPaymentStatusLabel(PaymentStatus.PAID)).toBe('Paid')
  })

  it('maps budget warning levels to UI tones', () => {
    expect(getWarningTone(BudgetWarningLevel.WARNING)).toBe('warning')
    expect(getWarningTone(BudgetWarningLevel.CRITICAL)).toBe('critical')
    expect(getWarningTone(BudgetWarningLevel.SAFE)).toBe('success')
  })
})
