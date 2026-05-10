import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  ItineraryCategory,
  ItineraryPriority,
  ItineraryStatus,
  type ItineraryResponse,
} from '@/shared'
import { Button, FieldError } from '@/shared/components/ui'
import {
  itineraryCategoryOptions,
  itineraryPriorityOptions,
  itineraryStatusOptions,
} from '@/shared/lib/domain'
import { toDateTimeInputValue } from '@/shared/lib/display'
import {
  type ItineraryFormValues,
  itinerarySchema,
} from '@/features/itineraries/lib/itinerary-schema'

type ItineraryFormProps = {
  itinerary?: ItineraryResponse
  isPending?: boolean
  hasSubmitError?: boolean
  onClose: () => void
  onSubmit: (values: ItineraryFormValues) => void
}

export const ItineraryForm = ({
  itinerary,
  isPending = false,
  hasSubmitError = false,
  onClose,
  onSubmit,
}: ItineraryFormProps) => {
  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      activityTitle: itinerary?.activityTitle ?? '',
      location: itinerary?.location ?? '',
      startTime: toDateTimeInputValue(itinerary?.startTime),
      endTime: toDateTimeInputValue(itinerary?.endTime),
      category: itinerary?.category ?? ItineraryCategory.OTHER,
      priority: itinerary?.priority ?? ItineraryPriority.MEDIUM,
      status: itinerary?.status ?? ItineraryStatus.PLANNED,
    },
  })

  useEffect(() => {
    form.reset({
      activityTitle: itinerary?.activityTitle ?? '',
      location: itinerary?.location ?? '',
      startTime: toDateTimeInputValue(itinerary?.startTime),
      endTime: toDateTimeInputValue(itinerary?.endTime),
      category: itinerary?.category ?? ItineraryCategory.OTHER,
      priority: itinerary?.priority ?? ItineraryPriority.MEDIUM,
      status: itinerary?.status ?? ItineraryStatus.PLANNED,
    })
  }, [form, itinerary])

  return (
    <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)}>
      <label className="field">
        <span>Activity title</span>
        <input type="text" {...form.register('activityTitle')} />
        <FieldError message={form.formState.errors.activityTitle?.message} />
      </label>

      <label className="field">
        <span>Location</span>
        <input type="text" {...form.register('location')} />
      </label>

      <div className="form-grid">
        <label className="field">
          <span>Start time</span>
          <input type="datetime-local" {...form.register('startTime')} />
          <FieldError message={form.formState.errors.startTime?.message} />
        </label>
        <label className="field">
          <span>End time</span>
          <input type="datetime-local" {...form.register('endTime')} />
          <FieldError message={form.formState.errors.endTime?.message} />
        </label>
      </div>

      <div className="form-grid form-grid--three">
        <label className="field">
          <span>Category</span>
          <select {...form.register('category')}>
            {itineraryCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Priority</span>
          <select {...form.register('priority')}>
            {itineraryPriorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select {...form.register('status')}>
            {itineraryStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {hasSubmitError ? (
        <p className="form-error" role="alert">
          Activity could not be saved. Please retry.
        </p>
      ) : null}

      <div className="form-actions">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'Saving...' : itinerary ? 'Save activity' : 'Add activity'}
        </Button>
      </div>
    </form>
  )
}
