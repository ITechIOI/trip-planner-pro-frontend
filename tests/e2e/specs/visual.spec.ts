import { expect, test } from '@playwright/test'
import { installMockApi } from '../fixtures/api'
import { mockAuthenticatedUser } from '../fixtures/auth'
import { stabilizeVisualPage } from '../fixtures/visual'

test.describe('@visual visual regression', () => {
  test('login page', async ({ page }) => {
    await installMockApi(page)
    await page.goto('/login')
    await stabilizeVisualPage(page)

    await expect(page).toHaveScreenshot('login-page.png', { fullPage: true })
  })

  test('trips list', async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)
    await page.goto('/trips')
    await stabilizeVisualPage(page)

    await expect(page).toHaveScreenshot('trips-list.png', { fullPage: true })
  })

  test('dashboard overview', async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)
    await page.goto('/trips/1/dashboard')
    await stabilizeVisualPage(page)

    await expect(page).toHaveScreenshot('dashboard-overview.png', { fullPage: true })
  })

  test('itinerary filters and rows', async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)
    await page.goto('/trips/1/itinerary?date=2026-06-10')
    await stabilizeVisualPage(page)

    await expect(page).toHaveScreenshot('itinerary-filters.png', { fullPage: true })
  })

  test('packing page', async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)
    await page.goto('/trips/1/packing')
    await stabilizeVisualPage(page)

    await expect(page).toHaveScreenshot('packing-page.png', { fullPage: true })
  })

  test('budget page', async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)
    await page.goto('/trips/1/budget')
    await stabilizeVisualPage(page)

    await expect(page).toHaveScreenshot('budget-page.png', { fullPage: true })
  })

  test('dialog state', async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)
    await page.goto('/trips/1/budget')
    await page.getByRole('button', { name: 'Add cost' }).click()
    await stabilizeVisualPage(page)

    await expect(page).toHaveScreenshot('budget-dialog.png', { fullPage: true })
  })

  test('mobile workspace', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await installMockApi(page)
    await mockAuthenticatedUser(page)
    await page.goto('/trips/1/dashboard')
    await stabilizeVisualPage(page)

    await expect(page).toHaveScreenshot('mobile-dashboard.png', { fullPage: true })
  })
})
