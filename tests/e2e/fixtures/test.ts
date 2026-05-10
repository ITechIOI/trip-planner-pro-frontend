import { expect, test as base, type Page } from '@playwright/test'
import { mockAuthenticatedUser } from './auth'
import { installMockApi } from './api'
import { createTestData, type MockApiState, type TestData } from './data'

type Fixtures = {
  authenticatedPage: Page
  mockApi: MockApiState
  scenarioData: TestData
}

export const test = base.extend<Fixtures>({
  scenarioData: async ({ browserName }, runFixture) => {
    if (!browserName) {
      throw new Error('Playwright browserName fixture is required')
    }

    await runFixture(createTestData())
  },

  mockApi: async ({ page, scenarioData }, runFixture) => {
    const state = await installMockApi(page, { data: scenarioData })

    await runFixture(state)
  },

  authenticatedPage: async ({ page, scenarioData }, runFixture) => {
    await installMockApi(page, { data: scenarioData })
    await mockAuthenticatedUser(page)
    await runFixture(page)
  },
})

export { expect }
