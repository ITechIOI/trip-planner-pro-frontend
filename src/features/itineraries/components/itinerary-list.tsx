import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { AlertTriangle, MapPin, Pencil, Trash2 } from 'lucide-react'
import { tripPlannerColors } from '@/app/theme'
import { ItineraryStatus, type ItineraryResponse } from '@/shared'
import {
  ActionCluster,
  Button,
  CategoryIcon,
  StatusBadge,
} from '@/shared/components/ui'
import {
  getItineraryCategoryLabel,
  getItineraryPriorityLabel,
  getItineraryStatusLabel,
  itineraryStatusOptions,
} from '@/shared/lib/domain'
import { formatDateTime, isItineraryOverdue } from '@/shared/lib/display'

const getStatusTone = (status?: ItineraryStatus, overdue = false) => {
  if (status === ItineraryStatus.DONE) {
    return 'success'
  }

  if (overdue) {
    return 'critical'
  }

  if (status === ItineraryStatus.IN_PROGRESS) {
    return 'info'
  }

  return 'neutral'
}

type ItineraryListProps = {
  canManage?: boolean
  items: ItineraryResponse[]
  onDelete: (item: ItineraryResponse) => void
  onEdit: (item: ItineraryResponse) => void
  onStatusChange: (item: ItineraryResponse, status: ItineraryStatus) => void
}

export const ItineraryList = ({
  canManage = true,
  items,
  onDelete,
  onEdit,
  onStatusChange,
}: ItineraryListProps) => {
  const theme = useTheme()
  const isTableLayout = useMediaQuery(theme.breakpoints.up('md'))

  if (isTableLayout) {
    return (
      <TableContainer
        className="item-table"
        component={Paper}
        variant="outlined"
        sx={{ borderColor: tripPlannerColors.border }}
      >
        <Table aria-label="Itinerary items">
          <TableHead>
            <TableRow>
              <TableCell>Activity</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              {canManage ? <TableCell align="right">Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const overdue = isItineraryOverdue(item)

              return (
                <TableRow
                  className={`item-row ${overdue ? 'item-row--critical' : ''}`}
                  data-testid="item-row"
                  key={item.id}
                  sx={{
                    bgcolor: overdue ? '#FFF7ED' : 'inherit',
                    '& > *': {
                      borderColor: overdue ? '#FECACA' : tripPlannerColors.border,
                    },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
                      <CategoryIcon
                        icon={<MapPin size={17} />}
                        label={getItineraryCategoryLabel(item.category)}
                        tone={overdue ? 'critical' : 'info'}
                      />
                      <Box sx={{ display: 'grid', gap: 0.5, minWidth: 0 }}>
                        <Typography component="h2" variant="h3">
                          {item.activityTitle}
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                          {item.location || 'No location'}
                        </Typography>
                      </Box>
                      {overdue ? (
                        <StatusBadge tone="critical">
                          <AlertTriangle size={13} />
                          Overdue
                        </StatusBadge>
                      ) : null}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'grid', gap: 0.25 }}>
                      <Typography sx={{ fontSize: 13 }}>
                        {formatDateTime(item.startTime)}
                      </Typography>
                      {item.endTime ? (
                        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                          {formatDateTime(item.endTime)}
                        </Typography>
                      ) : null}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone="info">
                      {getItineraryCategoryLabel(item.category)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={item.priority === 'HIGH' ? 'warning' : 'neutral'}>
                      {getItineraryPriorityLabel(item.priority)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {canManage ? (
                      <TextField
                        className="inline-select"
                        label="Status"
                        onChange={(event) =>
                          onStatusChange(item, event.target.value as ItineraryStatus)
                        }
                        select
                        size="small"
                        slotProps={{ select: { native: true } }}
                        sx={{ minWidth: 148 }}
                        value={item.status ?? ItineraryStatus.PLANNED}
                      >
                        {itineraryStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    ) : (
                      <StatusBadge tone={getStatusTone(item.status, overdue)}>
                        {getItineraryStatusLabel(item.status)}
                      </StatusBadge>
                    )}
                  </TableCell>
                  {canManage ? (
                    <TableCell align="right">
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
                      <span className="sr-only">
                        Current status: {getItineraryStatusLabel(item.status)}
                      </span>
                    </TableCell>
                  ) : null}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <Stack className="item-list" spacing={1.5}>
      {items.map((item) => {
        const overdue = isItineraryOverdue(item)

        return (
          <Paper
            className={`item-row ${overdue ? 'item-row--critical' : ''}`}
            component="article"
            data-testid="item-row"
            key={item.id}
            variant="outlined"
            sx={{
              display: 'grid',
              alignItems: 'center',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
              p: 2.25,
              borderColor: overdue ? '#FECACA' : tripPlannerColors.border,
              bgcolor: overdue ? '#FFF7ED' : tripPlannerColors.surface,
            }}
          >
            <Stack className="item-row__main" direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
              <CategoryIcon
                icon={<MapPin size={18} />}
                label={getItineraryCategoryLabel(item.category)}
                tone={overdue ? 'critical' : 'info'}
                size="lg"
              />
              <Box sx={{ display: 'grid', gap: 0.75, minWidth: 0 }}>
                <Typography component="h2" variant="h2">
                  {item.activityTitle}
                </Typography>
                <Typography color="text.secondary">{item.location || 'No location'}</Typography>
                <Stack className="item-row__meta" direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography color="text.secondary" component="span" sx={{ fontSize: 13, fontWeight: 700 }}>
                    {formatDateTime(item.startTime)}
                  </Typography>
                  <StatusBadge tone="info">{getItineraryCategoryLabel(item.category)}</StatusBadge>
                  <StatusBadge tone={item.priority === 'HIGH' ? 'warning' : 'neutral'}>
                    {getItineraryPriorityLabel(item.priority)}
                  </StatusBadge>
                  <StatusBadge tone={getStatusTone(item.status, overdue)}>
                    {getItineraryStatusLabel(item.status)}
                  </StatusBadge>
                  {overdue ? (
                    <StatusBadge tone="critical">
                      <AlertTriangle size={13} />
                      Overdue
                    </StatusBadge>
                  ) : null}
                </Stack>
              </Box>
            </Stack>
            {canManage ? (
              <Stack
                className="item-row__actions"
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', flexWrap: 'wrap' }}
              >
                <TextField
                  className="inline-select"
                  label="Status"
                  onChange={(event) =>
                    onStatusChange(item, event.target.value as ItineraryStatus)
                  }
                  select
                  slotProps={{ select: { native: true } }}
                  sx={{ minWidth: 148 }}
                  value={item.status ?? ItineraryStatus.PLANNED}
                >
                  {itineraryStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
                <span className="sr-only">
                  Current status: {getItineraryStatusLabel(item.status)}
                </span>
                <Button type="button" onClick={() => onEdit(item)}>
                  <Pencil size={15} />
                  Edit
                </Button>
                {item.id ? (
                  <Button type="button" variant="danger" onClick={() => onDelete(item)}>
                    <Trash2 size={15} />
                    Delete
                  </Button>
                ) : null}
              </Stack>
            ) : null}
          </Paper>
        )
      })}
    </Stack>
  )
}
