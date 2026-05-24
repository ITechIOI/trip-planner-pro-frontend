import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ClearIcon from '@mui/icons-material/Clear'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import SearchIcon from '@mui/icons-material/Search'
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'
import type {
  GetTripDashboardQueryError,
  ItineraryCategory,
  ItineraryPageResponse,
  ItineraryPriority,
  ItineraryResponse,
  ItineraryStatus,
  ListTripItinerariesQueryError,
  TripDashboardResponse,
} from '@/shared'
import { AppLayout } from '@/shared/components/app-layout'
import { EmptyState } from '@/shared/components/empty-state'
import { ProgressRing } from '@/shared/components/progress-ring'
import { useTripDashboard } from '@/features/trips/api/use-trip-action'
import { getTripsErrorMessage } from '@/features/trips/lib/trips-error'
import { useTripItineraries } from '@/features/itineraries/api/use-itinerary-action'
import { getItinerariesErrorMessage } from '@/features/itineraries/lib/itineraries-error'
import {
  buildItineraryDashboardStats,
} from '@/features/itineraries/lib/itinerary-dashboard-stats'
import { normalizeItineraryFromApi } from '@/features/itineraries/api/itinerary-mappers'
import { ItineraryCard } from '@/features/itineraries/components/itinerary-card'
import { ItineraryForm } from '@/features/itineraries/components/itinerary-form'
import {
  ITINERARY_CATEGORIES,
  ITINERARY_PRIORITIES,
  ITINERARY_STATUSES,
} from '@/features/itineraries/api/itinerary-mappers'
import { ItineraryStatus as ItineraryStatusEnum } from '@/shared'

export type ItineraryPageProps = {
  tripId: number
  viewMode?: 'view' | 'edit'
}

type ListViewMode = 'timeline' | 'list'

type GroupedItineraries = Record<string, ItineraryResponse[]>

