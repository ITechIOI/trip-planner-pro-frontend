import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Stack, TextField } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  PackedStatus,
  PackingCategory,
  RequiredStatus,
  type PackingChecklistResponse,
} from '@/shared'
import { Button, FieldError } from '@/shared/components/ui'
import {
  packedStatusOptions,
  packingCategoryOptions,
  requiredStatusOptions,
} from '@/shared/lib/domain'
import {
  type PackingFormValues,
  packingSchema,
} from '@/features/packing-checklists/lib/packing-schema'

type PackingFormProps = {
  item?: PackingChecklistResponse
  isPending?: boolean
  onClose: () => void
  onSubmit: (values: PackingFormValues) => void
}

export const PackingForm = ({
  item,
  isPending = false,
  onClose,
  onSubmit,
}: PackingFormProps) => {
  const form = useForm<PackingFormValues>({
    resolver: zodResolver(packingSchema),
    defaultValues: {
      name: item?.name ?? '',
      quantity: item?.quantity ?? 1,
      category: item?.category ?? PackingCategory.OTHER,
      requiredStatus: item?.requiredStatus ?? RequiredStatus.REQUIRED,
      packedStatus: item?.packedStatus ?? PackedStatus.NOT_PACKED,
    },
  })

  useEffect(() => {
    form.reset({
      name: item?.name ?? '',
      quantity: item?.quantity ?? 1,
      category: item?.category ?? PackingCategory.OTHER,
      requiredStatus: item?.requiredStatus ?? RequiredStatus.REQUIRED,
      packedStatus: item?.packedStatus ?? PackedStatus.NOT_PACKED,
    })
  }, [form, item])

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
        label="Item name"
        {...form.register('name')}
      />

      <TextField
        error={Boolean(form.formState.errors.quantity)}
        helperText={<FieldError message={form.formState.errors.quantity?.message} />}
        label="Quantity"
        slotProps={{ htmlInput: { inputMode: 'numeric', min: 0 } }}
        type="number"
        {...form.register('quantity', { valueAsNumber: true })}
      />

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
          {packingCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          label="Required status"
          select
          slotProps={{ select: { native: true } }}
          {...form.register('requiredStatus')}
        >
          {requiredStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          label="Packed status"
          select
          slotProps={{ select: { native: true } }}
          {...form.register('packedStatus')}
        >
          {packedStatusOptions.map((option) => (
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
          {isPending ? 'Saving...' : item ? 'Save item' : 'Add item'}
        </Button>
      </Stack>
    </Box>
  )
}
