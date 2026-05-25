import CheckroomIcon from '@mui/icons-material/Checkroom'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { PackingCategory } from '@/shared'
import type { PackingCategory as PackingCategoryValue } from '@/shared'

export type PackingCategoryMeta = {
  label: string
  Icon: SvgIconComponent
  color: string
  bg: string
}

export const PACKING_CATEGORIES = Object.values(
  PackingCategory,
) as PackingCategoryValue[]

export const PACKING_CATEGORY_META: Record<
  PackingCategoryValue,
  PackingCategoryMeta
> = {
  [PackingCategory.CLOTHES]: {
    label: 'Clothes',
    Icon: CheckroomIcon,
    color: '#db2777',
    bg: '#fce7f3',
  },
  [PackingCategory.DOCUMENTS]: {
    label: 'Documents',
    Icon: DescriptionOutlinedIcon,
    color: '#0284c7',
    bg: '#e0f2fe',
  },
  [PackingCategory.ELECTRONICS]: {
    label: 'Electronics',
    Icon: DevicesOutlinedIcon,
    color: '#4f46e5',
    bg: '#e0e7ff',
  },
  [PackingCategory.MEDICINE]: {
    label: 'Medicine',
    Icon: MedicationOutlinedIcon,
    color: '#e11d48',
    bg: '#ffe4e6',
  },
  [PackingCategory.PERSONAL]: {
    label: 'Personal',
    Icon: PersonOutlinedIcon,
    color: '#0d9488',
    bg: '#ccfbf1',
  },
  [PackingCategory.OTHER]: {
    label: 'Other',
    Icon: MoreHorizIcon,
    color: '#475569',
    bg: '#e2e8f0',
  },
}

export const PACKING_CATEGORY_OPTIONS = PACKING_CATEGORIES.map((category) => ({
  value: category,
  label: PACKING_CATEGORY_META[category].label,
}))

export const getPackingCategoryMeta = (category: PackingCategoryValue) =>
  PACKING_CATEGORY_META[category] ?? PACKING_CATEGORY_META[PackingCategory.OTHER]
