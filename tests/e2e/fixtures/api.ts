import type { Page, Route } from '@playwright/test'
import {
  ACCESS_TOKEN,
  applyBudgetFilters,
  applyItineraryFilters,
  applyPackingFilters,
  applyTripFilters,
  computeBudgetSummary,
  computeDashboard,
  createMockApiState,
  createTestData,
  getNestedId,
  getTripId,
  nextId,
  pageItems,
  type BudgetItem,
  type Itinerary,
  type MockApiState,
  type PackingItem,
  type TestData,
  type Trip,
} from './data'
import { freezeBrowserTime } from './visual'

type MockApiOptions = {
  data?: TestData
}

const readJsonBody = async <T>(route: Route): Promise<T> => {
  const raw = route.request().postData()

  return raw ? (JSON.parse(raw) as T) : ({} as T)
}

const respondJson = async (route: Route, body: unknown, status = 200) => {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: status === 204 ? undefined : JSON.stringify(body),
  })
}

export const installMockApi = async (
  page: Page,
  options: MockApiOptions = {},
): Promise<MockApiState> => {
  await freezeBrowserTime(page)

  const state = createMockApiState(options.data ?? createTestData())

  await page.route('**/api/v1/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const { pathname } = url
    const method = request.method()
    const tripId = getTripId(pathname)

    if (method === 'POST' && pathname === '/api/v1/auth/login') {
      const body = await readJsonBody<{ username?: string; password?: string }>(
        route,
      )

      if (body.username?.includes('wrong') || body.password?.includes('wrong')) {
        await respondJson(route, { message: 'Unauthorized' }, 401)
        return
      }

      await respondJson(route, { accessToken: ACCESS_TOKEN })
      return
    }

    if (method === 'POST' && pathname === '/api/v1/auth/register') {
      await respondJson(route, { accessToken: ACCESS_TOKEN })
      return
    }

    if (
      method === 'GET' &&
      (pathname === '/api/v1/trips' || pathname === '/api/v1/trips/query')
    ) {
      state.requests.tripsQuery.push(request.url())
      await respondJson(
        route,
        pageItems(applyTripFilters(state.data.trips, url), url),
      )
      return
    }

    if (method === 'POST' && pathname === '/api/v1/trips') {
      const body = await readJsonBody<Partial<Trip>>(route)
      const trip = {
        id: nextId(state.data.trips),
        name: body.name ?? 'Untitled trip',
        estimatedBudget: body.estimatedBudget ?? 0,
        startDate: body.startDate ?? null,
        endDate: body.endDate ?? null,
      }

      state.data.trips.unshift(trip)
      await respondJson(route, trip, 201)
      return
    }

    if (tripId && method === 'GET' && pathname === `/api/v1/trips/${tripId}`) {
      await respondJson(route, state.data.trips.find((item) => item.id === tripId))
      return
    }

    if (
      tripId &&
      (method === 'PATCH' || method === 'PUT') &&
      pathname === `/api/v1/trips/${tripId}`
    ) {
      const body = await readJsonBody<Partial<Trip>>(route)
      const index = state.data.trips.findIndex((item) => item.id === tripId)

      if (index >= 0) {
        state.data.trips[index] = { ...state.data.trips[index], ...body }
      }

      await respondJson(route, state.data.trips[index])
      return
    }

    if (tripId && method === 'DELETE' && pathname === `/api/v1/trips/${tripId}`) {
      state.data.trips = state.data.trips.filter((item) => item.id !== tripId)
      await respondJson(route, null, 204)
      return
    }

    if (
      tripId &&
      method === 'GET' &&
      pathname === `/api/v1/trips/${tripId}/dashboard`
    ) {
      await respondJson(route, computeDashboard(tripId, state.data))
      return
    }

    if (
      tripId &&
      method === 'GET' &&
      pathname === `/api/v1/trips/${tripId}/itineraries/query`
    ) {
      state.requests.itineraryQuery.push(request.url())
      await respondJson(
        route,
        pageItems(
          applyItineraryFilters(
            state.data.itineraries.filter((item) => item.tripId === tripId),
            url,
          ),
          url,
        ),
      )
      return
    }

    if (
      tripId &&
      method === 'POST' &&
      pathname === `/api/v1/trips/${tripId}/itineraries`
    ) {
      const body = await readJsonBody<Partial<Itinerary>>(route)
      const item = {
        id: nextId(state.data.itineraries),
        tripId,
        activityTitle: body.activityTitle ?? 'Untitled activity',
        location: body.location ?? null,
        startTime: body.startTime ?? null,
        endTime: body.endTime ?? null,
        category: body.category ?? 'OTHER',
        status: body.status ?? 'PLANNED',
        priority: body.priority ?? 'MEDIUM',
      }

      state.data.itineraries.push(item)
      await respondJson(route, item, 201)
      return
    }

    if (
      tripId &&
      pathname.startsWith(`/api/v1/trips/${tripId}/itineraries/`) &&
      (method === 'PATCH' || method === 'PUT')
    ) {
      const itineraryId = getNestedId(pathname)
      const body = await readJsonBody<Partial<Itinerary>>(route)
      const index = state.data.itineraries.findIndex(
        (item) => item.id === itineraryId,
      )

      if (index >= 0) {
        state.data.itineraries[index] = { ...state.data.itineraries[index], ...body }
      }

      await respondJson(route, state.data.itineraries[index])
      return
    }

    if (
      tripId &&
      pathname.startsWith(`/api/v1/trips/${tripId}/itineraries/`) &&
      method === 'DELETE'
    ) {
      const itineraryId = getNestedId(pathname)
      state.data.itineraries = state.data.itineraries.filter(
        (item) => item.id !== itineraryId,
      )
      await respondJson(route, null, 204)
      return
    }

    if (
      tripId &&
      method === 'GET' &&
      pathname === `/api/v1/trips/${tripId}/packing-checklists/query`
    ) {
      state.requests.packingQuery.push(request.url())
      await respondJson(
        route,
        pageItems(
          applyPackingFilters(
            state.data.packingItems.filter((item) => item.tripId === tripId),
            url,
          ),
          url,
        ),
      )
      return
    }

    if (
      tripId &&
      method === 'POST' &&
      pathname === `/api/v1/trips/${tripId}/packing-checklists`
    ) {
      const body = await readJsonBody<Partial<PackingItem>>(route)
      const item = {
        id: nextId(state.data.packingItems),
        tripId,
        name: body.name ?? 'Untitled item',
        quantity: body.quantity ?? 1,
        category: body.category ?? 'OTHER',
        requiredStatus: body.requiredStatus ?? 'REQUIRED',
        packedStatus: body.packedStatus ?? 'NOT_PACKED',
      }

      state.data.packingItems.push(item)
      await respondJson(route, item, 201)
      return
    }

    if (
      tripId &&
      pathname.startsWith(`/api/v1/trips/${tripId}/packing-checklists/`) &&
      (method === 'PATCH' || method === 'PUT')
    ) {
      const checklistId = getNestedId(pathname)
      const body = await readJsonBody<Partial<PackingItem>>(route)
      const index = state.data.packingItems.findIndex(
        (item) => item.id === checklistId,
      )

      if (index >= 0) {
        state.data.packingItems[index] = { ...state.data.packingItems[index], ...body }
      }

      await respondJson(route, state.data.packingItems[index])
      return
    }

    if (
      tripId &&
      pathname.startsWith(`/api/v1/trips/${tripId}/packing-checklists/`) &&
      method === 'DELETE'
    ) {
      const checklistId = getNestedId(pathname)
      state.data.packingItems = state.data.packingItems.filter(
        (item) => item.id !== checklistId,
      )
      await respondJson(route, null, 204)
      return
    }

    if (
      tripId &&
      method === 'GET' &&
      pathname === `/api/v1/trips/${tripId}/budgets/query`
    ) {
      state.requests.budgetQuery.push(request.url())
      await respondJson(
        route,
        pageItems(
          applyBudgetFilters(
            state.data.budgetItems.filter((item) => item.tripId === tripId),
            url,
          ),
          url,
        ),
      )
      return
    }

    if (
      tripId &&
      method === 'GET' &&
      pathname === `/api/v1/trips/${tripId}/budgets/summary`
    ) {
      await respondJson(route, computeBudgetSummary(tripId, state.data))
      return
    }

    if (
      tripId &&
      method === 'POST' &&
      pathname === `/api/v1/trips/${tripId}/budgets`
    ) {
      const body = await readJsonBody<Partial<BudgetItem>>(route)
      const item = {
        id: nextId(state.data.budgetItems),
        tripId,
        itemName: body.itemName ?? 'Untitled cost',
        category: body.category ?? 'OTHER',
        estimatedCost: body.estimatedCost ?? 0,
        actualCost: body.actualCost ?? null,
        paymentStatus: body.paymentStatus ?? 'UNPAID',
      }

      state.data.budgetItems.push(item)
      await respondJson(route, item, 201)
      return
    }

    if (
      tripId &&
      pathname.startsWith(`/api/v1/trips/${tripId}/budgets/`) &&
      (method === 'PATCH' || method === 'PUT')
    ) {
      const budgetId = getNestedId(pathname)
      const body = await readJsonBody<Partial<BudgetItem>>(route)
      const index = state.data.budgetItems.findIndex(
        (item) => item.id === budgetId,
      )

      if (index >= 0) {
        state.data.budgetItems[index] = { ...state.data.budgetItems[index], ...body }
      }

      await respondJson(route, state.data.budgetItems[index])
      return
    }

    if (
      tripId &&
      pathname.startsWith(`/api/v1/trips/${tripId}/budgets/`) &&
      method === 'DELETE'
    ) {
      const budgetId = getNestedId(pathname)
      state.data.budgetItems = state.data.budgetItems.filter(
        (item) => item.id !== budgetId,
      )
      await respondJson(route, null, 204)
      return
    }

    await respondJson(
      route,
      { message: `Unhandled mock route: ${method} ${pathname}` },
      404,
    )
  })

  return state
}
