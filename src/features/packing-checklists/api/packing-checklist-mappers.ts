import {
  PackedStatus,
  PackingCategory,
  RequiredStatus,
  type PackingChecklistResponse,
} from '@/shared'
import type {
  PackedStatus as PackedStatusValue,
  PackingCategory as PackingCategoryValue,
  PackingItem,
  RequiredStatus as RequiredStatusValue,
} from '../types/packing-item'

const PACKING_CATEGORY_VALUES = new Set<string>(Object.values(PackingCategory))
const PACKED_STATUS_VALUES = new Set<string>(Object.values(PackedStatus))
const REQUIRED_STATUS_VALUES = new Set<string>(Object.values(RequiredStatus))

const isPackingCategory = (value: unknown): value is PackingCategoryValue =>
  typeof value === 'string' && PACKING_CATEGORY_VALUES.has(value)

const isPackedStatus = (value: unknown): value is PackedStatusValue =>
  typeof value === 'string' && PACKED_STATUS_VALUES.has(value)

const isRequiredStatus = (value: unknown): value is RequiredStatusValue =>
  typeof value === 'string' && REQUIRED_STATUS_VALUES.has(value)

export const normalizePackingItemFromApi = (
  item: PackingChecklistResponse,
): PackingItem | null => {
  const id = item.id
  const name = item.name?.trim()

  if (typeof id !== 'number' || !name) {
    return null
  }

  return {
    id,
    name,
    quantity: typeof item.quantity === 'number' ? item.quantity : 1,
    category: isPackingCategory(item.category)
      ? item.category
      : PackingCategory.OTHER,
    requiredStatus: isRequiredStatus(item.requiredStatus)
      ? item.requiredStatus
      : RequiredStatus.OPTIONAL,
    packedStatus: isPackedStatus(item.packedStatus)
      ? item.packedStatus
      : PackedStatus.NOT_PACKED,
  }
}
