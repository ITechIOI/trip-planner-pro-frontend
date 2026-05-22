import { useState, useEffect } from 'react'
import { useTrip } from '@/lib/trip-context'
import {
  parseIsoToFormFields,
  toItineraryEnum,
  ITINERARY_CATEGORIES,
  ITINERARY_PRIORITIES,
  ITINERARY_STATUSES,
} from '@/lib/itinerary-mappers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const categories = ITINERARY_CATEGORIES
const priorities = ITINERARY_PRIORITIES
const statuses = ITINERARY_STATUSES

export function ItineraryForm({ open, onOpenChange, editItem }) {
  const {
    state,
    addActivity,
    updateActivity,
    itineraryLoading,
    itineraryError,
    clearItineraryError,
  } = useTrip()
  const isEditing = !!editItem

  const [formData, setFormData] = useState({
    activityTitle: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    category: 'SIGHTSEEING',
    priority: 'MEDIUM',
    status: 'PLANNED',
  })

  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!open) return

    clearItineraryError()
    setSubmitError(null)

    if (editItem) {
      const start = parseIsoToFormFields(editItem.startTime)
      const end = parseIsoToFormFields(editItem.endTime)
      setFormData({
        activityTitle: editItem.activityTitle || '',
        location: editItem.location || '',
        date: start.date,
        startTime: start.time,
        endTime: end.time,
        category: toItineraryEnum(
          editItem.category,
          categories,
          'SIGHTSEEING',
        ),
        priority: toItineraryEnum(editItem.priority, priorities, 'MEDIUM'),
        status: toItineraryEnum(editItem.status, statuses, 'PLANNED'),
      })
    } else {
      setFormData({
        activityTitle: '',
        location: '',
        date: state.trip.startDate || '',
        startTime: '',
        endTime: '',
        category: 'SIGHTSEEING',
        priority: 'MEDIUM',
        status: 'PLANNED',
      })
    }
    setErrors({})
  }, [editItem, state.trip.startDate, open, clearItineraryError])

  const validate = () => {
    const newErrors = {}

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validate()) return

    const result = isEditing
      ? await updateActivity(editItem.id, formData)
      : await addActivity(formData)

    if (result.success) {
      onOpenChange(false)
    } else {
      setSubmitError(result.error)
    }
  }

  const displayError = submitError || itineraryError

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Activity' : 'Add New Activity'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details of your activity.'
              : 'Add a new activity to your itinerary.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {displayError}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="activityTitle">Activity Title *</Label>
            <Input
              id="activityTitle"
              value={formData.activityTitle}
              onChange={(e) =>
                setFormData({ ...formData, activityTitle: e.target.value })
              }
              placeholder="e.g., Visit Marble Mountains"
              className={cn(errors.activityTitle && 'border-destructive')}
              disabled={itineraryLoading}
            />
            {errors.activityTitle && (
              <p className="text-sm text-destructive">{errors.activityTitle}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., Marble Mountains, Ngu Hanh Son"
              className={cn(errors.location && 'border-destructive')}
              disabled={itineraryLoading}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className={cn(errors.date && 'border-destructive')}
                disabled={itineraryLoading}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className={cn(errors.startTime && 'border-destructive')}
                  disabled={itineraryLoading}
                />
                {errors.startTime && (
                  <p className="text-sm text-destructive">{errors.startTime}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className={cn(errors.endTime && 'border-destructive')}
                  disabled={itineraryLoading}
                />
                {errors.endTime && (
                  <p className="text-sm text-destructive">{errors.endTime}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                disabled={itineraryLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
                disabled={itineraryLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((pri) => (
                    <SelectItem key={pri} value={pri}>
                      {pri}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={itineraryLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={itineraryLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={itineraryLoading}>
              {itineraryLoading
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Add Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
