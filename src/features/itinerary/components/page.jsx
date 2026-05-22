import { useState, useMemo } from 'react'
import { AppLayout } from '@/components/ui/app-layout'
import { useTrip } from '@/lib/trip-context'
import { ItineraryCard } from '@/features/itinerary/components/itinerary-card'
import { ItineraryForm } from '@/features/itinerary/components/itinerary-form'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Calendar,
  Search,
  Filter,
  X,
  CalendarDays,
  List,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProgressRing } from '@/components/dashboard/progress-ring'

function ItineraryContent() {
  const { state, stats } = useTrip()
  const isViewMode = state.viewMode === 'view'

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [viewMode, setViewMode] = useState('timeline')

  const filteredItems = useMemo(() => {
    return state.trip.itinerary.filter((item) => {
      const matchesSearch =
        (item.activityTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.location?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === '' || item.category === filterCategory
      const matchesStatus = filterStatus === '' || item.status === filterStatus
      const matchesPriority = filterPriority === '' || item.priority === filterPriority
      const itemDateStr = item.startTime ? item.startTime.split('T')[0] : '';
      const matchesDate = !filterDate || itemDateStr === filterDate

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesDate
    })
  }, [state.trip.itinerary, searchQuery, filterCategory, filterStatus, filterPriority, filterDate])

  const groupedItems = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        const itemDateStr = item.startTime ? item.startTime.split('T')[0] : 'Unscheduled';
        if (!acc[itemDateStr]) acc[itemDateStr] = []
        acc[itemDateStr].push(item)
        return acc
      },
      {},
    )
  }, [filteredItems])

  const sortedDates = Object.keys(groupedItems).sort()

  const handleEdit = (item) => {
    setEditItem(item)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditItem(null)
    setIsFormOpen(true)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilterCategory('')
    setFilterStatus('')
    setFilterPriority('')
    setFilterDate('')
  }

  const hasActiveFilters =
    searchQuery ||
    filterCategory !== 'ALL' ||
    filterStatus !== 'ALL' ||
    filterPriority !== 'ALL' ||
    filterDate !== 'ALL'

  const formatDate = (dateStr) => {
    if (dateStr === 'Unscheduled') return 'Unscheduled Activities'
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (date.toDateString() === today.toDateString()) return 'Today'

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isDatePast = (dateStr) => {
    if (dateStr === 'Unscheduled') return false
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Itinerary</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your travel activities and schedule
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-2 md:flex">
            <ProgressRing
              progress={stats.itineraryCompletionPercentage}
              size={48}
              strokeWidth={4}
              variant={stats.hasOverdueActivities ? 'danger' : 'default'}
            />
            <div>
              <p className="text-sm font-semibold">
                {stats.completedActivities}/{stats.totalActivities}
              </p>
              <p className="text-xs text-muted-foreground">Activities Done</p>
            </div>
          </div>

          {!isViewMode && (
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          )}
        </div>
      </div>

      {stats.hasOverdueActivities && (
        <div className="flex items-center gap-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-destructive">
              {stats.overdueActivities} Overdue{' '}
              {stats.overdueActivities === 1 ? 'Activity' : 'Activities'}
            </p>
            <p className="text-sm text-destructive/80">
              Some planned activities are past their scheduled date
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
            onClick={() => setFilterStatus('Planned')}
          >
            View Overdue
          </Button>
        </div>
      )}

      <div className="flex flex-row gap-4 lg:flex-row">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-row gap-4 lg:flex-row">
          <Select
            value={filterCategory}
            onValueChange={(v) => setFilterCategory(v)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="TRANSPORT">Transport</SelectItem>
              <SelectItem value="FOOD">Food</SelectItem>
              <SelectItem value="SIGHTSEEING">Sightseeing</SelectItem>
              <SelectItem value="SHOPPING">Shopping</SelectItem>
              <SelectItem value="HOTEL">Hotel</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="PLANNED">Planned</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterPriority}
            onValueChange={(v) => setFilterPriority(v)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-[160px]"
          />

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}

          <div className="flex items-center rounded-lg border bg-muted/50 p-1">
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-3"
              onClick={() => setViewMode('timeline')}
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-3"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {state.trip.itinerary.length} activities
          </span>
        </div>
      )}

      {state.trip.itinerary.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No activities yet"
          description="Start planning your trip by adding your first activity."
          action={
            !isViewMode
              ? { label: 'Add First Activity', onClick: handleAdd }
              : undefined
          }
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching activities"
          description="Try adjusting your filters or search query."
          action={{ label: 'Clear Filters', onClick: clearFilters }}
        />
      ) : viewMode === 'timeline' ? (
        <div className="space-y-8">
          {sortedDates.map((date) => {
            const items = groupedItems[date]
            const isPast = isDatePast(date)

            return (
              <div key={date} className="relative">
                <div className="sticky top-20 z-10 mb-4 flex items-center gap-4 bg-background/95 py-2 backdrop-blur-sm">
                  <div
                    className={cn(
                      'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
                      isPast ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary',
                    )}
                  >
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(date)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {items.length} {items.length === 1 ? 'activity' : 'activities'}
                  </Badge>
                </div>

                <div className="relative space-y-4 pl-8">
                  <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-border" />
                  {items
                    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
                    .map((item) => (
                      <div key={item.id} className="relative">
                        <div
                          className={cn(
                            'absolute -left-5 top-6 h-3 w-3 rounded-full border-2 border-background',
                            item.status === 'DONE'
                              ? 'bg-success'
                              : item.status === 'IN_PROGRESS'
                                ? 'bg-warning'
                                : 'bg-primary',
                          )}
                        />
                        <ItineraryCard item={item} onEdit={handleEdit} />
                      </div>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems
            .sort((a, b) => {
              const dateCompare = a.date.localeCompare(b.date)
              if (dateCompare !== 0) return dateCompare
              return a.time.localeCompare(b.time)
            })
            .map((item) => (
              <ItineraryCard key={item.id} item={item} onEdit={handleEdit} />
            ))}
        </div>
      )}

      <ItineraryForm open={isFormOpen} onOpenChange={setIsFormOpen} editItem={editItem} />
    </div>
  )
}

export default function ItineraryPage() {
  return (
    <AppLayout>
      <ItineraryContent />
    </AppLayout>
  )
}
