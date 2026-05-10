export const ACCESS_TOKEN = 'mock-access-token'
export const FIXED_NOW_ISO = '2026-06-12T12:00:00+07:00'

export type WarningLevel = 'SAFE' | 'WARNING' | 'CRITICAL'

export type Trip = {
  id: number
  name: string
  estimatedBudget: number
  startDate: string | null
  endDate: string | null
}

export type Itinerary = {
  id: number
  tripId: number
  activityTitle: string
  location: string | null
  startTime: string | null
  endTime: string | null
  category: string
  status: string
  priority: string
}

export type PackingItem = {
  id: number
  tripId: number
  name: string
  quantity: number
  category: string
  requiredStatus: string
  packedStatus: string
}

export type BudgetItem = {
  id: number
  tripId: number
  itemName: string
  category: string
  estimatedCost: number
  actualCost: number | null
  paymentStatus: string
}

export type PageResponse<T> = {
  items: T[]
  offset: number
  limit: number
  total: number
}

export type TestData = {
  trips: Trip[]
  itineraries: Itinerary[]
  packingItems: PackingItem[]
  budgetItems: BudgetItem[]
}

export type MockApiRequests = {
  tripsQuery: string[]
  itineraryQuery: string[]
  packingQuery: string[]
  budgetQuery: string[]
}

export type MockApiState = {
  data: TestData
  requests: MockApiRequests
}

export const createTrip = (overrides: Partial<Trip> = {}): Trip => ({
  id: 1,
  name: 'Da Nang Family Trip',
  estimatedBudget: 12_000_000,
  startDate: '2026-06-10',
  endDate: '2026-06-14',
  ...overrides,
})

export const createItinerary = (
  overrides: Partial<Itinerary> = {},
): Itinerary => ({
  id: 101,
  tripId: 1,
  activityTitle: 'Flight to Da Nang',
  location: 'Tan Son Nhat Airport',
  startTime: '2026-06-10T08:00:00',
  endTime: '2026-06-10T09:30:00',
  category: 'TRANSPORT',
  status: 'DONE',
  priority: 'HIGH',
  ...overrides,
})

export const createPackingItem = (
  overrides: Partial<PackingItem> = {},
): PackingItem => ({
  id: 201,
  tripId: 1,
  name: 'Passport',
  quantity: 4,
  category: 'DOCUMENTS',
  requiredStatus: 'REQUIRED',
  packedStatus: 'PACKED',
  ...overrides,
})

export const createBudgetItem = (
  overrides: Partial<BudgetItem> = {},
): BudgetItem => ({
  id: 301,
  tripId: 1,
  itemName: 'Flight tickets',
  category: 'TRANSPORT',
  estimatedCost: 4_000_000,
  actualCost: 4_200_000,
  paymentStatus: 'PAID',
  ...overrides,
})

