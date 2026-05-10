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
})
