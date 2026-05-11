import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Stack, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
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

const toPickerDateTime = (value?: string) => (value ? dayjs(value) : null)

const fromPickerDateTime = (value: Dayjs | null) =>
  value?.isValid() ? value.format('YYYY-MM-DDTHH:mm') : ''

type ItineraryFormProps = {
  itinerary?: ItineraryResponse
  isPending?: boolean
  onClose: () => void
  onSubmit: (values: ItineraryFormValues) => void
}

export const ItineraryForm = ({
  itinerary,
  isPending = false,
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
    <Box
      className="form-stack"
      component="form"
      onSubmit={form.handleSubmit(onSubmit)}
      sx={{ display: 'grid', gap: 2 }}
    >
      <TextField
        error={Boolean(form.formState.errors.activityTitle)}
        helperText={<FieldError message={form.formState.errors.activityTitle?.message} />}
        label="Activity title"
        {...form.register('activityTitle')}
      />

      <TextField label="Location" {...form.register('location')} />

      <Box
        className="form-grid"
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <Controller
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <DateTimePicker
              ampm={false}
              format="YYYY-MM-DD HH:mm"
              label="Start time"
              onChange={(value) => field.onChange(fromPickerDateTime(value))}
              slotProps={{
                textField: {
                  error: Boolean(form.formState.errors.startTime),
                  fullWidth: true,
                  helperText: <FieldError message={form.formState.errors.startTime?.message} />,
                  inputRef: field.ref,
                  onBlur: field.onBlur,
                },
              }}
              value={toPickerDateTime(field.value)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <DateTimePicker
              ampm={false}
              format="YYYY-MM-DD HH:mm"
              label="End time"
              onChange={(value) => field.onChange(fromPickerDateTime(value))}
              slotProps={{
                textField: {
                  error: Boolean(form.formState.errors.endTime),
                  fullWidth: true,
                  helperText: <FieldError message={form.formState.errors.endTime?.message} />,
                  inputRef: field.ref,
                  onBlur: field.onBlur,
                },
              }}
              value={toPickerDateTime(field.value)}
            />
          )}
        />
      </Box>

      <Box
        className="form-grid form-grid--three"
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        <TextField
          label="Category"
          select
          slotProps={{ select: { native: true } }}
          {...form.register('category')}
        >
          {itineraryCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          label="Priority"
          select
          slotProps={{ select: { native: true } }}
          {...form.register('priority')}
        >
          {itineraryPriorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          label="Status"
          select
          slotProps={{ select: { native: true } }}
          {...form.register('status')}
        >
          {itineraryStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Box>

      <Stack className="form-actions" direction="row" spacing={1.25} sx={{ justifyContent: 'flex-end', pt: 1 }}>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'Saving...' : itinerary ? 'Save activity' : 'Add activity'}
        </Button>
      </Stack>
    </Box>
  )
}
