import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { TripResponse } from '@/shared'
import { Button, FieldError } from '@/shared/components/ui'
import { toDateInputValue } from '@/shared/lib/display'
import {
  type TripFormValues,
  tripSchema,
} from '@/features/trips/lib/trip-schema'

type TripFormProps = {
  trip?: TripResponse
  isPending?: boolean
  hasSubmitError?: boolean
  onClose: () => void
  onSubmit: (values: TripFormValues) => void
}

export const TripForm = ({
  trip,
  isPending = false,
  hasSubmitError = false,
  onClose,
  onSubmit,
}: TripFormProps) => {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: trip?.name ?? '',
      estimatedBudget: trip?.estimatedBudget ?? 0,
      startDate: toDateInputValue(trip?.startDate),
      endDate: toDateInputValue(trip?.endDate),
    },
  })

  useEffect(() => {
    form.reset({
      name: trip?.name ?? '',
      estimatedBudget: trip?.estimatedBudget ?? 0,
      startDate: toDateInputValue(trip?.startDate),
      endDate: toDateInputValue(trip?.endDate),
    })
  }, [form, trip])

  return (
    <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)}>
      <label className="field">
        <span>Trip name</span>
        <input type="text" {...form.register('name')} />
        <FieldError message={form.formState.errors.name?.message} />
      </label>

      <label className="field">
        <span>Initial travel budget</span>
        <input
          inputMode="numeric"
          min="0"
          type="number"
          {...form.register('estimatedBudget', { valueAsNumber: true })}
        />
        <FieldError message={form.formState.errors.estimatedBudget?.message} />
      </label>

      <div className="form-grid">
        <label className="field">
          <span>Start date</span>
          <input type="date" {...form.register('startDate')} />
        </label>
        <label className="field">
          <span>End date</span>
          <input type="date" {...form.register('endDate')} />
        </label>
      </div>

      {hasSubmitError ? (
        <p className="form-error" role="alert">
          Trip could not be saved. Please check the fields and try again.
        </p>
      ) : null}

      <div className="form-actions">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'Saving...' : trip ? 'Save trip' : 'Create trip'}
        </Button>
      </div>
    </form>
  )
}
