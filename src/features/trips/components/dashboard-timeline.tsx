import { Box, Stack, Typography } from '@mui/material'
import { AlertTriangle, Clock4, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { tripPlannerColors } from '@/app/theme'
import { ItineraryStatus, type TripDashboardResponse } from '@/shared'
import {
  Button,
  CategoryIcon,
  EmptyState,
  Panel,
  StatusBadge,
} from '@/shared/components/ui'
import {
  getItineraryCategoryLabel,
  getItineraryStatusLabel,
} from '@/shared/lib/domain'
import {
  formatDate,
  formatDateTime,
  isItineraryOverdue,
} from '@/shared/lib/display'

type DashboardTimelineProps = {
  dashboard: TripDashboardResponse
}

export const DashboardTimeline = ({ dashboard }: DashboardTimelineProps) => {
  return (
    <Panel
      action={
        <Button component={Link} to="../itinerary" type="button" variant="ghost">
          View itinerary
        </Button>
      }
      className="panel--large"
      description="Timeline grouped by travel day."
      icon={<Clock4 size={18} />}
      title="Itinerary by date"
      sx={{ minHeight: 420 }}
    >
      {dashboard.itinerariesByDate?.length ? (
        <Stack className="timeline" spacing={1.75}>
          {dashboard.itinerariesByDate.map((group) => (
            <Box className="timeline-group" component="section" key={group.date ?? 'none'}>
              <Typography
                component="h3"
                color="text.secondary"
                sx={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}
              >
                {formatDate(group.date)}
              </Typography>
              <Stack className="timeline-list" spacing={1} sx={{ mt: 1 }}>
                {(group.items ?? []).map((item) => {
                  const overdue = isItineraryOverdue(item)
                  const statusTone =
                    item.status === ItineraryStatus.DONE
                      ? 'success'
                      : overdue
                        ? 'critical'
                        : item.status === ItineraryStatus.IN_PROGRESS
                          ? 'info'
                          : 'neutral'

                  return (
                    <Box
                      className={`timeline-item ${
                        overdue ? 'timeline-item--overdue' : ''
                      }`}
                      component="article"
                      key={item.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1.5,
                        p: 1.5,
                        border: `1px solid ${
                          overdue ? '#FECACA' : tripPlannerColors.border
                        }`,
                        borderRadius: 2,
                        bgcolor: overdue ? '#FFF7ED' : tripPlannerColors.surface,
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                    >
                      <Stack direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
                        <CategoryIcon
                          icon={<MapPin size={17} />}
                          label={getItineraryCategoryLabel(item.category)}
                          tone={overdue ? 'critical' : 'info'}
                        />
                        <Box sx={{ display: 'grid', gap: 0.4, minWidth: 0 }}>
                          <Typography component="strong" sx={{ fontWeight: 850 }}>
                            {item.activityTitle}
                          </Typography>
                          <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 600 }}>
                            {formatDateTime(item.startTime)}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                        <StatusBadge tone={statusTone}>
                          {getItineraryStatusLabel(item.status)}
                          {overdue ? ' - Overdue' : ''}
                        </StatusBadge>
                        {overdue ? (
                          <StatusBadge tone="critical">
                            <AlertTriangle size={13} />
                            Overdue
                          </StatusBadge>
                        ) : null}
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : (
        <EmptyState
          title="No itinerary items yet"
          description="Add activities to see the trip timeline grouped by date."
        />
      )}
    </Panel>
  )
}
