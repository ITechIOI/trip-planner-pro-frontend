import { delay, http, HttpResponse } from 'msw'
import {
  ACCESS_TOKEN,
  applyBudgetFilters,
  applyItineraryFilters,
  applyPackingFilters,
  applyTripFilters,
  computeBudgetSummary,
  computeDashboard,
  createMockApiState,
  createUser,
  findUserById,
  createTestData,
  getNestedId,
  nextId,
  pageItems,
  type BudgetItem,
  type Itinerary,
  type MockApiState,
  type PackingItem,
  type TestData,
  type Trip,
  type TripMember,
  type User,
} from '../shared/mock-api'

type MockOperation =
  | 'login'
  | 'register'
  | 'user'
  | 'trips'
  | 'trip'
  | 'dashboard'
  | 'tripMembers'
  | 'itineraries'
  | 'packing'
  | 'budgets'
  | 'budgetSummary'

type MockApiScenario = {
  latencyMs?: number
  statusByOperation?: Partial<Record<MockOperation, number>>
}

type JsonBody = Parameters<typeof HttpResponse.json>[0]

let state = createMockApiState()
let scenario: MockApiScenario = {}

export const resetMockApi = ({
  data = createTestData(),
  nextScenario = {},
}: {
  data?: TestData
  nextScenario?: MockApiScenario
} = {}) => {
  state = createMockApiState(data)
  scenario = nextScenario
}

export const configureMockApi = ({
  data,
  nextScenario = {},
}: {
  data?: TestData
  nextScenario?: MockApiScenario
} = {}) => {
  resetMockApi({ data: data ?? createTestData(), nextScenario })
  return state
}

export const getMockApiState = (): MockApiState => state

const maybeDelay = async () => {
  if (scenario.latencyMs) {
    await delay(scenario.latencyMs)
  }
}

const maybeScenarioResponse = async (operation: MockOperation) => {
  await maybeDelay()

  const status = scenario.statusByOperation?.[operation]

  return status
    ? HttpResponse.json({ message: `${operation} failed` }, { status })
    : undefined
}

const readJsonBody = async <T>(request: Request): Promise<T> => {
  try {
    return (await request.json()) as T
  } catch {
    return {} as T
  }
}

const jsonResponse = async (body: JsonBody, status = 200) => {
  await maybeDelay()
  return HttpResponse.json(body, { status })
}

const emptyResponse = async (status = 204) => {
  await maybeDelay()
  return new HttpResponse(null, { status })
}

