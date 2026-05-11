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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { CalendarDays, Pencil, Trash2 } from 'lucide-react'
import { tripPlannerColors } from '@/app/theme'
import type { TripResponse } from '@/shared'
import { Button, StatusBadge } from '@/shared/components/ui'
import { formatCurrency, formatDate } from '@/shared/lib/display'
import {
  OWNER_TRIP_ROLE,
  getTripAccessLabel,
  getTripAccessTone,
  type TripAccess,
} from '../lib/trip-access'

type TripListProps = {
  accessByTripId?: Record<number, TripAccess>
  trips: TripResponse[]
  offset?: number
  onEdit: (trip: TripResponse) => void
  onDelete: (tripId: number) => void
}

export const TripList = ({
  accessByTripId,
  trips,
  offset = 0,
  onEdit,
  onDelete,
}: TripListProps) => {
  const theme = useTheme()
  const isTableLayout = useMediaQuery(theme.breakpoints.up('md'))
  const getAccess = (trip: TripResponse) =>
    trip.id ? accessByTripId?.[trip.id] : undefined
  const canManageTrip = (trip: TripResponse) => {
    const access = getAccess(trip)

    return accessByTripId ? access?.role === OWNER_TRIP_ROLE : true
  }

  if (!isTableLayout) {
    return (
      <Stack className="trip-list" spacing={1.5}>
        {trips.map((trip, index) => (
          <Paper
            className="trip-row"
            component="article"
            data-testid="trip-row"
            key={trip.id}
            variant="outlined"
            sx={{
              display: 'grid',
              gap: 1.5,
              p: 2,
              borderColor: tripPlannerColors.border,
            }}
          >
            <Box sx={{ display: 'grid', gap: 0.75 }}>
              <Typography
                color="text.secondary"
                sx={{ fontSize: 12, fontWeight: 800 }}
              >
                No. {offset + index + 1}
              </Typography>
              <Typography component="h2" variant="h2">
                {trip.name}
              </Typography>
              <Stack
                component="p"
                direction="row"
                spacing={0.75}
                sx={{ alignItems: 'center', color: 'text.secondary', m: 0 }}
              >
                <CalendarDays size={15} />
                <Box component="span">
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </Box>
              </Stack>
              <Typography color="text.secondary">
                Budget: {formatCurrency(trip.estimatedBudget)}
              </Typography>
              {trip.id ? (
                <StatusBadge tone={getTripAccessTone(getAccess(trip)?.role ?? null)}>
                  {getTripAccessLabel(getAccess(trip)?.role ?? null)}
                </StatusBadge>
              ) : null}
            </Box>
            {canManageTrip(trip) ? (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Button type="button" onClick={() => onEdit(trip)}>
                  <Pencil size={15} />
                  Edit
                </Button>
                {trip.id ? (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => onDelete(trip.id!)}
                  >
                    <Trash2 size={15} />
                    Delete
                  </Button>
                ) : null}
              </Stack>
            ) : null}
          </Paper>
        ))}
      </Stack>
    )
  }

  return (
    <TableContainer
      className="trip-table"
      component={Paper}
      variant="outlined"
      sx={{ borderColor: tripPlannerColors.border }}
    >
      <Table aria-label="Trips">
        <TableHead>
          <TableRow>
            <TableCell width={72}>No.</TableCell>
            <TableCell>Trip</TableCell>
            <TableCell>Date range</TableCell>
            <TableCell>Your role</TableCell>
            <TableCell align="right">Budget</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.map((trip, index) => (
            <TableRow className="trip-row" data-testid="trip-row" key={trip.id}>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>
                {offset + index + 1}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                  <Typography component="h2" variant="h3">
                    {trip.name}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </TableCell>
              <TableCell>
                <StatusBadge tone={getTripAccessTone(getAccess(trip)?.role ?? null)}>
                  {getTripAccessLabel(getAccess(trip)?.role ?? null)}
                </StatusBadge>
              </TableCell>
              <TableCell align="right">
                {formatCurrency(trip.estimatedBudget)}
              </TableCell>
              <TableCell align="right">
                {canManageTrip(trip) ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}
                  >
                    <Button type="button" onClick={() => onEdit(trip)}>
                      <Pencil size={15} />
                      Edit
                    </Button>
                    {trip.id ? (
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => onDelete(trip.id!)}
                      >
                        <Trash2 size={15} />
                        Delete
                      </Button>
                    ) : null}
                  </Stack>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