export const createTestData = (): TestData => ({
  trips: [
    createTrip(),
    createTrip({
      id: 2,
      name: 'Empty Beach Weekend',
      estimatedBudget: 5_000_000,
      startDate: '2026-07-01',
      endDate: '2026-07-03',
    }),
    createTrip({
      id: 3,
      name: 'Warning Budget Trip',
      estimatedBudget: 1_000_000,
      startDate: '2026-08-01',
      endDate: '2026-08-04',
    }),
    createTrip({
      id: 4,
      name: 'Critical Budget Trip',
      estimatedBudget: 1_000_000,
      startDate: '2026-09-01',
      endDate: '2026-09-04',
    }),
  ],
  itineraries: [
    createItinerary(),
    createItinerary({
      id: 102,
      activityTitle: 'Hotel check-in',
      location: 'Han River Hotel',
      startTime: '2026-06-10T14:00:00',
      endTime: '2026-06-10T15:00:00',
      category: 'HOTEL',
      status: 'PLANNED',
      priority: 'MEDIUM',
    }),
    createItinerary({
      id: 103,
      activityTitle: 'Dinner reservation',
      location: 'Beach seafood restaurant',
      startTime: '2026-06-10T19:00:00',
      endTime: '2026-06-10T20:30:00',
      category: 'FOOD',
      status: 'PLANNED',
      priority: 'MEDIUM',
    }),
    createItinerary({
      id: 104,
      activityTitle: 'Dragon Bridge visit',
      location: 'Dragon Bridge',
      startTime: '2026-06-11T20:00:00',
      endTime: '2026-06-11T21:00:00',
      category: 'SIGHTSEEING',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
    }),
    createItinerary({
      id: 105,
      activityTitle: 'Museum morning',
      location: 'Cham Museum',
      startTime: '2026-06-13T09:00:00',
      endTime: '2026-06-13T11:00:00',
      category: 'SIGHTSEEING',
      status: 'PLANNED',
      priority: 'LOW',
    }),
  ],
  packingItems: [
    createPackingItem(),
    createPackingItem({
      id: 202,
      name: 'T-shirts',
      quantity: 8,
      category: 'CLOTHES',
      packedStatus: 'NOT_PACKED',
    }),
    createPackingItem({
      id: 203,
      name: 'Phone charger',
      quantity: 2,
      category: 'ELECTRONICS',
      requiredStatus: 'OPTIONAL',
      packedStatus: 'PACKED',
    }),
  ],
  budgetItems: [
    createBudgetItem(),
    createBudgetItem({
      id: 302,
      itemName: 'Hotel rooms',
      category: 'ACCOMMODATION',
      estimatedCost: 3_000_000,
      actualCost: null,
      paymentStatus: 'UNPAID',
    }),
    createBudgetItem({
      id: 303,
      itemName: 'Family meals',
      category: 'FOOD',
      estimatedCost: 2_000_000,
      actualCost: 1_800_000,
      paymentStatus: 'PAID',
    }),
    createBudgetItem({
      id: 304,
      tripId: 3,
      itemName: 'Warning hotel deposit',
      category: 'ACCOMMODATION',
      estimatedCost: 800_000,
      actualCost: 850_000,
      paymentStatus: 'PAID',
    }),
    createBudgetItem({
      id: 305,
      tripId: 4,
      itemName: 'Critical transport booking',
      category: 'TRANSPORT',
      estimatedCost: 1_100_000,
      actualCost: 1_100_000,
      paymentStatus: 'PAID',
    }),
  ],
})

export const createMockApiState = (data = createTestData()): MockApiState => ({
  data,
  requests: {
    tripsQuery: [],
    itineraryQuery: [],
    packingQuery: [],
    budgetQuery: [],
  },
})

export const getTripId = (pathname: string) => {
  const match = pathname.match(/\/api\/v1\/trips\/(\d+)/)
  return match ? Number(match[1]) : undefined
}

export const getNestedId = (pathname: string) => {
  const match = pathname.match(/\/(\d+)$/)
  return match ? Number(match[1]) : undefined
}

export const pageItems = <T>(items: T[], url: URL): PageResponse<T> => {
  const offset = Math.max(0, Number(url.searchParams.get('offset') ?? 0))
  const limit = Math.min(
    50,
    Math.max(1, Number(url.searchParams.get('limit') ?? 50)),
  )

  return {
    items: items.slice(offset, offset + limit),
    offset,
    limit,
    total: items.length,
  }
}

export const nextId = <T extends { id: number }>(items: T[]) =>
  Math.max(0, ...items.map((item) => item.id)) + 1

const contains = (value: string | null | undefined, search: string) =>
  (value ?? '').toLowerCase().includes(search.toLowerCase())

export const applyTripFilters = (trips: Trip[], url: URL) => {
  const search = url.searchParams.get('search')?.trim()

  return search ? trips.filter((trip) => contains(trip.name, search)) : trips
}

export const applyItineraryFilters = (items: Itinerary[], url: URL) => {
  const search = url.searchParams.get('search')?.trim()
  const category = url.searchParams.get('category')
  const status = url.searchParams.get('status')
  const priority = url.searchParams.get('priority')
  const startTime = url.searchParams.get('startTime')
  const endTime = url.searchParams.get('endTime')

  return items.filter((item) => {
    if (search && !contains(item.activityTitle, search) && !contains(item.location, search)) {
      return false
    }

    if (category && item.category !== category) {
      return false
    }

    if (status && item.status !== status) {
      return false
    }

    if (priority && item.priority !== priority) {
      return false
    }

    if (startTime && (item.startTime ?? '') < startTime) {
      return false
    }

    if (endTime && (item.startTime ?? '') > endTime) {
      return false
    }

    return true
  })
}

