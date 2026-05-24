import type { ItineraryResponse } from '@/shared'

export const CALENDAR_PAGE_LIMIT = 50
export const MONTH_FORMAT_PATTERN = /^\d{4}-\d{2}$/

export type CalendarDay = {
  date: Date
  dateKey: string
  isCurrentMonth: boolean
}

const pad = (value: number) => String(value).padStart(2, '0')

const formatMonth = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const normalizeCalendarMonth = (value?: string | null) => {
  if (value && MONTH_FORMAT_PATTERN.test(value)) {
    return value
  }

  return formatMonth(new Date())
}

export const getCalendarMonthRange = (month: string) => {
  const normalizedMonth = normalizeCalendarMonth(month)
  const [year, monthNumber] = normalizedMonth.split('-').map(Number)
  const lastDay = new Date(year, monthNumber, 0).getDate()

  return {
    startTime: `${normalizedMonth}-01T00:00:00`,
    endTime: `${normalizedMonth}-${pad(lastDay)}T23:59:59`,
  }
}

export const shiftCalendarMonth = (month: string, delta: number) => {
  const normalizedMonth = normalizeCalendarMonth(month)
  const [year, monthNumber] = normalizedMonth.split('-').map(Number)
  const shifted = new Date(year, monthNumber - 1 + delta, 1)

  return formatMonth(shifted)
}

export const getItineraryCalendarDateKey = (item: ItineraryResponse) => {
  const value = item.startTime ?? item.endTime

  if (!value) {
    return undefined
  }

  return value.slice(0, 10)
}

export const groupItinerariesByDate = (items: ItineraryResponse[]) => {
  return items.reduce<Record<string, ItineraryResponse[]>>((groups, item) => {
    const dateKey = getItineraryCalendarDateKey(item)

    if (!dateKey) {
      return groups
    }

    groups[dateKey] = [...(groups[dateKey] ?? []), item]

    return groups
  }, {})
}

export const buildCalendarDays = (month: string): CalendarDay[] => {
  const normalizedMonth = normalizeCalendarMonth(month)
  const [year, monthNumber] = normalizedMonth.split('-').map(Number)
  const firstMonthDay = new Date(year, monthNumber - 1, 1)
  const firstGridDay = new Date(firstMonthDay)

  firstGridDay.setDate(firstMonthDay.getDate() - firstMonthDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDay)
    date.setDate(firstGridDay.getDate() + index)

    return {
      date,
      dateKey: formatDateKey(date),
      isCurrentMonth: date.getMonth() === firstMonthDay.getMonth(),
    }
  })
}
