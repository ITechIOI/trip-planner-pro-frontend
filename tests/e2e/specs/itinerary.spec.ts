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

    await page.goto(
      '/trips/1/itinerary?date=2026-06-10&startClock=18%3A00&endClock=20%3A00',
    )
    const filters = page.locator('.filter-toolbar')
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

    await page.goto('/trips/1/itinerary?startClock=08%3A00')
    const queryCount = api.requests.itineraryQuery.length

    await expect(page.getByRole('alert')).toContainText(
      'Choose a date before filtering by start or end time',
    )
    expect(api.requests.itineraryQuery.length).toBe(queryCount)

    await page.goto(
      '/trips/1/itinerary?date=2026-06-10&startClock=21%3A00&endClock=08%3A00',
    )
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
    await expect
      .poll(() => api.requests.itineraryQuery.at(-1) ?? '')
      .toContain('offset=50')
    expect(api.requests.itineraryQuery.at(-1)).toContain('category=FOOD')
    expect(api.requests.itineraryQuery.at(-1)).toContain('offset=50')
    expect(api.requests.itineraryQuery.at(-1)).toContain('limit=50')
  })

  test('calendar view highlights itinerary days and shows selected day details', async ({ page }) => {
    const api = await installMockApi(page)

    await page.goto('/trips/1/itinerary?view=calendar&month=2026-06')

    await expect(page.getByRole('heading', { name: 'June 2026' })).toBeVisible()
    await page
      .getByRole('button', { name: /June 10, 2026, 3 itineraries/ })
      .click()

    await expect(page).toHaveURL(/view=calendar/)
    await expect(page).toHaveURL(/date=2026-06-10/)
    await expect(page.getByRole('heading', { name: 'Flight to Da Nang' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Dinner reservation' })).toBeVisible()
    expect(api.requests.itineraryQuery.at(-1)).toContain('limit=50')
    expect(api.requests.itineraryQuery.at(-1)).toContain('startTime=2026-06-01T00:00:00')
    expect(api.requests.itineraryQuery.at(-1)).toContain('endTime=2026-06-30T23:59:59')
  })

  test('calendar month navigation does not drift in local timezones', async ({ page }) => {
    const api = await installMockApi(page)

    await page.goto('/trips/1/itinerary?view=calendar&month=2026-04')
    await expect(page.getByRole('heading', { name: 'April 2026' })).toBeVisible()

    await page.getByRole('button', { name: 'Next month' }).click()

    await expect(page).toHaveURL(/month=2026-05/)
    await expect(page.getByRole('heading', { name: 'May 2026' })).toBeVisible()
    await expect
      .poll(() => api.requests.itineraryQuery.at(-1) ?? '')
      .toContain('startTime=2026-05-01T00:00:00')

    await page.getByRole('button', { name: 'Previous month' }).click()

    await expect(page).toHaveURL(/month=2026-04/)
    await expect(page.getByRole('heading', { name: 'April 2026' })).toBeVisible()
    expect(
      api.requests.itineraryQuery.some((request) =>
        request.includes('startTime=2026-04-01T00:00:00'),
      ),
    ).toBe(true)
  })

  test('switching trips preserves itinerary route and active filters but resets pagination', async ({ page }) => {
    await installMockApi(page)

    await page.goto('/trips/1/itinerary?date=2026-06-10&category=FOOD&offset=50')
    await expect(
      page.getByRole('heading', { name: 'Itinerary', exact: true }),
    ).toBeVisible()

    await page.getByLabel('Switch trip').click()
    await page.getByRole('option', { name: 'Empty Beach Weekend' }).click()

    await expect(page).toHaveURL(/\/trips\/2\/itinerary/)
    await expect(page).toHaveURL(/date=2026-06-10/)
    await expect(page).toHaveURL(/category=FOOD/)
    await expect(page).not.toHaveURL(/offset=50/)
  })
})
