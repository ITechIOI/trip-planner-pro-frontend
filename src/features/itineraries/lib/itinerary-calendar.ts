import dayjs, { type Dayjs } from 'dayjs'
import type { ItineraryResponse } from '@/shared'

export const CALENDAR_PAGE_LIMIT = 50
export const MONTH_FORMAT = 'YYYY-MM'

export type CalendarDay = {
  date: Dayjs
  dateKey: string
  isCurrentMonth: boolean
}

export const normalizeCalendarMonth = (value?: string | null) => {
  const parsed = value ? dayjs(`${value}-01`) : dayjs()

  return parsed.isValid() ? parsed.format(MONTH_FORMAT) : dayjs().format(MONTH_FORMAT)
}

export const getCalendarMonthRange = (month: string) => {
  const currentMonth = dayjs(`${normalizeCalendarMonth(month)}-01`)

  return {
    startTime: currentMonth.startOf('month').format('YYYY-MM-DDT00:00:00'),
    endTime: currentMonth.endOf('month').format('YYYY-MM-DDT23:59:59'),
  }
}

export const shiftCalendarMonth = (month: string, delta: number) => {
  const currentMonth = dayjs(`${normalizeCalendarMonth(month)}-01`)

  return currentMonth.add(delta, 'month').format(MONTH_FORMAT)
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
  const currentMonth = dayjs(`${normalizeCalendarMonth(month)}-01`)
  const firstGridDay = currentMonth.startOf('month').startOf('week')

  return Array.from({ length: 42 }, (_, index) => {
    const date = firstGridDay.add(index, 'day')

    return {
      date,
      dateKey: date.format('YYYY-MM-DD'),
      isCurrentMonth: date.month() === currentMonth.month(),
    }
  })
}
