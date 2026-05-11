import { expect, type Locator, test } from '@playwright/test'
import { installMockApi } from '../fixtures/api'
import { createTestData } from '../fixtures/data'
import { mockAuthenticatedUser } from '../fixtures/auth'

const fillDateField = async (
  container: Locator,
  label: string,
  value: { day: string; month: string; year: string },
) => {
  const field = container.getByRole('group', { name: label })

  await field.getByRole('spinbutton', { name: 'Year' }).fill(value.year)
  await field.getByRole('spinbutton', { name: 'Month' }).fill(value.month)
  await field.getByRole('spinbutton', { name: 'Day' }).fill(value.day)
}

test.describe('trips', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page)
  })

  test('lists trips and opens workspace navigation from active context', async ({ page }) => {
    await installMockApi(page)

    await page.goto('/trips')
    await expect(page.getByRole('heading', { name: 'Trips' })).toBeVisible()
    await expect(
      page.getByTestId('trip-row').filter({ hasText: 'Da Nang Family Trip' }),
    ).toContainText('1')
    await expect(
      page.getByTestId('trip-row').filter({ hasText: 'Da Nang Family Trip' }),
    ).toContainText('Owner')
    await expect(
      page.getByTestId('trip-row').filter({ hasText: 'Empty Beach Weekend' }),
    ).toContainText('Viewer')
    await expect(
      page.getByTestId('trip-row').filter({ hasText: 'Warning Budget Trip' }),
    ).toContainText('Editor')
    await expect(page.locator('img[src*="trip-thumbnail"]')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Open workspace' })).toHaveCount(0)
    await expect(page.getByRole('navigation', { name: 'Trip workspace' })).toBeVisible()
    await page.getByRole('link', { name: 'Budget' }).click()

    await expect(page).toHaveURL(/\/trips\/1\/budget$/)
    await expect(
      page.getByRole('heading', { exact: true, name: 'Budget' }),
    ).toBeVisible()
  })

  test('uses the trip switcher on trips page as workspace context', async ({ page }) => {
    await installMockApi(page)

    await page.goto('/trips')
    await page.getByLabel('Switch trip').click()
    await expect(
      page.getByRole('option', { name: /Empty Beach Weekend.*Viewer/ }),
    ).toBeVisible()
    await page.getByRole('option', { name: 'Empty Beach Weekend' }).click()

    await expect(page).toHaveURL(/\/trips$/)
    await page.getByRole('link', { name: 'Packing' }).click()

    await expect(page).toHaveURL(/\/trips\/2\/packing$/)
    await expect(
      page.getByRole('heading', { exact: true, name: 'Packing' }),
    ).toBeVisible()
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
    const api = await installMockApi(page)

    await page.goto('/trips')
    await page.getByRole('button', { name: 'New trip' }).click()
    const createDialog = page.getByRole('dialog', { name: 'Create trip' })
    await createDialog.getByLabel('Trip name').fill('Hue Heritage Trip')
    await createDialog.getByLabel('Initial travel budget').fill('7000000')
    await fillDateField(createDialog, 'Start date', {
      day: '01',
      month: '10',
      year: '2026',
    })
    await fillDateField(createDialog, 'End date', {
      day: '04',
      month: '10',
      year: '2026',
    })
    await createDialog.getByRole('button', { name: 'Create trip' }).click()

    await expect(page).toHaveURL(/\/trips\/5\/dashboard$/)
    expect(api.requests.tripCreates.at(-1)).toMatchObject({
      startDate: '2026-10-01T00:00:00',
      endDate: '2026-10-04T00:00:00',
    })
    await expect(page.getByRole('heading', { name: 'Hue Heritage Trip' })).toBeVisible()

    await page.getByRole('link', { name: 'Trips' }).click()
    await page
      .getByTestId('trip-row')
      .filter({ hasText: 'Hue Heritage Trip' })
      .getByRole('button', { name: 'Edit' })
      .click()
    const editDialog = page.getByRole('dialog', { name: 'Edit trip' })
    await editDialog.getByLabel('Trip name').fill('Hue Food Trip')
    await editDialog.getByRole('button', { name: 'Save trip' }).click()
    await expect(
      page.getByTestId('trip-row').filter({ hasText: 'Hue Food Trip' }),
    ).toBeVisible()

    await page
      .getByTestId('trip-row')
      .filter({ hasText: 'Hue Food Trip' })
      .getByRole('button', { name: 'Delete' })
      .click()
    await expect(
      page.getByTestId('trip-row').filter({ hasText: 'Hue Food Trip' }),
    ).toHaveCount(0)
  })

  test('paginates trip list with offset and limit 50', async ({ page }) => {
    const data = createTestData()

    for (let index = 0; index < 52; index += 1) {
      data.trips.push({
        id: 1000 + index,
        name: `Generated Trip ${index + 1}`,
        estimatedBudget: 1_000_000,
        ownerId: data.currentUser.id,
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
