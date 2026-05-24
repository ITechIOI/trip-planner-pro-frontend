export type PackingCategory =
  | 'CLOTHES'
  | 'DOCUMENTS'
  | 'ELECTRONICS'
  | 'MEDICINE'
  | 'PERSONAL'
  | 'OTHER'

export type RequiredStatus =
  | 'REQUIRED'
  | 'OPTIONAL'

export type PackedStatus =
  | 'PACKED'
  | 'NOT_PACKED'

export type PackingItem = {
  id: number
  name: string
  category: PackingCategory
  quantity: number
  requiredStatus: RequiredStatus
  packedStatus: PackedStatus
}