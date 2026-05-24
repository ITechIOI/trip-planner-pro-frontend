import CloseIcon from '@mui/icons-material/Close'
import type {
  PackingCategory,
  PackingItem,
  RequiredStatus,
} from '../types/packing-item'

type PackingItemModalProps = {
  isOpen: boolean
  mode: 'add' | 'edit'
  editingItem?: PackingItem | null
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (values: {
    name: string
    category: PackingCategory
    quantity: number
    requiredStatus: RequiredStatus
  }) => void
}

export const PackingItemModal = ({
  isOpen,
  mode,
  editingItem,
  isSubmitting = false,
  onClose,
  onSubmit,
}: PackingItemModalProps) => {
  if (!isOpen) return null

  const title = mode === 'add' ? 'Add Packing Item' : 'Edit Packing Item'
  const submitLabel = mode === 'add' ? 'Add Item' : 'Save Changes'
  const defaultName = mode === 'edit' ? editingItem?.name ?? '' : ''
  const defaultCategory =
    mode === 'edit' ? editingItem?.category ?? 'OTHER' : 'OTHER'
  const defaultQuantity = mode === 'edit' ? editingItem?.quantity ?? 1 : 1
  const defaultRequiredStatus =
    mode === 'edit' ? editingItem?.requiredStatus ?? 'OPTIONAL' : 'OPTIONAL'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <form
        key={`${mode}-${editingItem?.id ?? 'new'}`}
        onSubmit={(event) => {
          event.preventDefault()

          const formData = new FormData(event.currentTarget)
          const name = String(formData.get('name') ?? '').trim()

          if (!name) return

          onSubmit({
            name,
            category: String(formData.get('category')) as PackingCategory,
            quantity: Number(formData.get('quantity')) || 1,
            requiredStatus: String(
              formData.get('requiredStatus'),
            ) as RequiredStatus,
          })
        }}
        style={{
          width: '420px',
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '24px',
          boxShadow: '0 20px 60px rgba(15,23,42,0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '18px',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 700,
              }}
            >
              {title}
            </h2>
            <p
              style={{
                margin: '6px 0 0',
                color: '#6B7280',
                fontSize: '13px',
              }}
            >
              Add or update an item to your packing list.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              cursor: 'pointer',
              color: '#6B7280',
              display: 'grid',
              placeItems: 'center',
            }}
            title="Close"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '6px',
            }}
          >
            Item Name *
          </label>
          <input
            name="name"
            placeholder="e.g., Passport, T-Shirts, Sunscreen"
            defaultValue={defaultName}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '14px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              Category
            </label>
            <select
              name="category"
              defaultValue={defaultCategory}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
              }}
            >
              <option value="CLOTHES">Clothes</option>
              <option value="DOCUMENTS">Documents</option>
              <option value="ELECTRONICS">Electronics</option>
              <option value="MEDICINE">Medicine</option>
              <option value="PERSONAL">Personal</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              Quantity *
            </label>
            <input
              name="quantity"
              type="number"
              min={1}
              defaultValue={defaultQuantity}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '6px',
            }}
          >
            Importance
          </label>
          <select
            name="requiredStatus"
            defaultValue={defaultRequiredStatus}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
            }}
          >
            <option value="REQUIRED">Required - Must bring</option>
            <option value="OPTIONAL">Optional</option>
          </select>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              background: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
