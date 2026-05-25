import { useState, type ChangeEvent, type FormEvent } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import type { TripResponse } from '@/shared'
import {
  buildTripFormFields,
  validateTripForm,
  type TripFormErrors,
  type TripFormFields,
} from '../lib/trip-fields'

export type TripFormProps = {
  trip?: TripResponse | null
  isPending?: boolean
  submitError?: string | null
  onCancel: () => void
  onSubmit: (fields: TripFormFields) => void
}

export const TripForm = ({
  trip,
  isPending = false,
  submitError,
  onCancel,
  onSubmit,
}: TripFormProps) => {
  const [fields, setFields] = useState<TripFormFields>(() =>
    buildTripFormFields(trip),
  )
  const [errors, setErrors] = useState<TripFormErrors>({})

  const updateField =
    (field: keyof TripFormFields) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFields((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateTripForm(fields)

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit(fields)
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <TextField
          label="Trip name"
          required
          value={fields.name}
          onChange={updateField('name')}
          error={Boolean(errors.name)}
          helperText={errors.name}
          disabled={isPending}
        />

        <TextField
          label="Estimated budget"
          required
          type="number"
          value={fields.estimatedBudget}
          onChange={updateField('estimatedBudget')}
          error={Boolean(errors.estimatedBudget)}
          helperText={errors.estimatedBudget}
          disabled={isPending}
          slotProps={{ htmlInput: { min: 0, inputMode: 'numeric' } }}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          }}
        >
          <TextField
            label="Start date"
            type="date"
            value={fields.startDate}
            onChange={updateField('startDate')}
            disabled={isPending}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="End date"
            type="date"
            value={fields.endDate}
            onChange={updateField('endDate')}
            error={Boolean(errors.endDate)}
            helperText={errors.endDate}
            disabled={isPending}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'Saving...' : trip ? 'Save trip' : 'Create trip'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
