import type { Page } from '@playwright/test'
import { ACCESS_TOKEN } from './data'

export const mockAuthenticatedUser = async (page: Page) => {
  await page.addInitScript((accessToken) => {
    window.localStorage.setItem('tripPlannerPro.accessToken', accessToken)
  }, ACCESS_TOKEN)
}

export const clearMockAuth = async (page: Page) => {
  await page.evaluate(() => {
    window.localStorage.removeItem('tripPlannerPro.accessToken')
  })
}
