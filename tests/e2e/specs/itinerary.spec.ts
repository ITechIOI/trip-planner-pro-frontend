import { expect, test } from '@playwright/test'
import { installMockApi } from '../fixtures/api'
import { createTestData } from '../fixtures/data'
import { mockAuthenticatedUser } from '../fixtures/auth'

test.describe('itinerary', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page)
  })

  test('adds, edits, deletes, and updates activity status', async ({ page }) => {
    await installMockApi(page)

    await page.goto('/trips/1/itinerary')
    await page.getByRole('button', { name: 'Add activity' }).click()
    const addDialog = page.getByRole('dialog', { name: 'Add activity' })
    await addDialog.getByLabel('Activity title').fill('Beach walk')
    await addDialog.getByLabel('Location').fill('My Khe Beach')
    await addDialog.getByLabel('Start time').fill('2026-06-12T17:30')
    await addDialog.getByLabel('End time').fill('2026-06-12T18:30')
    await addDialog.getByLabel('Category').selectOption('SIGHTSEEING')
    await addDialog.getByLabel('Priority').selectOption('LOW')
    await addDialog.getByRole('button', { name: 'Add activity' }).click()

    await expect(page.getByRole('heading', { name: 'Beach walk' })).toBeVisible()

    await page
      .locator('.item-row')
      .filter({ hasText: 'Beach walk' })
      .getByRole('button', { name: 'Edit' })
      .click()
    const editDialog = page.getByRole('dialog', { name: 'Edit activity' })
    await editDialog.getByLabel('Activity title').fill('Sunset beach walk')
    await editDialog.getByRole('button', { name: 'Save activity' }).click()
    await expect(page.getByRole('heading', { name: 'Sunset beach walk' })).toBeVisible()

    await page
      .locator('.item-row')
      .filter({ hasText: 'Sunset beach walk' })
      .getByLabel('Status')
      .selectOption('DONE')
    await expect(
      page.locator('.item-row').filter({ hasText: 'Sunset beach walk' }),
    ).toContainText('Done')

    await page
      .locator('.item-row')
      .filter({ hasText: 'Sunset beach walk' })
      .getByRole('button', { name: 'Delete' })
      .click()
    await expect(page.getByRole('heading', { name: 'Sunset beach walk' })).toHaveCount(0)
  })

  test('filters by date, time, category, status, priority, and search', async ({ page }) => {
    const api = await installMockApi(page)

    await page.goto('/trips/1/itinerary')
    const filters = page.locator('.filter-toolbar')
    await filters.getByLabel('Date').fill('2026-06-10')
    await filters.getByLabel('Start time').fill('18:00')
    await filters.getByLabel('End time').fill('20:00')
    await filters.getByLabel('Category').selectOption('FOOD')
    await filters.getByLabel('Status').selectOption('PLANNED')
    await filters.getByLabel('Priority').selectOption('MEDIUM')
    await filters.getByLabel('Search').fill('Dinner')

    await expect(page.getByRole('heading', { name: 'Dinner reservation' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Flight to Da Nang' })).toHaveCount(0)

    await expect
      .poll(
        () =>
          api.requests.itineraryQuery.find(
            (request) =>
              request.includes('startTime=2026-06-10T18:00:00') &&
              request.includes('endTime=2026-06-10T20:00:00'),
          ) ?? '',
      )
      .toContain('limit=50')

    const filterRequest = api.requests.itineraryQuery.find(
      (request) =>
        request.includes('startTime=2026-06-10T18:00:00') &&
        request.includes('endTime=2026-06-10T20:00:00'),
    )

    expect(filterRequest).toContain('startTime=2026-06-10T18:00:00')
    expect(filterRequest).toContain('endTime=2026-06-10T20:00:00')
  })

  test('invalid time filters show inline error and prevent new query', async ({ page }) => {
    const api = await installMockApi(page)

    await page.goto('/trips/1/itinerary')
    await expect(page.getByRole('heading', { name: 'Flight to Da Nang' })).toBeVisible()
    const queryCount = api.requests.itineraryQuery.length
    const filters = page.locator('.filter-toolbar')

    await filters.getByLabel('Start time').fill('08:00')
    await expect(page.getByRole('alert')).toContainText(
      'Choose a date before filtering by start or end time',
    )
    expect(api.requests.itineraryQuery.length).toBe(queryCount)

    await filters.getByLabel('Date').fill('2026-06-10')
    await expect(page).toHaveURL(/date=2026-06-10/)
    await filters.getByLabel('Start time').fill('21:00')
    await expect(page).toHaveURL(/startClock=21%3A00/)
    await filters.getByLabel('End time').fill('08:00')
    await expect(page).toHaveURL(/endClock=08%3A00/)
    await expect(page.getByRole('alert')).toContainText(
      'End time must be after start time',
    )
  })

  test('overdue items have visible text and critical styling hook', async ({ page }) => {
    await installMockApi(page)

    await page.goto('/trips/1/itinerary')
    const overdueRow = page.locator('.item-row--critical').filter({
      hasText: 'Dragon Bridge visit',
    })

    await expect(overdueRow).toBeVisible()
    await expect(overdueRow).toContainText('Overdue')
  })

  test('pagination preserves active filters', async ({ page }) => {
    const data = createTestData()

    for (let index = 0; index < 52; index += 1) {
      data.itineraries.push({
        id: 2000 + index,
        tripId: 1,
        activityTitle: `Food stop ${index + 1}`,
        location: 'Night market',
        startTime: '2026-06-10T19:15:00',
        endTime: '2026-06-10T20:00:00',
        category: 'FOOD',
        status: 'PLANNED',
        priority: 'MEDIUM',
      })
    }

    const api = await installMockApi(page, { data })

    await page.goto('/trips/1/itinerary?date=2026-06-10&category=FOOD')
    await expect(page.getByText('Showing 1-50 of 53')).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).click()

    await expect(page).toHaveURL(/category=FOOD/)
    await expect(page).toHaveURL(/offset=50/)
    expect(api.requests.itineraryQuery.at(-1)).toContain('category=FOOD')
    expect(api.requests.itineraryQuery.at(-1)).toContain('offset=50')
    expect(api.requests.itineraryQuery.at(-1)).toContain('limit=50')
  })
})
