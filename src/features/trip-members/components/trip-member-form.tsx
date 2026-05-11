import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { UserPlus } from 'lucide-react'
import { TripMemberRole } from '@/shared'
import { Button, FieldError } from '@/shared/components/ui'
import {
  tripMemberSchema,
  type TripMemberFormValues,
} from '../lib/trip-member-schema'

type TripMemberFormProps = {
  isPending?: boolean
  onSubmit: (values: TripMemberFormValues, onSuccess: () => void) => void
}

const roleOptions = [
  { value: TripMemberRole.VIEW, label: 'View' },
  { value: TripMemberRole.EDIT, label: 'Edit' },
]

export const TripMemberForm = ({
  isPending = false,
  onSubmit,
}: TripMemberFormProps) => {
  const form = useForm<TripMemberFormValues>({
    resolver: zodResolver(tripMemberSchema),
    defaultValues: {
      email: '',
      role: TripMemberRole.VIEW,
    },
  })

  return (
    <Stack
      className="form-stack"
      component="form"
      spacing={1.5}
      onSubmit={form.handleSubmit((values) =>
        onSubmit(values, () =>
          form.reset({ email: '', role: TripMemberRole.VIEW }),
        ),
      )}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        sx={{ alignItems: { md: 'flex-start' } }}
      >
        <TextField
          error={Boolean(form.formState.errors.email)}
          helperText={<FieldError message={form.formState.errors.email?.message} />}
          label="Member email"
          placeholder="name@example.com"
          sx={{ flex: '1 1 280px' }}
          type="email"
          {...form.register('email')}
        />
        <Controller
          control={form.control}
          name="role"
          render={({ field }) => (
            <TextField
              select
              label="Role"
              slotProps={{ select: { native: true } }}
              sx={{ flex: '0 0 180px' }}
              {...field}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          )}
        />
        <Button
          disabled={isPending}
          type="submit"
          variant="primary"
          sx={{ minHeight: 54, flex: { md: '0 0 auto' } }}
        >
          <UserPlus size={16} />
          Add member
        </Button>
      </Stack>

    </Stack>
  )
}
