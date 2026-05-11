import { describe, expect, it } from 'vitest'
import { resetUiStore, useUiStore } from './ui-store'

describe('ui store', () => {
  it('toggles and resets sidebar collapsed state', () => {
    useUiStore.getState().toggleSidebar()

    expect(useUiStore.getState().isSidebarCollapsed).toBe(true)

    useUiStore.getState().setSidebarCollapsed(false)

    expect(useUiStore.getState().isSidebarCollapsed).toBe(false)

    useUiStore.getState().setSidebarCollapsed(true)
    resetUiStore()

    expect(useUiStore.getState().isSidebarCollapsed).toBe(false)
  })

  it('stores and resets last active trip id', () => {
    useUiStore.getState().setLastActiveTripId(2)

    expect(useUiStore.getState().lastActiveTripId).toBe(2)

    useUiStore.getState().setLastActiveTripId(undefined)

    expect(useUiStore.getState().lastActiveTripId).toBeUndefined()

    useUiStore.getState().setLastActiveTripId(3)
    resetUiStore()

    expect(useUiStore.getState().lastActiveTripId).toBeUndefined()
  })
})
