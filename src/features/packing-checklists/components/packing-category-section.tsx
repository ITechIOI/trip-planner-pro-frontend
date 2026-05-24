import type { PackingItem } from '../types/packing-item'
import { PackingItemCard } from './packing-item-card'
import CheckroomIcon from '@mui/icons-material/Checkroom'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'

type PackingCategorySectionProps = {
  category: string
  items: PackingItem[]
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

export const PackingCategorySection = ({
  category,
  items,
  onTogglePacked,
  onDelete,
  onEdit,
}: PackingCategorySectionProps) => {
  const meta =
    categoryMeta[category as keyof typeof categoryMeta] ?? categoryMeta.OTHER
  const Icon = meta.Icon

  const packedCount = items.filter(
    (item) => item.packedStatus === 'PACKED',
  ).length

  const remaining = items.length - packedCount

  return (
    <section style={{ marginTop: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: meta.bg,
              color: meta.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </div>

          <div>
            <div style={{ fontWeight: 700 }}>{meta.label}</div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>
              {packedCount} of {items.length} packed
            </div>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #E5E7EB',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '12px',
            color: '#374151',
            background: '#FFFFFF',
          }}
        >
          {remaining} remaining
        </div>
      </div>

      {items.map((item) => (
        <PackingItemCard
          key={item.id}
          item={item}
          onTogglePacked={onTogglePacked}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </section>
  )
}
