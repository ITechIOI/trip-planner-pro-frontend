import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import type {
  CreateItineraryMutationError,
  ItineraryResponse,
  UpdateItineraryMutationError,
} from '@/shared'
import {
  useCreateItineraryAction,
  useUpdateItineraryAction,
} from '../api/use-itinerary-action'
import {
  buildItineraryApiPayload,
  ITINERARY_CATEGORIES,
  ITINERARY_PRIORITIES,
  ITINERARY_STATUSES,
  parseIsoToFormFields,
  toItineraryEnum,
  type ItineraryFormFields,
} from '../api/itinerary-mappers'
import { getItinerariesErrorMessage } from '../lib/itineraries-error'
import {
  ItineraryCategory,
  ItineraryPriority,
  ItineraryStatus,
} from '@/shared'

type FormErrors = Partial<Record<keyof ItineraryFormFields, string>>

export type ItineraryFormProps = {
  tripId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  editItem?: ItineraryResponse | null
  defaultDate?: string
}

const emptyFormState = (defaultDate = ''): ItineraryFormFields => ({
  activityTitle: '',
  location: '',
  date: defaultDate,
  startTime: '',
  endTime: '',
  category: ItineraryCategory.SIGHTSEEING,
  priority: ItineraryPriority.MEDIUM,
  status: ItineraryStatus.PLANNED,
})

export const ItineraryForm = ({
  tripId,
  open,
  onOpenChange,
  editItem,
  defaultDate = '',
}: ItineraryFormProps) => {
  const isEditing = editItem != null
  const createMutation = useCreateItineraryAction()
  const updateMutation = useUpdateItineraryAction()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const [formData, setFormData] = useState<ItineraryFormFields>(() =>
    emptyFormState(defaultDate),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    setSubmitError(null)

    if (editItem) {
      const start = parseIsoToFormFields(editItem.startTime)
      const end = parseIsoToFormFields(editItem.endTime)

      setFormData({
        activityTitle: editItem.activityTitle ?? '',
        location: editItem.location ?? '',
        date: start.date,
        startTime: start.time,
        endTime: end.time,
        category: toItineraryEnum(
          editItem.category,
          ITINERARY_CATEGORIES,
          ItineraryCategory.SIGHTSEEING,
        ),
        priority: toItineraryEnum(
          editItem.priority,
          ITINERARY_PRIORITIES,
          ItineraryPriority.MEDIUM,
        ),
        status: toItineraryEnum(
          editItem.status,
          ITINERARY_STATUSES,
          ItineraryStatus.PLANNED,
        ),
      })
    } else {
      setFormData(emptyFormState(defaultDate))
    }

    setErrors({})
  }, [editItem, defaultDate, open])

  const validate = () => {
    const newErrors: FormErrors = {}

    if (!formData.activityTitle.trim()) {
      newErrors.activityTitle = 'Activity title is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required'
    }

    if (
      formData.endTime &&
      formData.startTime &&
      formData.endTime <= formData.startTime
    ) {
      newErrors.endTime = 'End time must be after start time'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    if (!validate()) {
      return
    }

    const payload = buildItineraryApiPayload(formData)

    try {
      if (isEditing) {
        if (editItem?.id == null) {
          setSubmitError('Itinerary id is missing.')
          return
        }

        await updateMutation.mutateAsync({
          tripId,
          itineraryId: editItem.id,
          data: payload,
        })
      } else {
        await createMutation.mutateAsync({
          tripId,
          data: payload,
        })
      }

      onOpenChange(false)
    } catch (error) {
      setSubmitError(
        getItinerariesErrorMessage(
          error as CreateItineraryMutationError | UpdateItineraryMutationError,
        ),
      )
    }
  }

  const updateTextField =
    (field: keyof ItineraryFormFields) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((current) => ({ ...current, [field]: event.target.value }))
    }

  const updateSelectField =
    (field: 'category' | 'priority' | 'status') =>
    (event: SelectChangeEvent) => {
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{isEditing ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {isEditing
              ? 'Update the details of your activity.'
              : 'Add a new activity to your itinerary.'}
          </Typography>

          {submitError && <Alert severity="error">{submitError}</Alert>}

          <TextField
            label="Activity Title"
            required
            value={formData.activityTitle}
            onChange={updateTextField('activityTitle')}
            placeholder="e.g., Visit Marble Mountains"
            error={Boolean(errors.activityTitle)}
            helperText={errors.activityTitle}
            disabled={isSubmitting}
          />

          <TextField
            label="Location"
            required
            value={formData.location}
            onChange={updateTextField('location')}
            placeholder="e.g., Marble Mountains, Ngu Hanh Son"
            error={Boolean(errors.location)}
            helperText={errors.location}
            disabled={isSubmitting}
          />

          <TextField
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={updateTextField('date')}
            error={Boolean(errors.date)}
            helperText={errors.date}
            disabled={isSubmitting}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Start Time"
              type="time"
              required
              value={formData.startTime}
              onChange={updateTextField('startTime')}
              error={Boolean(errors.startTime)}
              helperText={errors.startTime}
              disabled={isSubmitting}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={updateTextField('endTime')}
              error={Boolean(errors.endTime)}
              helperText={errors.endTime}
              disabled={isSubmitting}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={formData.category}
                onChange={updateSelectField('category')}
              >
                {ITINERARY_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel>Priority</InputLabel>
              <Select
                label="Priority"
                value={formData.priority}
                onChange={updateSelectField('priority')}
              >
                {ITINERARY_PRIORITIES.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {isEditing && (
            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={formData.status}
                onChange={updateSelectField('status')}
              >
                {ITINERARY_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Add Activity'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
