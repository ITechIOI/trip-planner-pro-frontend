import { useState, useEffect } from 'react'
import { useTrip } from '@/lib/local-trip-context'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';


const categories = ['TRANSPORT', 'FOOD', 'SIGHTSEEING', 'SHOPPING', 'HOTEL', 'OTHER']
const priorities = ['LOW', 'MEDIUM', 'HIGH']
const statuses = ['PLANNED', 'IN_PROGRESS', 'DONE']

export function ItineraryForm({ open, onOpenChange, editItem }) {
  const { state, dispatch } = useTrip();
  const isEditing = !!editItem;
  
  const [formData, setFormData] = useState({
    activityTitle: '',
    location: '',
    startTime: '',
    endTime: '',
    category: 'SIGHTSEEING',
    priority: 'MEDIUM',
    status: 'PLANNED'
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (editItem) {
      const [savedDate, savedTime] = editItem.startTime 
      ? editItem.startTime.split('T') 
      : ['', ''];
      const [savedEndDate, savedEndTime] = editItem.endTime 
      ? editItem.endTime.split('T') 
      : ['', ''];
      setFormData({
        activityTitle: editItem.activityTitle,
        location: editItem.location,
        startTime: editItem.startTime,
        endTime: editItem.endTime,
        category: editItem.category,
        priority: editItem.priority,
        status: editItem.status
      });
    } else {
      setFormData({
        activityTitle: '',
        location: '',
        startTime: state.trip.startDate || '',
        endTime: state.trip.endDate || '',
        category: 'SIGHTSEEING',
        priority: 'MEDIUM',
        status: 'PLANNED'
      });
    }
    setErrors({});
  }, [editItem, state.trip.startDate, open]);
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.activityTitle.trim()) {
      newErrors.activityTitle = 'Activity title is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const isoStartTime = new Date(`${formData.date}T${formData.startTime}:00`).toISOString();
    const isoEndTime = formData.endTime ? new Date(`${formData.date}T${formData.endTime}:00`).toISOString() : null;
    
    const payload = {
      ...formData,
      startTime: isoStartTime,
      endTime: isoEndTime
    };

    if (isEditing && editItem) {
      dispatch({
        type: 'UPDATE_ITINERARY',
        payload: { ...payload, id: editItem.id }
      });
    } else {
      const newId = Math.max(0, ...state.trip.itinerary.map(i => i.id)) + 1;
      dispatch({
        type: 'ADD_ITINERARY',
        payload: { ...payload, id: newId }
      });
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of your activity.' : 'Add a new activity to your itinerary.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="activityTitle">Activity Title *</Label>
            <Input
              id="activityTitle"
              value={formData.activityTitle}
              onChange={(e) => setFormData({ ...formData, activityTitle: e.target.value })}
              placeholder="e.g., Visit Marble Mountains"
              className={cn(errors.activityTitle && "border-destructive")}
            />
            {errors.activityTitle && (
              <p className="text-sm text-destructive">{errors.activityTitle}</p>
            )}
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Marble Mountains, Ngu Hanh Son"
              className={cn(errors.location && "border-destructive")}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>
          
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={cn(errors.startTime && "border-destructive")}
              />
              {errors.startTime && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={cn(errors.time && "border-destructive")}
              />
              {errors.time && (
                <p className="text-sm text-destructive">{errors.time}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={cn(errors.time && "border-destructive")}
              />
              {errors.time && (
                <p className="text-sm text-destructive">{errors.time}</p>
              )}
            </div>
          </div>
          
          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((pri) => (
                    <SelectItem key={pri} value={pri}>{pri}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Status (only for editing) */}
          {isEditing && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Add Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