export const handlers = [
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const scenarioResponse = await maybeScenarioResponse('login')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const body = await readJsonBody<{ username?: string; password?: string }>(
      request,
    )

    if (body.username?.includes('wrong') || body.password?.includes('wrong')) {
      return jsonResponse({ message: 'Unauthorized' }, 401)
    }

    return jsonResponse({ accessToken: ACCESS_TOKEN })
  }),

  http.post('*/api/v1/auth/register', async () => {
    const scenarioResponse = await maybeScenarioResponse('register')

    return scenarioResponse ?? jsonResponse({ accessToken: ACCESS_TOKEN })
  }),

  http.get('*/api/v1/users/me', async () => {
    const scenarioResponse = await maybeScenarioResponse('user')

    return scenarioResponse ?? jsonResponse(state.data.currentUser)
  }),

  http.patch('*/api/v1/users/me/avatar', async ({ request }) => {
    const scenarioResponse = await maybeScenarioResponse('user')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const fileName = file instanceof File ? file.name : 'avatar.png'

    state.data.currentUser = {
      ...state.data.currentUser,
      avatarUrl: `https://cdn.example.test/${fileName}`,
    }
    state.requests.userRequestOrder.push('avatar')
    state.requests.userAvatarUploads.push(state.data.currentUser)

    return jsonResponse(state.data.currentUser)
  }),

  http.patch('*/api/v1/users/me/profile', async ({ request }) => {
    const scenarioResponse = await maybeScenarioResponse('user')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const body = await readJsonBody<Partial<User>>(request)
    state.requests.userProfileUpdateBodies.push(body)
    state.data.currentUser = {
      ...state.data.currentUser,
      ...body,
    }
    state.requests.userRequestOrder.push('profile')
    state.requests.userProfileUpdates.push(state.data.currentUser)

    return jsonResponse(state.data.currentUser)
  }),

  http.get('*/api/v1/users/:userId', async ({ params }) => {
    const scenarioResponse = await maybeScenarioResponse('user')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const user = findUserById(state.data, Number(params.userId))

    return user ? jsonResponse(user) : jsonResponse({ message: 'Not found' }, 404)
  }),

  http.get('*/api/v1/trips', async ({ request }) => {
    const scenarioResponse = await maybeScenarioResponse('trips')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const url = new URL(request.url)
    state.requests.tripsQuery.push(request.url)

    return jsonResponse(pageItems(applyTripFilters(state.data.trips, url), url))
  }),

  http.get('*/api/v1/trips/query', async ({ request }) => {
    const scenarioResponse = await maybeScenarioResponse('trips')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const url = new URL(request.url)
    state.requests.tripsQuery.push(request.url)

    return jsonResponse(pageItems(applyTripFilters(state.data.trips, url), url))
  }),

  http.post('*/api/v1/trips', async ({ request }) => {
    const scenarioResponse = await maybeScenarioResponse('trips')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const body = await readJsonBody<Partial<Trip>>(request)
    state.requests.tripCreates.push(body)
    const trip = {
      id: nextId(state.data.trips),
      name: body.name ?? 'Untitled trip',
      estimatedBudget: body.estimatedBudget ?? 0,
      ownerId: state.data.currentUser.id,
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
    }

    state.data.trips.unshift(trip)

    return jsonResponse(trip, 201)
  }),

  http.get('*/api/v1/trips/:tripId/dashboard', async ({ params }) => {
    const scenarioResponse = await maybeScenarioResponse('dashboard')

    if (scenarioResponse) {
      return scenarioResponse
    }

    return jsonResponse(computeDashboard(Number(params.tripId), state.data))
  }),

  http.get('*/api/v1/trips/:tripId', async ({ params }) => {
    const scenarioResponse = await maybeScenarioResponse('trip')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const trip = state.data.trips.find((item) => item.id === Number(params.tripId))

    return trip ? jsonResponse(trip) : jsonResponse({ message: 'Not found' }, 404)
  }),

  http.patch('*/api/v1/trips/:tripId', async ({ params, request }) => {
    const scenarioResponse = await maybeScenarioResponse('trip')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const tripId = Number(params.tripId)
    const body = await readJsonBody<Partial<Trip>>(request)
    const index = state.data.trips.findIndex((item) => item.id === tripId)

    if (index < 0) {
      return jsonResponse({ message: 'Not found' }, 404)
    }

    state.data.trips[index] = { ...state.data.trips[index], ...body }

    return jsonResponse(state.data.trips[index])
  }),

  http.put('*/api/v1/trips/:tripId', async ({ params, request }) => {
    const tripId = Number(params.tripId)
    const body = await readJsonBody<Partial<Trip>>(request)
    const index = state.data.trips.findIndex((item) => item.id === tripId)

    if (index < 0) {
      return jsonResponse({ message: 'Not found' }, 404)
    }

    state.data.trips[index] = { ...state.data.trips[index], ...body }

    return jsonResponse(state.data.trips[index])
  }),

  http.delete('*/api/v1/trips/:tripId', async ({ params }) => {
    state.data.trips = state.data.trips.filter(
      (item) => item.id !== Number(params.tripId),
    )

    return emptyResponse()
  }),

  http.get('*/api/v1/trips/:tripId/members', async ({ params, request }) => {
    const scenarioResponse = await maybeScenarioResponse('tripMembers')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const tripId = Number(params.tripId)
    const url = new URL(request.url)
    state.requests.tripMembersQuery.push(request.url)
    const items = state.data.tripMembers.filter((item) => item.tripId === tripId)

    return jsonResponse(pageItems(items, url))
  }),

  http.post('*/api/v1/trips/:tripId/members', async ({ params, request }) => {
    const scenarioResponse = await maybeScenarioResponse('tripMembers')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const body = await readJsonBody<{ email?: string; role?: string }>(request)
    const userId = nextId(state.data.tripMembers.map((item) => ({ id: item.userId })))
    const email = body.email?.trim() || `member-${userId}@example.com`
    const member: TripMember = {
      id: nextId(state.data.tripMembers),
      userId,
      tripId: Number(params.tripId),
      role: body.role ?? 'VIEW',
      user: createUser({
        id: userId,
        fullName: email.split('@')[0] ?? 'Trip member',
        email,
        phone: null,
        username: email.split('@')[0] ?? `member${userId}`,
      }),
    }

    state.data.tripMembers.unshift(member)

    return jsonResponse(member, 201)
  }),

  http.patch('*/api/v1/trips/:tripId/members/:memberId', async ({ request }) => {
    const scenarioResponse = await maybeScenarioResponse('tripMembers')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const memberId = getNestedId(new URL(request.url).pathname)
    const body = await readJsonBody<Partial<TripMember>>(request)
    const index = state.data.tripMembers.findIndex((item) => item.id === memberId)

    if (index < 0) {
      return jsonResponse({ message: 'Not found' }, 404)
    }

    state.data.tripMembers[index] = {
      ...state.data.tripMembers[index],
      role: body.role ?? state.data.tripMembers[index].role,
    }

    return jsonResponse(state.data.tripMembers[index])
  }),

  http.delete('*/api/v1/trips/:tripId/members/:memberId', async ({ request }) => {
    const memberId = getNestedId(new URL(request.url).pathname)
    state.data.tripMembers = state.data.tripMembers.filter(
      (item) => item.id !== memberId,
    )

    return emptyResponse()
  }),

  http.get('*/api/v1/trips/:tripId/itineraries/query', async ({ params, request }) => {
    const scenarioResponse = await maybeScenarioResponse('itineraries')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const tripId = Number(params.tripId)
    const url = new URL(request.url)
    state.requests.itineraryQuery.push(request.url)
    const items = applyItineraryFilters(
      state.data.itineraries.filter((item) => item.tripId === tripId),
      url,
    )

    return jsonResponse(pageItems(items, url))
  }),

  http.post('*/api/v1/trips/:tripId/itineraries', async ({ params, request }) => {
    const body = await readJsonBody<Partial<Itinerary>>(request)
    const item = {
      id: nextId(state.data.itineraries),
      tripId: Number(params.tripId),
      activityTitle: body.activityTitle ?? 'Untitled activity',
      location: body.location ?? null,
      startTime: body.startTime ?? null,
      endTime: body.endTime ?? null,
      category: body.category ?? 'OTHER',
      status: body.status ?? 'PLANNED',
      priority: body.priority ?? 'MEDIUM',
    }

    state.data.itineraries.push(item)

    return jsonResponse(item, 201)
  }),

  http.patch('*/api/v1/trips/:tripId/itineraries/:itineraryId', async ({ request }) => {
    const body = await readJsonBody<Partial<Itinerary>>(request)
    const itineraryId = getNestedId(new URL(request.url).pathname)
    const index = state.data.itineraries.findIndex((item) => item.id === itineraryId)

    if (index < 0) {
      return jsonResponse({ message: 'Not found' }, 404)
    }

    state.data.itineraries[index] = { ...state.data.itineraries[index], ...body }

    return jsonResponse(state.data.itineraries[index])
  }),

  http.put('*/api/v1/trips/:tripId/itineraries/:itineraryId', async ({ request }) => {
    const body = await readJsonBody<Partial<Itinerary>>(request)
    const itineraryId = getNestedId(new URL(request.url).pathname)
    const index = state.data.itineraries.findIndex((item) => item.id === itineraryId)

    if (index < 0) {
      return jsonResponse({ message: 'Not found' }, 404)
    }

    state.data.itineraries[index] = { ...state.data.itineraries[index], ...body }

    return jsonResponse(state.data.itineraries[index])
  }),

  http.delete('*/api/v1/trips/:tripId/itineraries/:itineraryId', async ({ request }) => {
    const itineraryId = getNestedId(new URL(request.url).pathname)
    state.data.itineraries = state.data.itineraries.filter(
      (item) => item.id !== itineraryId,
    )

    return emptyResponse()
  }),

  http.get('*/api/v1/trips/:tripId/packing-checklists/query', async ({ params, request }) => {
    const scenarioResponse = await maybeScenarioResponse('packing')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const tripId = Number(params.tripId)
    const url = new URL(request.url)
    state.requests.packingQuery.push(request.url)
    const items = applyPackingFilters(
      state.data.packingItems.filter((item) => item.tripId === tripId),
      url,
    )

    return jsonResponse(pageItems(items, url))
  }),

  http.post('*/api/v1/trips/:tripId/packing-checklists', async ({ params, request }) => {
    const body = await readJsonBody<Partial<PackingItem>>(request)
    const item = {
      id: nextId(state.data.packingItems),
      tripId: Number(params.tripId),
      name: body.name ?? 'Untitled item',
      quantity: body.quantity ?? 1,
      category: body.category ?? 'OTHER',
      requiredStatus: body.requiredStatus ?? 'REQUIRED',
      packedStatus: body.packedStatus ?? 'NOT_PACKED',
    }

    state.data.packingItems.push(item)

    return jsonResponse(item, 201)
  }),

  http.patch('*/api/v1/trips/:tripId/packing-checklists/:checklistId', async ({ request }) => {
    const body = await readJsonBody<Partial<PackingItem>>(request)
    const checklistId = getNestedId(new URL(request.url).pathname)
    const index = state.data.packingItems.findIndex((item) => item.id === checklistId)

    if (index < 0) {
      return jsonResponse({ message: 'Not found' }, 404)
    }

    state.data.packingItems[index] = { ...state.data.packingItems[index], ...body }

    return jsonResponse(state.data.packingItems[index])
  }),

  http.put('*/api/v1/trips/:tripId/packing-checklists/:checklistId', async ({ request }) => {
    const body = await readJsonBody<Partial<PackingItem>>(request)
    const checklistId = getNestedId(new URL(request.url).pathname)
    const index = state.data.packingItems.findIndex((item) => item.id === checklistId)

    if (index < 0) {
      return jsonResponse({ message: 'Not found' }, 404)
    }

    state.data.packingItems[index] = { ...state.data.packingItems[index], ...body }

    return jsonResponse(state.data.packingItems[index])
  }),

  http.delete('*/api/v1/trips/:tripId/packing-checklists/:checklistId', async ({ request }) => {
    const checklistId = getNestedId(new URL(request.url).pathname)
    state.data.packingItems = state.data.packingItems.filter(
      (item) => item.id !== checklistId,
    )

    return emptyResponse()
  }),

  http.get('*/api/v1/trips/:tripId/budgets/query', async ({ params, request }) => {
    const scenarioResponse = await maybeScenarioResponse('budgets')

    if (scenarioResponse) {
      return scenarioResponse
    }

    const tripId = Number(params.tripId)
    const url = new URL(request.url)
    state.requests.budgetQuery.push(request.url)
    const items = applyBudgetFilters(
      state.data.budgetItems.filter((item) => item.tripId === tripId),
      url,
    )

    return jsonResponse(pageItems(items, url))
  }),

  http.get('*/api/v1/trips/:tripId/budgets/summary', async ({ params }) => {
    const scenarioResponse = await maybeScenarioResponse('budgetSummary')

    if (scenarioResponse) {
      return scenarioResponse
    }

    return jsonResponse(computeBudgetSummary(Number(params.tripId), state.data))
  }),

  http.post('*/api/v1/trips/:tripId/budgets', async ({ params, request }) => {
    const body = await readJsonBody<Partial<BudgetItem>>(request)
    const item = {
      id: nextId(state.data.budgetItems),
      tripId: Number(params.tripId),
      itemName: body.itemName ?? 'Untitled cost',
      category: body.category ?? 'OTHER',
      estimatedCost: body.estimatedCost ?? 0,
      actualCost: body.actualCost ?? null,
      paymentStatus: body.paymentStatus ?? 'UNPAID',
    }

    state.data.budgetItems.push(item)

    return jsonResponse(item, 201)
  }),

  http.patch('*/api/v1/trips/:tripId/budgets/:budgetId', async ({ request }) => {
    const body = await readJsonBody<Partial<BudgetItem>>(request)
    const budgetId = getNestedId(new URL(request.url).pathname)
    const index = state.data.budgetItems.findIndex((item) => item.id === budgetId)

    if (index < 0) {
      return jsonResponse({ message: 'Not found' }, 404)
    }

    state.data.budgetItems[index] = { ...state.data.budgetItems[index], ...body }

    return jsonResponse(state.data.budgetItems[index])
  }),

  http.put('*/api/v1/trips/:tripId/budgets/:budgetId', async ({ request }) => {
    const body = await readJsonBody<Partial<BudgetItem>>(request)
    const budgetId = getNestedId(new URL(request.url).pathname)
    const index = state.data.budgetItems.findIndex((item) => item.id === budgetId)

    if (index < 0) {
      return jsonResponse({ message: 'Not found' }, 404)
    }

    state.data.budgetItems[index] = { ...state.data.budgetItems[index], ...body }

    return jsonResponse(state.data.budgetItems[index])
  }),

  http.delete('*/api/v1/trips/:tripId/budgets/:budgetId', async ({ request }) => {
    const budgetId = getNestedId(new URL(request.url).pathname)
    state.data.budgetItems = state.data.budgetItems.filter(
      (item) => item.id !== budgetId,
    )

    return emptyResponse()
  }),
]
