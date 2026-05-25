import { create } from 'zustand'

type AppUiState = {
  dismissedTripAlertIds: Record<number, true>
  dismissTripAlerts: (tripId: number) => void
  resetTripAlerts: (tripId: number) => void
  resetAppUiState: () => void
}

export const useAppUiStore = create<AppUiState>((set) => ({
  dismissedTripAlertIds: {},
  dismissTripAlerts: (tripId) =>
    set((state) => ({
      dismissedTripAlertIds: {
        ...state.dismissedTripAlertIds,
        [tripId]: true,
      },
    })),
  resetTripAlerts: (tripId) =>
    set((state) => {
      const dismissedTripAlertIds = { ...state.dismissedTripAlertIds }
      delete dismissedTripAlertIds[tripId]

      return { dismissedTripAlertIds }
    }),
  resetAppUiState: () => set({ dismissedTripAlertIds: {} }),
}))
