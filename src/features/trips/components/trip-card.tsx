import { CalendarDays, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
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
    <article className="trip-card">
      <div>
        <h2>{trip.name}</h2>
        <p>
          <CalendarDays size={15} />
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
      </div>
      <dl>
        <div>
          <dt>Budget</dt>
          <dd>{formatCurrency(trip.estimatedBudget)}</dd>
        </div>
      </dl>
      <div className="trip-card__actions">
        <Button type="button" onClick={() => onEdit(trip)}>
          Edit
        </Button>
        <Link className="button button--primary" to={`/trips/${trip.id}/dashboard`}>
          Open workspace
        </Link>
        {trip.id ? (
          <Button type="button" variant="danger" onClick={() => onDelete(trip.id!)}>
            <Trash2 size={15} />
            Delete
          </Button>
        ) : null}
      </div>
    </article>
  )
}
