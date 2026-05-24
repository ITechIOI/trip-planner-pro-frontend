import { useMemo } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { ItineraryResponse } from '@/shared'
import { EmptyState } from '@/shared/components/empty-state'
import {
  buildCalendarDays,
  groupItinerariesByDate,
  normalizeCalendarMonth,
  shiftCalendarMonth,
} from '../lib/itinerary-calendar'

export type ItineraryCalendarProps = {
  items: ItineraryResponse[]
  month: string
  selectedDate: string
  canManage: boolean
  isLoading?: boolean
  hasError?: boolean
  deletingId?: number | null
  onMonthChange: (month: string) => void
  onDateSelect: (date: string) => void
  onRetry: () => void
  onEdit: (item: ItineraryResponse) => void
  onDelete: (item: ItineraryResponse) => void
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const formatMonthLabel = (month: string) => {
  const normalizedMonth = normalizeCalendarMonth(month)
  const [year, monthNumber] = normalizedMonth.split('-').map(Number)

  return new Date(year, monthNumber - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

const formatSelectedDateLabel = (date: string) => {
  if (!date) {
    return 'Select a day'
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatTimeRange = (startTime?: string | null, endTime?: string | null) => {
  const startDisplay = startTime?.split('T')[1]?.substring(0, 5) ?? 'No time'
  const endDisplay = endTime?.split('T')[1]?.substring(0, 5)

  return endDisplay ? `${startDisplay} - ${endDisplay}` : startDisplay
}

export const ItineraryCalendar = ({
  items,
  month,
  selectedDate,
  canManage,
  isLoading = false,
  hasError = false,
  deletingId = null,
  onMonthChange,
  onDateSelect,
  onRetry,
  onEdit,
  onDelete,
}: ItineraryCalendarProps) => {
  const normalizedMonth = normalizeCalendarMonth(month)
  const calendarDays = useMemo(
    () => buildCalendarDays(normalizedMonth),
    [normalizedMonth],
  )
  const groupedItems = useMemo(() => groupItinerariesByDate(items), [items])
  const selectedItems = useMemo(
    () =>
      [...(groupedItems[selectedDate] ?? [])].sort((left, right) =>
        (left.startTime ?? '').localeCompare(right.startTime ?? ''),
      ),
    [groupedItems, selectedDate],
  )

  return (
    <Stack spacing={2.5}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {formatMonthLabel(normalizedMonth)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length} scheduled {items.length === 1 ? 'activity' : 'activities'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Previous month">
            <IconButton
              aria-label="Previous month"
              onClick={() => onMonthChange(shiftCalendarMonth(normalizedMonth, -1))}
            >
              <NavigateBeforeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Next month">
            <IconButton
              aria-label="Next month"
              onClick={() => onMonthChange(shiftCalendarMonth(normalizedMonth, 1))}
            >
              <NavigateNextIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      {hasError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          }
        >
          Unable to load calendar activities.
        </Alert>
      ) : null}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'action.hover',
            }}
          >
            {weekDays.map((day) => (
              <Typography
                key={day}
                variant="caption"
                sx={{
                  py: 1,
                  textAlign: 'center',
                  fontWeight: 700,
                  color: 'text.secondary',
                }}
              >
                {day}
              </Typography>
            ))}
          </Box>

          <Box
            sx={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            }}
          >
            {calendarDays.map((day) => {
              const dayItems = groupedItems[day.dateKey] ?? []
              const isSelected = selectedDate === day.dateKey

              return (
                <Box
                  key={day.dateKey}
                  component="button"
                  type="button"
                  onClick={() => onDateSelect(day.dateKey)}
                  sx={{
                    minHeight: { xs: 76, md: 96 },
                    p: 0.75,
                    border: 0,
                    borderRight: 1,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: isSelected
                      ? 'rgba(14, 165, 233, 0.08)'
                      : day.isCurrentMonth
                        ? 'background.paper'
                        : 'action.hover',
                    color: day.isCurrentMonth ? 'text.primary' : 'text.disabled',
                    cursor: 'pointer',
                    textAlign: 'left',
                    '&:hover': {
                      bgcolor: isSelected
                        ? 'rgba(14, 165, 233, 0.08)'
                        : 'action.hover',
                    },
                  }}
                >
                  <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                    <Stack
                      direction="row"
                      spacing={0.75}
                      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: isSelected ? 700 : 600 }}
                      >
                        {day.date.getDate()}
                      </Typography>
                      {dayItems.length > 0 ? (
                        <Chip
                          size="small"
                          color="primary"
                          label={dayItems.length}
                          sx={{ height: 18, minWidth: 24, fontSize: 11 }}
                        />
                      ) : null}
                    </Stack>

                    {dayItems.slice(0, 2).map((item) => (
                      <Box
                        key={item.id ?? `${item.activityTitle}-${item.startTime}`}
                        sx={{
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 1,
                          bgcolor: 'rgba(14, 165, 233, 0.12)',
                          color: 'primary.dark',
                          overflow: 'hidden',
                        }}
                      >
                        <Typography variant="caption" noWrap sx={{ display: 'block' }}>
                          {item.activityTitle ?? 'Untitled activity'}
                        </Typography>
                      </Box>
                    ))}
                    {dayItems.length > 2 ? (
                      <Typography variant="caption" color="text.secondary">
                        +{dayItems.length - 2} more
                      </Typography>
                    ) : null}
                  </Stack>
                </Box>
              )
            })}

            {isLoading ? (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.72)',
                }}
              >
                <CircularProgress size={28} />
              </Box>
            ) : null}
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {formatSelectedDateLabel(selectedDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedItems.length}{' '}
                {selectedItems.length === 1 ? 'activity' : 'activities'}
              </Typography>
            </Box>

            {selectedItems.length === 0 ? (
              <EmptyState
                icon={CalendarMonthOutlinedIcon}
                title="No activities"
                description="There are no activities scheduled for this day."
              />
            ) : (
              <Stack spacing={1.5}>
                {selectedItems.map((item) => (
                  <Paper
                    key={item.id ?? `${item.activityTitle}-${item.startTime}`}
                    variant="outlined"
                    sx={{ p: 1.5, bgcolor: 'background.default' }}
                  >
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {item.activityTitle ?? 'Untitled activity'}
                          </Typography>
                          <Stack spacing={0.5} sx={{ mt: 0.75 }}>
                            <Stack
                              direction="row"
                              spacing={0.75}
                              sx={{ alignItems: 'center' }}
                            >
                              <AccessTimeIcon sx={{ fontSize: 16 }} color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {formatTimeRange(item.startTime, item.endTime)}
                              </Typography>
                            </Stack>
                            {item.location ? (
                              <Stack
                                direction="row"
                                spacing={0.75}
                                sx={{ alignItems: 'center' }}
                              >
                                <LocationOnOutlinedIcon
                                  sx={{ fontSize: 16 }}
                                  color="action"
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  noWrap
                                >
                                  {item.location}
                                </Typography>
                              </Stack>
                            ) : null}
                          </Stack>
                        </Box>

                        {canManage ? (
                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              size="small"
                              aria-label="Edit calendar activity"
                              onClick={() => onEdit(item)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              aria-label="Delete calendar activity"
                              disabled={deletingId === item.id}
                              onClick={() => onDelete(item)}
                            >
                              <DeleteOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        ) : null}
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  )
}
