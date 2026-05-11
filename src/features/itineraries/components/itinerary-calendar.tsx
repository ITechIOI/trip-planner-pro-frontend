import { useMemo } from 'react'
import {
  Box,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
} from 'lucide-react'
import { tripPlannerColors } from '@/app/theme'
import {
  ItineraryPriority,
  ItineraryStatus,
  type ItineraryResponse,
} from '@/shared'
import {
  ActionCluster,
  Button,
  CategoryIcon,
  ErrorState,
  Skeleton,
  StatusBadge,
} from '@/shared/components/ui'
import { formatDate, formatDateTime, isItineraryOverdue } from '@/shared/lib/display'
import {
  getItineraryCategoryLabel,
  getItineraryPriorityLabel,
  getItineraryStatusLabel,
} from '@/shared/lib/domain'
import {
  buildCalendarDays,
  groupItinerariesByDate,
  normalizeCalendarMonth,
  shiftCalendarMonth,
} from '../lib/itinerary-calendar'

type ItineraryCalendarProps = {
  canManage?: boolean
  items: ItineraryResponse[]
  month: string
  selectedDate?: string
  isLoading?: boolean
  hasError?: boolean
  onDateSelect: (date: string) => void
  onDelete: (item: ItineraryResponse) => void
  onEdit: (item: ItineraryResponse) => void
  onMonthChange: (month: string) => void
  onRetry: () => void
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const getStatusTone = (item: ItineraryResponse) => {
  if (isItineraryOverdue(item)) {
    return 'critical'
  }

  if (item.status === ItineraryStatus.DONE) {
    return 'success'
  }

  if (item.status === ItineraryStatus.IN_PROGRESS) {
    return 'warning'
  }

  return 'info'
}

const getPriorityTone = (priority?: ItineraryPriority) => {
  if (priority === ItineraryPriority.HIGH) {
    return 'critical'
  }

  if (priority === ItineraryPriority.LOW) {
    return 'neutral'
  }

  return 'warning'
}

export const ItineraryCalendar = ({
  canManage = true,
  items,
  month,
  selectedDate,
  isLoading = false,
  hasError = false,
  onDateSelect,
  onDelete,
  onEdit,
  onMonthChange,
  onRetry,
}: ItineraryCalendarProps) => {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const normalizedMonth = normalizeCalendarMonth(month)
  const calendarDays = useMemo(
    () => buildCalendarDays(normalizedMonth),
    [normalizedMonth],
  )
  const groupedItems = useMemo(() => groupItinerariesByDate(items), [items])
  const scheduledDayCount = Object.keys(groupedItems).length
  const overdueCount = items.filter((item) => isItineraryOverdue(item)).length
  const activeDate = selectedDate ?? Object.keys(groupedItems)[0]
  const activeItems = activeDate ? groupedItems[activeDate] ?? [] : []
  const monthDate = `${normalizedMonth}-01`
  const monthLabel = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${monthDate}T00:00:00`))

  const shiftMonth = (delta: number) => {
    onMonthChange(shiftCalendarMonth(normalizedMonth, delta))
  }

  if (hasError) {
    return (
      <ErrorState
        title="Calendar could not be loaded"
        description="Itinerary calendar data could not be loaded."
        action={<Button onClick={onRetry}>Retry</Button>}
      />
    )
  }

  return (
    <Box
      className="itinerary-calendar"
      sx={{
        display: 'grid',
        gap: 2.25,
        gridTemplateColumns: isDesktop ? 'minmax(0, 1fr) minmax(300px, 340px)' : '1fr',
      }}
    >
      <Paper
        component="section"
        variant="outlined"
        sx={{
          borderRadius: '12px',
          borderColor: tripPlannerColors.border,
          boxShadow: '0 14px 34px rgba(15, 23, 42, 0.06)',
          overflow: 'hidden',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            background:
              'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 62%, #FFF7ED 100%)',
            justifyContent: 'space-between',
            p: { xs: 1.5, sm: 2 },
                  borderBottom: `1px solid ${tripPlannerColors.border}`,
                }}
              >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <CategoryIcon icon={<CalendarDays size={17} />} label="Calendar" tone="info" />
            <Box>
              <Typography component="h2" variant="h2">
                {monthLabel}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontSize: 12, fontWeight: 750, mt: 0.35 }}
              >
                {items.length} activit{items.length === 1 ? 'y' : 'ies'} ·{' '}
                {scheduledDayCount} scheduled day{scheduledDayCount === 1 ? '' : 's'}
                {overdueCount ? ` · ${overdueCount} overdue` : ''}
              </Typography>
            </Box>
          </Stack>
          <ActionCluster>
            <Button
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
              type="button"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
              type="button"
            >
              <ChevronRight size={16} />
            </Button>
          </ActionCluster>
        </Stack>

        {isLoading ? (
          <Box sx={{ p: 2 }}>
            <Skeleton rows={6} />
          </Box>
        ) : (
          <Box
            className="calendar-grid"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              backgroundColor: tripPlannerColors.border,
              gap: '1px',
            }}
          >
            {weekdayLabels.map((label) => (
              <Box
                key={label}
                sx={{
                  bgcolor: tripPlannerColors.surfaceSoft,
                  color: '#475569',
                  fontSize: 12,
                  fontWeight: 900,
                  p: 1.1,
                  textAlign: 'center',
                }}
              >
                {label}
              </Box>
            ))}
            {calendarDays.map((day) => {
              const dayItems = groupedItems[day.dateKey] ?? []
              const isSelected = activeDate === day.dateKey
              const hasItems = dayItems.length > 0

              return (
                <Box
                  component="button"
                  key={day.dateKey}
                  onClick={() => onDateSelect(day.dateKey)}
                  type="button"
                  aria-label={`${day.date.format('MMMM D, YYYY')}${
                    hasItems ? `, ${dayItems.length} itineraries` : ''
                  }`}
                  sx={{
                    minHeight: { xs: 84, sm: 116 },
                    p: 1,
                    border: 0,
                    bgcolor: isSelected
                      ? '#EFF6FF'
                      : hasItems
                        ? '#F8FAFC'
                        : '#FFFFFF',
                    color: day.isCurrentMonth
                      ? tripPlannerColors.ink
                      : tripPlannerColors.muted,
                    cursor: 'pointer',
                    display: 'grid',
                    alignContent: 'start',
                    gap: 0.8,
                    position: 'relative',
                    textAlign: 'left',
                    transition: 'background-color 180ms ease, box-shadow 180ms ease',
                    boxShadow: isSelected
                      ? `inset 0 0 0 2px ${tripPlannerColors.primary}`
                      : 'none',
                    '&:hover': {
                      bgcolor: isSelected ? '#E0F2FE' : '#F8FAFC',
                    },
                    '&:focus-visible': {
                      outline: `3px solid ${tripPlannerColors.primary}`,
                      outlineOffset: -3,
                    },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      bgcolor: isSelected ? tripPlannerColors.primaryStrong : 'transparent',
                      color: isSelected ? '#FFFFFF' : 'inherit',
                      fontWeight: 900,
                    }}
                  >
                    {day.date.date()}
                  </Typography>
                  {hasItems ? (
                    <Stack spacing={0.65}>
                      <Box
                        component="span"
                        sx={{
                          alignSelf: 'start',
                          bgcolor: '#E0F2FE',
                          border: '1px solid #BAE6FD',
                          borderRadius: 999,
                          color: tripPlannerColors.primaryStrong,
                          fontSize: 11,
                          fontWeight: 900,
                          px: 0.85,
                          py: 0.2,
                        }}
                      >
                        {dayItems.length} item{dayItems.length > 1 ? 's' : ''}
                      </Box>
                      {dayItems.slice(0, 2).map((item) => (
                        <Box
                          component="span"
                          key={item.id ?? item.activityTitle}
                          sx={{
                            borderLeft: `3px solid ${
                              isItineraryOverdue(item)
                                ? tripPlannerColors.critical
                                : tripPlannerColors.primary
                            }`,
                            color: isItineraryOverdue(item)
                              ? tripPlannerColors.critical
                              : tripPlannerColors.ink,
                            pl: 0.75,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          {isItineraryOverdue(item) ? 'Overdue · ' : ''}
                          {item.activityTitle}
                        </Box>
                      ))}
                      {dayItems.length > 2 ? (
                        <Typography
                          component="span"
                          sx={{
                            color: '#475569',
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          +{dayItems.length - 2} more
                        </Typography>
                      ) : null}
                    </Stack>
                  ) : null}
                </Box>
              )
            })}
          </Box>
        )}
      </Paper>

      <Paper
        aria-label="Selected day itineraries"
        component="section"
        variant="outlined"
        sx={{
          alignSelf: 'start',
          borderRadius: '12px',
          borderColor: tripPlannerColors.border,
          boxShadow: '0 14px 34px rgba(15, 23, 42, 0.06)',
          display: 'grid',
          gap: 1.5,
          p: 2,
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
          <CategoryIcon icon={<CalendarDays size={17} />} label="Selected day" tone="info" />
          <Box sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 900 }}>
              Selected day
            </Typography>
            <Typography component="h2" variant="h2">
              {activeDate ? formatDate(activeDate) : 'No date selected'}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 700, mt: 0.5 }}>
              {activeItems.length} activit{activeItems.length === 1 ? 'y' : 'ies'} scheduled
            </Typography>
          </Box>
        </Stack>

        {activeItems.length === 0 ? (
          <Box
            sx={{
              bgcolor: tripPlannerColors.surfaceSoft,
              border: `1px dashed ${tripPlannerColors.border}`,
              borderRadius: '10px',
              p: 2,
            }}
          >
            <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
              No itinerary items on this day.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.25}>
            {activeItems.map((item) => (
              <Paper
                component="article"
                key={item.id ?? item.activityTitle}
                variant="outlined"
                sx={{
                  borderColor: isItineraryOverdue(item)
                    ? '#FCA5A5'
                    : tripPlannerColors.border,
                  borderRadius: '10px',
                  bgcolor: isItineraryOverdue(item) ? '#FEF2F2' : '#FFFFFF',
                  display: 'grid',
                  gap: 1,
                  p: 1.5,
                }}
              >
                <Stack direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
                  <CategoryIcon
                    icon={<CalendarDays size={17} />}
                    label={getItineraryCategoryLabel(item.category)}
                    tone={getStatusTone(item)}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography component="h3" variant="h3">
                        {item.activityTitle}
                      </Typography>
                      {isItineraryOverdue(item) ? (
                        <StatusBadge tone="critical">Overdue</StatusBadge>
                      ) : null}
                    </Stack>
                    <Stack
                      component="p"
                      spacing={0.75}
                      sx={{
                        color: '#475569',
                        fontSize: 13,
                        fontWeight: 700,
                        m: 0,
                        mt: 0.75,
                      }}
                    >
                      <Box component="span" sx={{ display: 'inline-flex', gap: 0.75 }}>
                        <Clock3 size={15} />
                        {formatDateTime(item.startTime)}
                      </Box>
                      {item.location ? (
                        <Box component="span" sx={{ display: 'inline-flex', gap: 0.75 }}>
                          <MapPin size={15} />
                          {item.location}
                        </Box>
                      ) : null}
                    </Stack>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
                  <StatusBadge tone={getStatusTone(item)}>
                    {getItineraryStatusLabel(item.status)}
                  </StatusBadge>
                  <StatusBadge tone={getPriorityTone(item.priority)}>
                    {getItineraryPriorityLabel(item.priority)}
                  </StatusBadge>
                  <StatusBadge tone="info">
                    {getItineraryCategoryLabel(item.category)}
                  </StatusBadge>
                </Stack>
                {canManage ? (
                  <ActionCluster>
                    <Button type="button" onClick={() => onEdit(item)}>
                      <Pencil size={15} />
                      Edit
                    </Button>
                    {item.id ? (
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 size={15} />
                        Delete
                      </Button>
                    ) : null}
                  </ActionCluster>
                ) : null}
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  )
}
