import { zodResolver } from '@hookform/resolvers/zod'
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
  hasSubmitError?: boolean
  onClose: () => void
  onSubmit: (values: PackingFormValues) => void
}

export const PackingForm = ({
  item,
  isPending = false,
  hasSubmitError = false,
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
    <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)}>
      <label className="field">
        <span>Item name</span>
        <input type="text" {...form.register('name')} />
        <FieldError message={form.formState.errors.name?.message} />
      </label>

      <label className="field">
        <span>Quantity</span>
        <input
          inputMode="numeric"
          min="0"
          type="number"
          {...form.register('quantity', { valueAsNumber: true })}
        />
        <FieldError message={form.formState.errors.quantity?.message} />
      </label>

      <div className="form-grid form-grid--three">
        <label className="field">
          <span>Category</span>
          <select {...form.register('category')}>
            {packingCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Required status</span>
          <select {...form.register('requiredStatus')}>
            {requiredStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Packed status</span>
          <select {...form.register('packedStatus')}>
            {packedStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {hasSubmitError ? (
        <p className="form-error" role="alert">
          Packing item could not be saved. Please retry.
        </p>
      ) : null}

      <div className="form-actions">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'Saving...' : item ? 'Save item' : 'Add item'}
        </Button>
      </div>
    </form>
  )
}
