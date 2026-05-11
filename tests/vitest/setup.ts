import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { resetUiStore } from '@/app/ui-store'
import { resetToastStore } from '@/shared/components/toast-store'
import { resetMockApi } from '../msw/handlers'
import { server } from '../msw/server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  resetUiStore()
  resetToastStore()
  resetMockApi()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
