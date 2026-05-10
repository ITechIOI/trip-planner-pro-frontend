import { Trash2 } from 'lucide-react'
import { PaymentStatus, type BudgetResponse } from '@/shared'
import { Badge, Button } from '@/shared/components/ui'
import {
  getBudgetCategoryLabel,
  getPaymentStatusLabel,
} from '@/shared/lib/domain'
import { formatCurrency } from '@/shared/lib/display'

type BudgetListProps = {
  items: BudgetResponse[]
  onDelete: (item: BudgetResponse) => void
  onEdit: (item: BudgetResponse) => void
  onTogglePayment: (item: BudgetResponse) => void
}

export const BudgetList = ({
  items,
  onDelete,
  onEdit,
  onTogglePayment,
}: BudgetListProps) => {
  return (
    <div className="item-list">
      {items.map((item) => (
        <article className="item-row" key={item.id}>
          <div className="item-row__main">
            <h2>{item.itemName}</h2>
            <p>
              {formatCurrency(item.actualCost)} actual from{' '}
              {formatCurrency(item.estimatedCost)} estimated
            </p>
            <div className="item-row__meta">
              <Badge tone="info">{getBudgetCategoryLabel(item.category)}</Badge>
              <Badge
                tone={
                  item.paymentStatus === PaymentStatus.PAID
                    ? 'success'
                    : 'warning'
                }
              >
                {getPaymentStatusLabel(item.paymentStatus)}
              </Badge>
            </div>
          </div>
          <div className="item-row__actions">
            <Button type="button" onClick={() => onTogglePayment(item)}>
              {item.paymentStatus === PaymentStatus.PAID
                ? 'Mark unpaid'
                : 'Mark paid'}
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
