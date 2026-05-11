import { create } from 'zustand'

export type ToastSeverity = 'success' | 'error'

export type ToastMessage = {
  id: number
  message: string
  severity: ToastSeverity
}

type ToastStore = {
  toast?: ToastMessage
  hideToast: () => void
  showToast: (toast: Omit<ToastMessage, 'id'>) => void
}

export const toastDurations: Record<ToastSeverity, number> = {
  success: 3500,
  error: 6000,
}

let nextToastId = 1

export const useToastStore = create<ToastStore>((set) => ({
  toast: undefined,
  hideToast: () => set({ toast: undefined }),
  showToast: (toast) =>
    set({
      toast: {
        ...toast,
        id: nextToastId++,
      },
    }),
}))

export const showSuccessToast = (message: string) => {
  useToastStore.getState().showToast({ severity: 'success', message })
}

export const showErrorToast = (message: string) => {
  useToastStore.getState().showToast({ severity: 'error', message })
}

export const useShowToast = () => useToastStore((state) => state.showToast)

export const resetToastStore = () => {
  nextToastId = 1
  useToastStore.setState({ toast: undefined })
}
