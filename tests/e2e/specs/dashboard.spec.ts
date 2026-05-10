import { expect, test } from '@playwright/test'
import { installMockApi } from '../fixtures/api'
import { mockAuthenticatedUser } from '../fixtures/auth'

test.describe('dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)
  })

  test('shows itinerary, packing, budget, unpaid, and overdue metrics', async ({ page }) => {
    await page.goto('/trips/1/dashboard')

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByText('Itinerary complete')).toBeVisible()
    await expect(page.getByText('20%')).toBeVisible()
    await expect(page.getByText('Packing complete')).toBeVisible()
    await expect(page.getByText('67%')).toBeVisible()
    await expect(page.getByText('Budget used', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Unpaid items', { exact: true })).toBeVisible()
    await expect(page.getByText('Overdue activities', { exact: true })).toBeVisible()
    await expect(page.getByText('Dragon Bridge visit')).toBeVisible()
    await expect(page.getByText('In progress - Overdue')).toBeVisible()
  })

  test('shows empty itinerary dashboard state', async ({ page }) => {
    await page.goto('/trips/2/dashboard')

    await expect(page.getByText('No itinerary items yet')).toBeVisible()
    await expect(page.getByText('0 packed from 0 items')).toBeVisible()
  })

  test('renders warning and critical budget states', async ({ page }) => {
    await page.goto('/trips/3/dashboard')
    await expect(page.getByText('WARNING budget status')).toBeVisible()

    await page.goto('/trips/4/dashboard')
    await expect(page.getByText('CRITICAL budget status')).toBeVisible()
  })
})
