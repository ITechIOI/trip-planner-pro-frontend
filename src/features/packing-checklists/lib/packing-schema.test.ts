import { describe, expect, it } from 'vitest'
import {
  PackedStatus,
  PackingCategory,
  RequiredStatus,
} from '@/shared'
import { packingSchema } from './packing-schema'

describe('packing schema', () => {
  it('rejects missing item name and negative quantity', () => {
    const result = packingSchema.safeParse({
      name: '',
      quantity: -1,
      category: PackingCategory.OTHER,
      requiredStatus: RequiredStatus.REQUIRED,
      packedStatus: PackedStatus.NOT_PACKED,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Item name is required',
      'Quantity cannot be negative',
    ])
  })

  it('accepts a valid packing item payload', () => {
    expect(
      packingSchema.safeParse({
        name: 'Passport',
        quantity: 1,
        category: PackingCategory.DOCUMENTS,
        requiredStatus: RequiredStatus.REQUIRED,
        packedStatus: PackedStatus.PACKED,
      }).success,
    ).toBe(true)
  })
})