export const applyPackingFilters = (items: PackingItem[], url: URL) => {
  const search = url.searchParams.get('search')?.trim()
  const category = url.searchParams.get('category')
  const packedStatus = url.searchParams.get('packedStatus')

  return items.filter((item) => {
    if (search && !contains(item.name, search)) {
      return false
    }

    if (category && item.category !== category) {
      return false
    }

    if (packedStatus && item.packedStatus !== packedStatus) {
      return false
    }

    return true
  })
}

export const applyBudgetFilters = (items: BudgetItem[], url: URL) => {
  const search = url.searchParams.get('search')?.trim()
  const category = url.searchParams.get('category')
  const paymentStatus = url.searchParams.get('paymentStatus')

  return items.filter((item) => {
    if (search && !contains(item.itemName, search)) {
      return false
    }

    if (category && item.category !== category) {
      return false
    }

    if (paymentStatus && item.paymentStatus !== paymentStatus) {
      return false
    }

    return true
  })
}

export const computeBudgetSummary = (tripId: number, data: TestData) => {
  const trip = data.trips.find((item) => item.id === tripId)
  const budgetItems = data.budgetItems.filter((item) => item.tripId === tripId)
  const initialBudget = trip?.estimatedBudget ?? 0
  const totalEstimatedCost = budgetItems.reduce(
    (sum, item) => sum + (item.estimatedCost ?? 0),
    0,
  )
  const totalActualCost = budgetItems.reduce(
    (sum, item) => sum + (item.actualCost ?? 0),
    0,
  )
  const budgetUsagePercent = initialBudget
    ? Math.round((totalActualCost / initialBudget) * 100)
    : 0
  const warningLevel: WarningLevel =
    budgetUsagePercent >= 100
      ? 'CRITICAL'
      : budgetUsagePercent >= 80
        ? 'WARNING'
        : 'SAFE'
  const categories = Array.from(new Set(budgetItems.map((item) => item.category)))

  return {
    initialBudget,
    totalEstimatedCost,
    totalActualCost,
    remainingBudget: initialBudget - totalActualCost,
    actualMinusEstimatedCost: totalActualCost - totalEstimatedCost,
    budgetUsagePercent,
    warningLevel,
    categorySummaries: categories.map((category) => {
      const categoryItems = budgetItems.filter((item) => item.category === category)

      return {
        category,
        totalEstimatedCost: categoryItems.reduce(
          (sum, item) => sum + (item.estimatedCost ?? 0),
          0,
        ),
        totalActualCost: categoryItems.reduce(
          (sum, item) => sum + (item.actualCost ?? 0),
          0,
        ),
      }
    }),
  }
}

export const computeDashboard = (tripId: number, data: TestData) => {
  const itineraries = data.itineraries.filter((item) => item.tripId === tripId)
  const packingItems = data.packingItems.filter((item) => item.tripId === tripId)
  const budgetSummary = computeBudgetSummary(tripId, data)
  const doneItineraries = itineraries.filter((item) => item.status === 'DONE').length
  const packedItems = packingItems.filter((item) => item.packedStatus === 'PACKED').length
  const overdueItems = itineraries.filter(
    (item) =>
      item.status !== 'DONE' &&
      item.endTime !== null &&
      item.endTime < '2026-06-12T12:00:00',
  )
  const dates = Array.from(
    new Set(
      itineraries
        .map((item) => item.startTime?.slice(0, 10))
        .filter((date): date is string => Boolean(date)),
    ),
  ).sort()

  return {
    itineraryProgress: {
      total: itineraries.length,
      done: doneItineraries,
      percent: itineraries.length
        ? Math.round((doneItineraries / itineraries.length) * 100)
        : 0,
    },
    packingProgress: {
      total: packingItems.length,
      packed: packedItems,
      percent: packingItems.length
        ? Math.round((packedItems / packingItems.length) * 100)
        : 0,
    },
    budgetUsage: {
      initialBudget: budgetSummary.initialBudget,
      totalActualCost: budgetSummary.totalActualCost,
      percent: budgetSummary.budgetUsagePercent,
      warningLevel: budgetSummary.warningLevel,
    },
    unpaidBudgetItemCount: data.budgetItems.filter(
      (item) => item.tripId === tripId && item.paymentStatus === 'UNPAID',
    ).length,
    overdueActivityCount: overdueItems.length,
    itinerariesByDate: dates.map((date) => ({
      date,
      items: itineraries.filter((item) => item.startTime?.startsWith(date)),
    })),
  }
}