const formatDateHeading = (dateStr: string) => {
  if (dateStr === 'Unscheduled') {
    return 'Unscheduled Activities'
  }

  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  }

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const isDatePast = (dateStr: string) => {
  if (dateStr === 'Unscheduled') {
    return false
  }

  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const ItineraryContent = ({ tripId, viewMode = 'edit' }: ItineraryPageProps) => {
  const isViewMode = viewMode === 'view'

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<ItineraryResponse | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<ItineraryCategory | ''>('')
  const [filterStatus, setFilterStatus] = useState<ItineraryStatus | ''>('')
  const [filterPriority, setFilterPriority] = useState<ItineraryPriority | ''>('')
  const [filterDate, setFilterDate] = useState('')
  const [listViewMode, setListViewMode] = useState<ListViewMode>('timeline')

  const itinerariesQuery = useTripItineraries(tripId)
  const dashboardQuery = useTripDashboard(tripId)

  const stats = buildItineraryDashboardStats(
    dashboardQuery.data as TripDashboardResponse | undefined,
  )
  const errorMessage = itinerariesQuery.error
    ? getItinerariesErrorMessage(
        itinerariesQuery.error as ListTripItinerariesQueryError,
      )
    : dashboardQuery.error
      ? getTripsErrorMessage(dashboardQuery.error as GetTripDashboardQueryError)
      : null

  const itineraryItems = useMemo(() => {
    const page = itinerariesQuery.data as ItineraryPageResponse | undefined

    return (page?.items ?? [])
      .map((item: ItineraryResponse) => normalizeItineraryFromApi(item))
      .filter((item): item is ItineraryResponse => item != null)
  }, [itinerariesQuery.data])

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return itineraryItems.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        (item.activityTitle?.toLowerCase() ?? '').includes(normalizedSearch) ||
        (item.location?.toLowerCase() ?? '').includes(normalizedSearch)
      const matchesCategory =
        filterCategory === '' || item.category === filterCategory
      const matchesStatus = filterStatus === '' || item.status === filterStatus
      const matchesPriority =
        filterPriority === '' || item.priority === filterPriority
      const itemDateStr = item.startTime ? item.startTime.split('T')[0] : ''
      const matchesDate = !filterDate || itemDateStr === filterDate

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPriority &&
        matchesDate
      )
    })
  }, [
    itineraryItems,
    searchQuery,
    filterCategory,
    filterStatus,
    filterPriority,
    filterDate,
  ])

  const groupedItems = useMemo(() => {
    return filteredItems.reduce<GroupedItineraries>((groups: GroupedItineraries, item: ItineraryResponse) => {
      const itemDateStr = item.startTime
        ? item.startTime.split('T')[0]
        : 'Unscheduled'

      if (!groups[itemDateStr]) {
        groups[itemDateStr] = []
      }

      groups[itemDateStr].push(item)
      return groups
    }, {})
  }, [filteredItems])

  const sortedDates = Object.keys(groupedItems).sort()

  const hasActiveFilters = Boolean(
    searchQuery ||
      filterCategory ||
      filterStatus ||
      filterPriority ||
      filterDate,
  )

  const handleEdit = (item: ItineraryResponse) => {
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

  if (itinerariesQuery.isLoading || dashboardQuery.isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Loading itinerary...
      </Typography>
    )
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Itinerary
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your travel activities and schedule
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: 'center',
              display: { xs: 'none', md: 'flex' },
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <ProgressRing
              progress={stats.itineraryCompletionPercentage}
              size={48}
              strokeWidth={4}
              variant={stats.hasOverdueActivities ? 'danger' : 'default'}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {stats.completedActivities}/{stats.totalActivities}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Activities Done
              </Typography>
            </Box>
          </Stack>

          {!isViewMode ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
              Add Activity
            </Button>
          ) : null}
        </Stack>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {stats.hasOverdueActivities ? (
        <Alert
          severity="error"
          icon={<ErrorOutlineOutlinedIcon />}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setFilterStatus(ItineraryStatusEnum.PLANNED)}
            >
              View Overdue
            </Button>
          }
        >
          <Typography sx={{ fontWeight: 600 }}>
            {stats.overdueActivities} Overdue{' '}
            {stats.overdueActivities === 1 ? 'Activity' : 'Activities'}
          </Typography>
          <Typography variant="body2">
            Some planned activities are past their scheduled date
          </Typography>
        </Alert>
      ) : null}

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={2}
        sx={{ alignItems: { lg: 'center' } }}
      >
        <TextField
          size="small"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          sx={{ flex: 1, maxWidth: { lg: 420 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
          <FilterSelect
            label="Category"
            value={filterCategory}
            onChange={setFilterCategory}
            options={[
              { value: '', label: 'All Categories' },
              ...ITINERARY_CATEGORIES.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
          />
          <FilterSelect
            label="Status"
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: '', label: 'All Status' },
              ...ITINERARY_STATUSES.map((status) => ({
                value: status,
                label: status,
              })),
            ]}
          />
          <FilterSelect
            label="Priority"
            value={filterPriority}
            onChange={setFilterPriority}
            options={[
              { value: '', label: 'All Priorities' },
              ...ITINERARY_PRIORITIES.map((priority) => ({
                value: priority,
                label: priority,
              })),
            ]}
          />
          <TextField
            label="Date"
            type="date"
            size="small"
            value={filterDate}
            onChange={(event) => setFilterDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 160 }}
          />

          {hasActiveFilters ? (
            <Button
              variant="text"
              size="small"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
            >
              Clear
            </Button>
          ) : null}

          <ToggleButtonGroup
            size="small"
            exclusive
            value={listViewMode}
            onChange={(_event, value: ListViewMode | null) => {
              if (value) {
                setListViewMode(value)
              }
            }}
          >
            <ToggleButton value="timeline">
              <CalendarMonthOutlinedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListOutlinedIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {hasActiveFilters ? (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <FilterListOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Showing {filteredItems.length} of {itineraryItems.length} activities
          </Typography>
        </Stack>
      ) : null}

      {itineraryItems.length === 0 ? (
        <EmptyState
          icon={CalendarMonthOutlinedIcon}
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
          icon={SearchIcon}
          title="No matching activities"
          description="Try adjusting your filters or search query."
          action={{ label: 'Clear Filters', onClick: clearFilters }}
        />
      ) : listViewMode === 'timeline' ? (
        <Stack spacing={4}>
          {sortedDates.map((date) => {
            const items = groupedItems[date] ?? []
            const isPast = isDatePast(date)

            return (
              <Box key={date}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 2, alignItems: 'center' }}
                >
                  <Chip
                    icon={<CalendarMonthOutlinedIcon />}
                    label={formatDateHeading(date)}
                    color={isPast ? 'default' : 'primary'}
                    variant={isPast ? 'outlined' : 'filled'}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${items.length} ${items.length === 1 ? 'activity' : 'activities'}`}
                  />
                </Stack>

                <Stack spacing={2} sx={{ pl: { xs: 0, md: 3 } }}>
                  {[...items]
                    .sort((left, right) =>
                      (left.startTime ?? '').localeCompare(right.startTime ?? ''),
                    )
                    .map((item) => (
                      <ItineraryCard
                        key={item.id}
                        tripId={tripId}
                        item={item}
                        onEdit={handleEdit}
                        viewMode={viewMode}
                      />
                    ))}
                </Stack>
              </Box>
            )
          })}
        </Stack>
      ) : (
        <Stack spacing={2}>
          {[...filteredItems]
            .sort((left, right) =>
              (left.startTime ?? '').localeCompare(right.startTime ?? ''),
            )
            .map((item) => (
              <ItineraryCard
                key={item.id}
                tripId={tripId}
                item={item}
                onEdit={handleEdit}
                viewMode={viewMode}
              />
            ))}
        </Stack>
      )}

      <ItineraryForm
        tripId={tripId}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editItem={editItem}
      />
    </Stack>
  )
}

type FilterSelectProps<T extends string> = {
  label: string
  value: T | ''
  onChange: (value: T | '') => void
  options: { value: T | ''; label: string }[]
}

const FilterSelect = <T extends string>({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps<T>) => (
  <FormControl size="small" sx={{ minWidth: 140 }}>
    <InputLabel>{label}</InputLabel>
    <Select
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value as T | '')}
    >
      {options.map((option) => (
        <MenuItem key={option.value || '__all__'} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

export const ItineraryPage = ({ tripId, viewMode }: ItineraryPageProps) => (
  <AppLayout tripId={tripId}>
    <ItineraryContent tripId={tripId} viewMode={viewMode} />
  </AppLayout>
)

export default ItineraryPage
