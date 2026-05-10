import { z } from 'zod'

export const tripSchema = z.object({
  name: z.string().trim().min(1, 'Trip name is required').max(200),
  estimatedBudget: z.number().min(0, 'Budget cannot be negative'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type TripFormValues = z.infer<typeof tripSchema>

export const normalizeTripDate = (value?: string) => (value ? value : null)
