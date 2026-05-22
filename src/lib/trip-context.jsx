import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api/v1', // Link cổng server chạy từ Swagger của bạn
    headers: {
      'Content-Type': 'application/json',
    },
  });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

const TripContext = createContext();

const initialState = {
  trip: {
    id: 1, 
    name: 'Loading...',
    itinerary: [],
  },
  viewMode: 'edit',
};


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
      };
    case 'ADD_ITINERARY_SUCCESS':
      return {
        ...state,
        trip: {
          ...state.trip,
          itinerary: [...state.trip.itinerary, action.payload],
        },
      };
    case 'UPDATE_ITINERARY_SUCCESS':
      return {
        ...state,
        trip: {
          ...state.trip,
          itinerary: state.trip.itinerary.map((item) =>
            item.id === action.payload.id ? action.payload : item
          ),
        },
      };
    case 'DELETE_ITINERARY_SUCCESS':
      return {
        ...state,
        trip: {
          ...state.trip,
          itinerary: state.trip.itinerary.filter((item) => item.id !== action.payload),
        },
      };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    default:
      return state;
  }
}

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  const tripId = 1; 

 
  const loadTripData = async () => {
    try {
      
      const [tripRes, itineraryRes] = await Promise.all([
        api.get(`/trips/${tripId}`),
        api.get(`/trips/${tripId}/itineraries`, { params: { limit: 50, offset: 0 } })
      ]);

      dispatch({
        type: 'SET_TRIP_DATA',
        payload: {
          tripDetails: tripRes.data,
          itineraryItems: itineraryRes.data.items, 
        },
      });
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu từ Backend API:', error);
    }
  };

  
  useEffect(() => {
    loadTripData();
  }, []);

  
  const addItinerary = async (newItem) => {
    try {
      const response = await api.post(`/trips/${tripId}/itineraries`, newItem);
      dispatch({ type: 'ADD_ITINERARY_SUCCESS', payload: response.data });
      loadTripData(); 
    } catch (error) {
      console.error('Lỗi API khi thêm hoạt động:', error);
    }
  };

  
  const updateItinerary = async (updatedItem) => {
    try {
      const response = await api.patch(
        `/trips/${tripId}/itineraries/${updatedItem.id}`,
        updatedItem
      );
      dispatch({ type: 'UPDATE_ITINERARY_SUCCESS', payload: response.data });
      loadTripData();
    } catch (error) {
      console.error('Lỗi API khi cập nhật hoạt động:', error);
    }
  };

  
  const deleteItinerary = async (itineraryId) => {
    try {
      await api.delete(`/trips/${tripId}/itineraries/${itineraryId}`);
      dispatch({ type: 'DELETE_ITINERARY_SUCCESS', payload: itineraryId });
      loadTripData();
    } catch (error) {
      console.error('Lỗi API khi xóa hoạt động:', error);
    }
  };

  const stats = React.useMemo(() => {
    const itinerary = state.trip.itinerary || [];
    const totalActivities = itinerary.length;
    const completedActivities = itinerary.filter((item) => item.status === 'DONE').length;
    const itineraryCompletionPercentage =
      totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueActivities = itinerary.filter((item) => {
      const itemDate = item.startTime ? new Date(item.startTime) : null;
      return item.status === 'PLANNED' && itemDate && itemDate < today;
    }).length;

    return {
      totalActivities,
      completedActivities,
      itineraryCompletionPercentage,
      overdueActivities,
      hasOverdueActivities: overdueActivities > 0,
    };
  }, [state.trip.itinerary]);

  const contextValue = {
    state,
    stats,
    dispatch: (action) => {
      if (action.type === 'ADD_ITINERARY') {
        addItinerary(action.payload);
      } else if (action.type === 'UPDATE_ITINERARY') {
        updateItinerary(action.payload);
      } else if (action.type === 'DELETE_ITINERARY') {
        deleteItinerary(action.payload);
      } else {
        dispatch(action);
      }
    },
  };

  return <TripContext.Provider value={contextValue}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip phải được bọc bên trong thẻ TripProvider');
  }
  return context;
}