import type { PackingItem } from '../types/packing-item'
import CheckroomIcon from '@mui/icons-material/Checkroom'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'

type PackingCategoryProgressProps = {
  items: PackingItem[]
}

const categoryMeta = {
  CLOTHES: { label: 'Clothes', Icon: CheckroomIcon, color: '#db2777', bg: '#fce7f3' },
  DOCUMENTS: { label: 'Documents', Icon: DescriptionOutlinedIcon, color: '#0284c7', bg: '#e0f2fe' },
  ELECTRONICS: {
    label: 'Electronics',
    Icon: DevicesOutlinedIcon,
    color: '#4f46e5',
    bg: '#e0e7ff',
  },
  MEDICINE: { label: 'Medicine', Icon: MedicationOutlinedIcon, color: '#e11d48', bg: '#ffe4e6' },
  PERSONAL: { label: 'Personal', Icon: PersonOutlinedIcon, color: '#0d9488', bg: '#ccfbf1' },
  OTHER: { label: 'Other', Icon: MoreHorizIcon, color: '#475569', bg: '#e2e8f0' },
} as const

export const PackingCategoryProgress = ({
  items,
}: PackingCategoryProgressProps) => {
  const categoryProgress = Object.keys(categoryMeta).map((category) => {
    const categoryItems = items.filter((item) => item.category === category)

    return {
      category: category as keyof typeof categoryMeta,
      total: categoryItems.length,
      packed: categoryItems.filter((item) => item.packedStatus === 'PACKED')
        .length,
    }
  })

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
        gap: '12px',
        marginBottom: '22px',
      }}
    >
      {categoryProgress.map((item) => {
        const percentage =
          item.total === 0 ? 0 : (item.packed / item.total) * 100
        const meta = categoryMeta[item.category]
        const Icon = meta.Icon

        return (
          <div
            key={item.category}
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '14px',
              border: '1px solid #E6ECF3',
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 8px',
                background: meta.bg,
                color: meta.color,
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </div>

            <div
              style={{
                color: '#475569',
                fontSize: '12px',
                textAlign: 'center',
              }}
            >
              {meta.label}
            </div>

            <div
              style={{
                color: '#0F172A',
                fontSize: '14px',
                fontWeight: 700,
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              {item.packed}/{item.total}
            </div>

            <div
              style={{
                height: '4px',
                background: '#D7E9FA',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: '#0B84E5',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
