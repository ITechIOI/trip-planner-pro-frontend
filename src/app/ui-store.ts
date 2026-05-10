import { create } from 'zustand'

type UiStore = {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const initialUiStoreState = {
  isSidebarCollapsed: false,
}

export const useUiStore = create<UiStore>((set) => ({
  ...initialUiStoreState,
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
}))

export const resetUiStore = () => {
  useUiStore.setState(initialUiStoreState)
}
