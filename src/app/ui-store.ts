import { create } from 'zustand'

type UiStore = {
  isSidebarCollapsed: boolean
  lastActiveTripId?: number
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setLastActiveTripId: (tripId?: number) => void
}

export const initialUiStoreState = {
  isSidebarCollapsed: false,
  lastActiveTripId: undefined,
}

export const useUiStore = create<UiStore>((set) => ({
  ...initialUiStoreState,
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setLastActiveTripId: (tripId) => set({ lastActiveTripId: tripId }),
}))

export const resetUiStore = () => {
  useUiStore.setState(initialUiStoreState)
}
