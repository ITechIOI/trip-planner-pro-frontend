import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import { CalendarDays, Trash2 } from 'lucide-react'
import { tripPlannerColors } from '@/app/theme'
import type { TripResponse } from '@/shared'
import { Button } from '@/shared/components/ui'
import { formatCurrency, formatDate } from '@/shared/lib/display'

type TripCardProps = {
  trip: TripResponse
  onEdit: (trip: TripResponse) => void
  onDelete: (tripId: number) => void
}

export const TripCard = ({ trip, onEdit, onDelete }: TripCardProps) => {
  return (
    <Card
      className="trip-card"
      component="article"
      variant="outlined"
      sx={{
        height: '100%',
        borderColor: tripPlannerColors.border,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
      }}
    >
      <CardContent sx={{ display: 'grid', gap: 2.25, p: 2.25, '&:last-child': { pb: 2.25 } }}>
        <Box>
          <Typography component="h2" variant="h2">
            {trip.name}
          </Typography>
          <Stack
            component="p"
            direction="row"
            spacing={0.75}
            sx={{ alignItems: 'center', color: 'text.secondary', m: 0, mt: 0.75 }}
          >
          <CalendarDays size={15} />
            <Box component="span">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </Box>
          </Stack>
        </Box>
        <Box component="dl" sx={{ m: 0 }}>
          <Box>
            <Typography
              component="dt"
              color="text.secondary"
              sx={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}
            >
              Budget
            </Typography>
            <Typography component="dd" sx={{ fontSize: 24, fontWeight: 900, m: 0, mt: 0.5 }}>
              {formatCurrency(trip.estimatedBudget)}
            </Typography>
          </Box>
        </Box>
        <Stack className="trip-card__actions" direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Button type="button" onClick={() => onEdit(trip)}>
            Edit
          </Button>
          {trip.id ? (
            <Button type="button" variant="danger" onClick={() => onDelete(trip.id!)}>
              <Trash2 size={15} />
              Delete
            </Button>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}
