import { z } from 'zod'
import { PackedStatus, PackingCategory, RequiredStatus } from '@/shared'

export const packingSchema = z.object({
  name: z.string().trim().min(1, 'Item name is required').max(200),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  category: z.enum(Object.values(PackingCategory) as [PackingCategory, ...PackingCategory[]]),
  requiredStatus: z.enum(Object.values(RequiredStatus) as [RequiredStatus, ...RequiredStatus[]]),
  packedStatus: z.enum(Object.values(PackedStatus) as [PackedStatus, ...PackedStatus[]]),
})

export type PackingFormValues = z.infer<typeof packingSchema>
