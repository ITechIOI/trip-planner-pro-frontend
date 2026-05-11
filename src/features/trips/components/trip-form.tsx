import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Stack, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { TripResponse } from '@/shared'
import { Button, FieldError } from '@/shared/components/ui'
import { toDateInputValue } from '@/shared/lib/display'
import {
  type TripFormValues,
  tripSchema,
} from '@/features/trips/lib/trip-schema'

const toPickerDate = (value?: string) => (value ? dayjs(value) : null)

const fromPickerDate = (value: Dayjs | null) =>
  value?.isValid() ? value.format('YYYY-MM-DD') : ''

type TripFormProps = {
  trip?: TripResponse
  isPending?: boolean
  onClose: () => void
  onSubmit: (values: TripFormValues) => void
}

export const TripForm = ({
  trip,
  isPending = false,
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
    <Box
      className="form-stack"
      component="form"
      onSubmit={form.handleSubmit(onSubmit)}
      sx={{ display: 'grid', gap: 2 }}
    >
      <TextField
        error={Boolean(form.formState.errors.name)}
        helperText={<FieldError message={form.formState.errors.name?.message} />}
        label="Trip name"
        {...form.register('name')}
      />

      <TextField
        error={Boolean(form.formState.errors.estimatedBudget)}
        helperText={<FieldError message={form.formState.errors.estimatedBudget?.message} />}
        label="Initial travel budget"
        slotProps={{ htmlInput: { inputMode: 'numeric', min: 0 } }}
        type="number"
        {...form.register('estimatedBudget', { valueAsNumber: true })}
      />

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
          name="startDate"
          render={({ field }) => (
            <DatePicker
              format="YYYY-MM-DD"
              label="Start date"
              onChange={(value) => field.onChange(fromPickerDate(value))}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputRef: field.ref,
                  onBlur: field.onBlur,
                },
              }}
              value={toPickerDate(field.value)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <DatePicker
              format="YYYY-MM-DD"
              label="End date"
              onChange={(value) => field.onChange(fromPickerDate(value))}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputRef: field.ref,
                  onBlur: field.onBlur,
                },
              }}
              value={toPickerDate(field.value)}
            />
          )}
        />
      </Box>

      <Stack className="form-actions" direction="row" spacing={1.25} sx={{ justifyContent: 'flex-end', pt: 1 }}>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'Saving...' : trip ? 'Save trip' : 'Create trip'}
        </Button>
      </Stack>
    </Box>
  )
}
