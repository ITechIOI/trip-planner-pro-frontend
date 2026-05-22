import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useCallback,
} from 'react'

const initialTrip = {
  tripName: 'Da Nang Adventure',
  destination: 'Da Nang, Vietnam',
  startDate: '2026-06-01',
  endDate: '2026-06-07',
  budget: 1500,
  itinerary: [
    {
      id: 1,
      activityTitle: 'Arrival at Da Nang Airport',
      location: 'Da Nang International Airport',
      startTime: "2026-06-01T19:00:00.000Z",     // Gộp date + time thành chuỗi ISO
      endTime: "2026-06-01T21:00:00.000Z",
      category: 'TRANSPORT',
      priority: 'HIGH',
      status: 'PLANNED',
    },
    {
      id: 2,
      activityTitle: 'Marble Mountains Tour',
      location: 'Marble Mountains, Ngu Hanh Son',
      startTime: "2026-06-02T09:00:00.000Z",
      endTime: "2026-06-02T12:00:00.000Z",
      category: 'SIGHTSEEING',
      priority: 'MEDIUM',
      status: 'PLANNED',
    },
  ],
  packing: [
    { id: 1, itemName: 'Passport', packed: true },
    { id: 2, itemName: 'Sunscreen', packed: false },
  ],
  expenses: [
    { id: 1, description: 'Flight tickets', amount: 450, date: '2026-05-15T00:00:00.000Z' },
    { id: 2, description: 'Hotel deposit', amount: 200, date: '2026-05-20T00:00:00.000Z' },
  ],
}

const initialState = {
  trip: initialTrip,
  viewMode: 'edit',
}

function tripReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }
    case 'ADD_ITINERARY':
      return {
        ...state,
        trip: {
          ...state.trip,
          itinerary: [...state.trip.itinerary, action.payload],
        },
      }
    case 'UPDATE_ITINERARY':
      return {
        ...state,
        trip: {
          ...state.trip,
          itinerary: state.trip.itinerary.map((item) =>
            item.id === action.payload.id ? action.payload : item,
          ),
        },
      }
    case 'DELETE_ITINERARY':
      return {
        ...state,
        trip: {
          ...state.trip,
          itinerary: state.trip.itinerary.filter((item) => item.id !== action.payload),
        },
      }
    case 'RESET':
      return { trip: initialTrip, viewMode: 'edit' }
    case 'UNDO':
      return state
    default:
      return state
  }
}

function computeStats(trip) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const totalActivities = trip.itinerary.length
  const completedActivities = trip.itinerary.filter((i) => i.status === 'DONE').length
  const itineraryCompletionPercentage =
    totalActivities === 0
      ? 0
      : Math.round((completedActivities / totalActivities) * 100)

  const overdueActivities = trip.itinerary.filter((item) => {
    const itemDate = item.startTime ? new Date(item.startTime) : null;
    return item.status === 'PLANNED' && itemDate < today
  }).length

  const totalPacked = trip.packing.filter((p) => p.packedStatus === 'PACKED').length
  const packingCompletionPercentage =
    trip.packing.length === 0
      ? 0
      : Math.round((totalPacked / trip.packing.length) * 100)

  const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0)
  const remainingBudget = trip.budget - totalSpent
  const budgetUsagePercentage =
    trip.budget === 0 ? 0 : Math.round((totalSpent / trip.budget) * 100)

  return {
    totalActivities,
    completedActivities,
    itineraryCompletionPercentage,
    overdueActivities,
    hasOverdueActivities: overdueActivities > 0,
    packingCompletionPercentage,
    totalSpent,
    remainingBudget,
    budgetUsagePercentage,
    isBudgetWarning: budgetUsagePercentage >= 80 && budgetUsagePercentage < 100,
    isBudgetCritical: budgetUsagePercentage >= 100,
  }
}


const TripContext = createContext(null)

export function TripProvider({ children  }) {
  const [state, dispatch] = useReducer(tripReducer, initialState)

  const stats = useMemo(() => computeStats(state.trip), [state.trip])

  const formatCurrency = useCallback(
    (amount) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount),
    [],
  )

  const value = useMemo(
    () => ({
      state,
      dispatch,
      stats,
      canUndo: false,
      formatCurrency,
    }),
    [state, stats, formatCurrency],
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}
