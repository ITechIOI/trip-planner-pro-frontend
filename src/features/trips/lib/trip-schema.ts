import { z } from 'zod'

export const tripSchema = z.object({
  name: z.string().trim().min(1, 'Trip name is required').max(200),
  estimatedBudget: z.number().min(0, 'Budget cannot be negative'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type TripFormValues = z.infer<typeof tripSchema>

export const normalizeTripDate = (value?: string) => {
  const normalizedValue = value?.trim()

  if (!normalizedValue) {
    return null
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)
    ? `${normalizedValue}T00:00:00`
    : normalizedValue
}
