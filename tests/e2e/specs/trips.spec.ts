import { expect, test } from '@playwright/test'
import { installMockApi } from '../fixtures/api'
import { createTestData } from '../fixtures/data'
import { mockAuthenticatedUser } from '../fixtures/auth'

test.describe('trips', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page)
  })

  test('lists trips and opens a workspace', async ({ page }) => {
    await installMockApi(page)

    await page.goto('/trips')
    await expect(page.getByRole('heading', { name: 'Trips' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Da Nang Family Trip' })).toBeVisible()
    await page
      .locator('.trip-card')
      .filter({ hasText: 'Da Nang Family Trip' })
      .getByRole('link', { name: 'Open workspace' })
      .click()

    await expect(page).toHaveURL(/\/trips\/1\/dashboard$/)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('shows empty state when no trips exist', async ({ page }) => {
    const data = createTestData()
    data.trips = []
    await installMockApi(page, { data })

    await page.goto('/trips')

    await expect(page.getByText('No trips yet')).toBeVisible()
    await expect(page.getByRole('button', { name: /create trip/i })).toBeVisible()
  })

  test('creates, edits, and deletes trips through dialogs', async ({ page }) => {
    await installMockApi(page)

    await page.goto('/trips')
    await page.getByRole('button', { name: 'New trip' }).click()
    const createDialog = page.getByRole('dialog', { name: 'Create trip' })
    await createDialog.getByLabel('Trip name').fill('Hue Heritage Trip')
    await createDialog.getByLabel('Initial travel budget').fill('7000000')
    await createDialog.getByLabel('Start date').fill('2026-10-01')
    await createDialog.getByLabel('End date').fill('2026-10-04')
    await createDialog.getByRole('button', { name: 'Create trip' }).click()

    await expect(page).toHaveURL(/\/trips\/5\/dashboard$/)
    await expect(page.getByRole('heading', { name: 'Hue Heritage Trip' })).toBeVisible()

    await page.getByRole('button', { name: 'All trips' }).click()
    await page
      .locator('.trip-card')
      .filter({ hasText: 'Hue Heritage Trip' })
      .getByRole('button', { name: 'Edit' })
      .click()
    const editDialog = page.getByRole('dialog', { name: 'Edit trip' })
    await editDialog.getByLabel('Trip name').fill('Hue Food Trip')
    await editDialog.getByRole('button', { name: 'Save trip' }).click()
    await expect(page.getByRole('heading', { name: 'Hue Food Trip' })).toBeVisible()

    await page
      .locator('.trip-card')
      .filter({ hasText: 'Hue Food Trip' })
      .getByRole('button', { name: 'Delete' })
      .click()
    await expect(page.getByRole('heading', { name: 'Hue Food Trip' })).toHaveCount(0)
  })

  test('paginates trip list with offset and limit 50', async ({ page }) => {
    const data = createTestData()

    for (let index = 0; index < 52; index += 1) {
      data.trips.push({
        id: 1000 + index,
        name: `Generated Trip ${index + 1}`,
        estimatedBudget: 1_000_000,
        startDate: '2026-12-01',
        endDate: '2026-12-02',
      })
    }

    const api = await installMockApi(page, { data })

    await page.goto('/trips')
    await expect(page.getByText('Showing 1-50 of 56')).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).click()

    await expect(page).toHaveURL(/offset=50/)
    await expect(page.getByText('Showing 51-56 of 56')).toBeVisible()
    expect(api.requests.tripsQuery.at(-1)).toContain('offset=50')
    expect(api.requests.tripsQuery.at(-1)).toContain('limit=50')
  })
})
