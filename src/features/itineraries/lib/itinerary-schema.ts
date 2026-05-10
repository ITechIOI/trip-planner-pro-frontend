import { z } from 'zod'
import {
  ItineraryCategory,
  ItineraryPriority,
  ItineraryStatus,
} from '@/shared'
import {
  fromDateTimeInputValue,
  isLocalDateTimeInputRangeValid,
} from '@/shared/lib/display'

export const itinerarySchema = z
  .object({
    activityTitle: z.string().trim().min(1, 'Activity title is required').max(200),
    location: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    category: z.enum(Object.values(ItineraryCategory) as [ItineraryCategory, ...ItineraryCategory[]]),
    priority: z.enum(Object.values(ItineraryPriority) as [ItineraryPriority, ...ItineraryPriority[]]),
    status: z.enum(Object.values(ItineraryStatus) as [ItineraryStatus, ...ItineraryStatus[]]),
  })
  .refine(
    (values) =>
      isLocalDateTimeInputRangeValid(values.startTime, values.endTime),
    {
      path: ['endTime'],
      message: 'End time must be after start time',
    },
  )

export type ItineraryFormValues = z.infer<typeof itinerarySchema>

export const toItineraryRequestData = (values: ItineraryFormValues) => ({
  activityTitle: values.activityTitle,
  location: values.location || null,
  startTime: fromDateTimeInputValue(values.startTime),
  endTime: fromDateTimeInputValue(values.endTime),
  category: values.category,
  priority: values.priority,
  status: values.status,
})
