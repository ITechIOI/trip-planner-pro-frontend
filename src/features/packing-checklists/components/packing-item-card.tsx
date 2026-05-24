import type { PackingItem } from '../types/packing-item'
import CheckIcon from '@mui/icons-material/Check'
import CheckroomIcon from '@mui/icons-material/Checkroom'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'

type PackingItemCardProps = {
  item: PackingItem
  onTogglePacked: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

const categoryMeta = {
  CLOTHES: {
    label: 'Clothes',
    Icon: CheckroomIcon,
    color: '#db2777',
    bg: '#fce7f3',
  },
  DOCUMENTS: {
    label: 'Documents',
    Icon: DescriptionOutlinedIcon,
    color: '#0284c7',
    bg: '#e0f2fe',
  },
  ELECTRONICS: {
    label: 'Electronics',
    Icon: DevicesOutlinedIcon,
    color: '#4f46e5',
    bg: '#e0e7ff',
  },
  MEDICINE: {
    label: 'Medicine',
    Icon: MedicationOutlinedIcon,
    color: '#e11d48',
    bg: '#ffe4e6',
  },
  PERSONAL: {
    label: 'Personal',
    Icon: PersonOutlinedIcon,
    color: '#0d9488',
    bg: '#ccfbf1',
  },
  OTHER: {
    label: 'Other',
    Icon: MoreHorizIcon,
    color: '#475569',
    bg: '#e2e8f0',
  },
} as const

const actionButtonStyle = {
  width: '34px',
  height: '34px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
}

export const PackingItemCard = ({
  item,
  onTogglePacked,
  onDelete,
  onEdit,
}: PackingItemCardProps) => {
  const isPacked = item.packedStatus === 'PACKED'
  const meta = categoryMeta[item.category]
  const CategoryIcon = meta.Icon

  return (
    <div
      style={{
        background: isPacked ? '#ECFDF5' : '#FFFFFF',
        borderRadius: '16px',
        padding: '18px 20px',
        marginTop: '14px',
        border: isPacked ? '1px solid #A7F3D0' : '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '18px',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          minWidth: 0,
        }}
      >
        <button
          onClick={() => onTogglePacked(item.id)}
          style={{
            width: '22px',
            height: '22px',
            flex: '0 0 22px',
            borderRadius: '999px',
            border: isPacked ? 'none' : '1px solid #D1D5DB',
            background: isPacked ? '#10B981' : '#FFFFFF',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isPacked ? 'Mark as unpacked' : 'Mark as packed'}
        >
          {isPacked ? <CheckIcon sx={{ fontSize: 15 }} /> : null}
        </button>

        <div
          style={{
            width: '36px',
            height: '36px',
            flex: '0 0 36px',
            borderRadius: '10px',
            background: meta.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: meta.color,
          }}
        >
          <CategoryIcon sx={{ fontSize: 20 }} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '6px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontWeight: 600,
                color: '#111827',
                textDecoration: isPacked ? 'line-through' : 'none',
              }}
            >
              {item.name}
            </span>

            {item.requiredStatus === 'REQUIRED' && (
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: '999px',
                  background: '#FFE4E6',
                  color: '#E11D48',
                  fontSize: '10px',
                  fontWeight: 700,
                }}
              >
                REQUIRED
              </span>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              color: '#6B7280',
              fontSize: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span>Qty: {item.quantity}</span>
            <span aria-hidden="true">/</span>
            <span>{meta.label}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        <button
          onClick={() => onEdit(item.id)}
          style={{
            ...actionButtonStyle,
            background: '#14B8A6',
            color: '#FFFFFF',
          }}
          aria-label="Edit item"
          title="Edit item"
        >
          <EditOutlinedIcon sx={{ fontSize: 18 }} />
        </button>

        <button
          onClick={() => onDelete(item.id)}
          style={{
            ...actionButtonStyle,
            background: 'transparent',
            color: '#DC2626',
          }}
          aria-label="Delete item"
          title="Delete item"
        >
          <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  )
}
