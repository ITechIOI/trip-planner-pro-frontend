import { AlertTriangle, Trash2 } from 'lucide-react'
import { ItineraryStatus, type ItineraryResponse } from '@/shared'
import { Badge, Button } from '@/shared/components/ui'
import {
  getItineraryCategoryLabel,
  getItineraryPriorityLabel,
  getItineraryStatusLabel,
  itineraryStatusOptions,
} from '@/shared/lib/domain'
import { formatDateTime, isItineraryOverdue } from '@/shared/lib/display'

type ItineraryListProps = {
  items: ItineraryResponse[]
  onDelete: (item: ItineraryResponse) => void
  onEdit: (item: ItineraryResponse) => void
  onStatusChange: (item: ItineraryResponse, status: ItineraryStatus) => void
}

export const ItineraryList = ({
  items,
  onDelete,
  onEdit,
  onStatusChange,
}: ItineraryListProps) => {
  return (
    <div className="item-list">
      {items.map((item) => {
        const overdue = isItineraryOverdue(item)

        return (
          <article
            className={`item-row ${overdue ? 'item-row--critical' : ''}`}
            key={item.id}
          >
            <div className="item-row__main">
              <h2>{item.activityTitle}</h2>
              <p>{item.location || 'No location'}</p>
              <div className="item-row__meta">
                <span>{formatDateTime(item.startTime)}</span>
                <Badge tone="info">{getItineraryCategoryLabel(item.category)}</Badge>
                <Badge tone={item.priority === 'HIGH' ? 'warning' : 'neutral'}>
                  {getItineraryPriorityLabel(item.priority)}
                </Badge>
                {overdue ? (
                  <Badge tone="critical">
                    <AlertTriangle size={13} />
                    Overdue
                  </Badge>
                ) : null}
              </div>
            </div>
            <div className="item-row__actions">
              <label className="inline-select">
                <span>Status</span>
                <select
                  value={item.status ?? ItineraryStatus.PLANNED}
                  onChange={(event) =>
                    onStatusChange(item, event.target.value as ItineraryStatus)
                  }
                >
                  {itineraryStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <span className="sr-only">
                Current status: {getItineraryStatusLabel(item.status)}
              </span>
              <Button type="button" onClick={() => onEdit(item)}>
                Edit
              </Button>
              {item.id ? (
                <Button type="button" variant="danger" onClick={() => onDelete(item)}>
                  <Trash2 size={15} />
                  Delete
                </Button>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
