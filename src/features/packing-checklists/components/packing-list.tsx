import { Check, Trash2 } from 'lucide-react'
import { PackedStatus, RequiredStatus, type PackingChecklistResponse } from '@/shared'
import { Badge, Button } from '@/shared/components/ui'
import {
  getPackedStatusLabel,
  getPackingCategoryLabel,
  getRequiredStatusLabel,
} from '@/shared/lib/domain'

type PackingListProps = {
  items: PackingChecklistResponse[]
  onDelete: (item: PackingChecklistResponse) => void
  onEdit: (item: PackingChecklistResponse) => void
  onTogglePacked: (item: PackingChecklistResponse) => void
}

export const PackingList = ({
  items,
  onDelete,
  onEdit,
  onTogglePacked,
}: PackingListProps) => {
  return (
    <div className="item-list">
      {items.map((item) => (
        <article className="item-row" key={item.id}>
          <div className="item-row__main">
            <h2>{item.name}</h2>
            <p>Quantity: {item.quantity ?? 0}</p>
            <div className="item-row__meta">
              <Badge tone="info">{getPackingCategoryLabel(item.category)}</Badge>
              <Badge
                tone={
                  item.requiredStatus === RequiredStatus.REQUIRED
                    ? 'warning'
                    : 'neutral'
                }
              >
                {getRequiredStatusLabel(item.requiredStatus)}
              </Badge>
              <Badge
                tone={
                  item.packedStatus === PackedStatus.PACKED
                    ? 'success'
                    : 'neutral'
                }
              >
                {getPackedStatusLabel(item.packedStatus)}
              </Badge>
            </div>
          </div>
          <div className="item-row__actions">
            <Button
              type="button"
              variant={
                item.packedStatus === PackedStatus.PACKED
                  ? 'secondary'
                  : 'primary'
              }
              onClick={() => onTogglePacked(item)}
            >
              <Check size={15} />
              {item.packedStatus === PackedStatus.PACKED
                ? 'Mark unpacked'
                : 'Mark packed'}
            </Button>
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
      ))}
    </div>
  )
}
