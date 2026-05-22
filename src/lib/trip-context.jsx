import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react'
import axios from 'axios'
import {
  normalizeTripFromApi,
  normalizeItineraryFromApi,
  buildItineraryApiPayload,
  buildItineraryUpdatePayload,
  getApiErrorMessage,
} from '@/lib/itinerary-mappers'

const api = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken')
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

const TripContext = createContext(null)

const DEFAULT_TRIP_ID = 1

const initialState = {
  trip: {
    id: DEFAULT_TRIP_ID,
    tripName: 'Loading...',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 0,
    itinerary: [],
  },
  viewMode: 'edit',
}

function tripReducer(state, action) {
  switch (action.type) {
    case 'SET_TRIP_DATA':
      return {
        ...state,
        trip: {
          ...state.trip,
          ...action.payload.tripDetails,
          itinerary: action.payload.itineraryItems,
        },
      }
    case 'ADD_ITINERARY_SUCCESS':
      return {
        ...state,
        trip: {
          ...state.trip,
          itinerary: [...state.trip.itinerary, action.payload],
        },
      }
    case 'UPDATE_ITINERARY_SUCCESS':
      return {
        ...state,
        trip: {
          ...state.trip,
          itinerary: state.trip.itinerary.map((item) =>
            item.id === action.payload.id ? action.payload : item,
          ),
        },
      }
    case 'DELETE_ITINERARY_SUCCESS':
      return {
        ...state,
        trip: {
          ...state.trip,
          itinerary: state.trip.itinerary.filter(
            (item) => item.id !== action.payload,
          ),
        },
      }
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }
    default:
      return state
  }
}

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, initialState)
  const [itineraryLoading, setItineraryLoading] = useState(false)
  const [itineraryError, setItineraryError] = useState(null)
  const [tripLoading, setTripLoading] = useState(true)

  const tripId = state.trip.id ?? DEFAULT_TRIP_ID

  const loadTripData = useCallback(async () => {
    setTripLoading(true)
    setItineraryError(null)
    try {
      const [tripRes, itineraryRes] = await Promise.all([
        api.get(`/trips/${tripId}`),
        api.get(`/trips/${tripId}/itineraries`, {
          params: { limit: 100, offset: 0 },
        }),
      ])

      const tripDetails = normalizeTripFromApi(tripRes.data)
      const itineraryItems = (itineraryRes.data?.items ?? []).map(
        normalizeItineraryFromApi,
      )

      dispatch({
        type: 'SET_TRIP_DATA',
        payload: { tripDetails, itineraryItems },
      })
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Failed to load trip and itinerary data',
      )
      setItineraryError(message)
      console.error('Failed to fetch trip/itinerary:', error)
    } finally {
      setTripLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    loadTripData()
  }, [loadTripData])

  const addActivity = useCallback(
    async (formFields) => {
      setItineraryLoading(true)
      setItineraryError(null)
      try {
        const body = buildItineraryApiPayload(formFields)
        const { data } = await api.post(
          `/trips/${tripId}/itineraries`,
          body,
        )
        dispatch({
          type: 'ADD_ITINERARY_SUCCESS',
          payload: normalizeItineraryFromApi(data),
        })
        return { success: true, data }
      } catch (error) {
        const message = getApiErrorMessage(error, 'Failed to add activity')
        setItineraryError(message)
        console.error('addActivity error:', error)
        return { success: false, error: message }
      } finally {
        setItineraryLoading(false)
      }
    },
    [tripId],
  )

  const updateActivity = useCallback(
    async (itineraryId, formFieldsOrItem) => {
      setItineraryLoading(true)
      setItineraryError(null)
      try {
        const body =
          'date' in formFieldsOrItem
            ? buildItineraryApiPayload(formFieldsOrItem)
            : buildItineraryUpdatePayload(formFieldsOrItem)

        const { data } = await api.patch(
          `/trips/${tripId}/itineraries/${itineraryId}`,
          body,
        )
        dispatch({
          type: 'UPDATE_ITINERARY_SUCCESS',
          payload: normalizeItineraryFromApi(data),
        })
        return { success: true, data }
      } catch (error) {
        const message = getApiErrorMessage(error, 'Failed to update activity')
        setItineraryError(message)
        console.error('updateActivity error:', error)
        return { success: false, error: message }
      } finally {
        setItineraryLoading(false)
      }
    },
    [tripId],
  )

  const deleteActivity = useCallback(
    async (itineraryId) => {
      setItineraryLoading(true)
      setItineraryError(null)
      try {
        await api.delete(`/trips/${tripId}/itineraries/${itineraryId}`)
        dispatch({ type: 'DELETE_ITINERARY_SUCCESS', payload: itineraryId })
        return { success: true }
      } catch (error) {
        const message = getApiErrorMessage(error, 'Failed to delete activity')
        setItineraryError(message)
        console.error('deleteActivity error:', error)
        return { success: false, error: message }
      } finally {
        setItineraryLoading(false)
      }
    },
    [tripId],
  )

  const clearItineraryError = useCallback(() => setItineraryError(null), [])

 
  const itineraryDispatch = useCallback(
    (action) => {
      switch (action.type) {
        case 'ADD_ITINERARY':
          return addActivity(action.payload)
        case 'UPDATE_ITINERARY': {
          const { id, ...rest } = action.payload
          return updateActivity(id, rest)
        }
        case 'DELETE_ITINERARY':
          return deleteActivity(action.payload)
        default:
          dispatch(action)
      }
    },
    [addActivity, updateActivity, deleteActivity],
  )

  const stats = useMemo(() => {
    const itinerary = state.trip.itinerary || []
    const totalActivities = itinerary.length
    const completedActivities = itinerary.filter(
      (item) => item.status === 'DONE',
    ).length
    const itineraryCompletionPercentage =
      totalActivities > 0
        ? Math.round((completedActivities / totalActivities) * 100)
        : 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const overdueActivities = itinerary.filter((item) => {
      const itemDate = item.startTime ? new Date(item.startTime) : null
      return item.status === 'PLANNED' && itemDate && itemDate < today
    }).length

    const budget = state.trip.budget ?? 0
    const totalSpent = 0
    const remainingBudget = budget - totalSpent
    const budgetUsagePercentage =
      budget === 0 ? 0 : Math.round((totalSpent / budget) * 100)

    return {
      totalActivities,
      completedActivities,
      itineraryCompletionPercentage,
      overdueActivities,
      hasOverdueActivities: overdueActivities > 0,
      packingCompletionPercentage: 0,
      totalSpent,
      remainingBudget,
      budgetUsagePercentage,
      isBudgetWarning:
        budgetUsagePercentage >= 80 && budgetUsagePercentage < 100,
      isBudgetCritical: budgetUsagePercentage >= 100,
    }
  }, [state.trip.itinerary, state.trip.budget])

  const formatCurrency = useCallback(
    (amount) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount ?? 0),
    [],
  )

  const contextValue = useMemo(
    () => ({
      state,
      stats,
      dispatch: itineraryDispatch,
      addActivity,
      updateActivity,
      deleteActivity,
      loadTripData,
      tripLoading,
      itineraryLoading,
      itineraryError,
      clearItineraryError,
      formatCurrency,
    }),
    [
      state,
      stats,
      itineraryDispatch,
      addActivity,
      updateActivity,
      deleteActivity,
      loadTripData,
      tripLoading,
      itineraryLoading,
      itineraryError,
      clearItineraryError,
      formatCurrency,
    ],
  )

  return (
    <TripContext.Provider value={contextValue}>{children}</TripContext.Provider>
  )
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}
