import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '../fixtures/test'
import { stabilizeVisualPage } from '../fixtures/visual'

const expectNoA11yViolations = async (page: Page) => {
  await stabilizeVisualPage(page)

  const results = await new AxeBuilder({ page })
    .exclude('[aria-label="Open React Query Devtools"]')
    .exclude('.tsqd-parent-container')
    .analyze()

  expect(results.violations).toEqual([])
}

test.describe('accessibility checks @a11y', () => {
  test('login page has no automated accessibility violations', async ({ page, mockApi }) => {
    expect(mockApi.data.trips.length).toBeGreaterThan(0)
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expectNoA11yViolations(page)
  })

  test('trips page has no automated accessibility violations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/trips')
    await expect(
      authenticatedPage.getByRole('heading', { name: 'Trips' }),
    ).toBeVisible()
    await expectNoA11yViolations(authenticatedPage)
  })

  test('dashboard page has no automated accessibility violations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/trips/1/dashboard')
    await expect(
      authenticatedPage.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible()
    await expectNoA11yViolations(authenticatedPage)
  })

  test('itinerary page and add dialog have no automated accessibility violations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/trips/1/itinerary')
    await authenticatedPage.getByRole('button', { name: 'Add activity' }).click()
    await expect(authenticatedPage.getByRole('dialog')).toBeVisible()
    await expectNoA11yViolations(authenticatedPage)
  })

  test('itinerary calendar has no automated accessibility violations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/trips/1/itinerary?view=calendar&month=2026-06')
    await expect(
      authenticatedPage.getByRole('heading', { name: 'June 2026' }),
    ).toBeVisible()
    await expectNoA11yViolations(authenticatedPage)
  })

  test('packing page has no automated accessibility violations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/trips/1/packing')
    await expect(
      authenticatedPage.getByRole('heading', { name: 'Packing' }),
    ).toBeVisible()
    await expectNoA11yViolations(authenticatedPage)
  })

  test('budget page and add dialog have no automated accessibility violations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/trips/1/budget')
    await authenticatedPage.getByRole('button', { name: 'Add cost' }).click()
    await expect(authenticatedPage.getByRole('dialog')).toBeVisible()
    await expectNoA11yViolations(authenticatedPage)
  })

  test('profile page has no automated accessibility violations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/profile')
    await expect(
      authenticatedPage.getByRole('heading', { name: 'Profile' }),
    ).toBeVisible()
    await expectNoA11yViolations(authenticatedPage)
  })

  test('members page has no automated accessibility violations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/trips/1/members')
    await expect(
      authenticatedPage.getByRole('heading', { name: 'Members' }),
    ).toBeVisible()
    await expectNoA11yViolations(authenticatedPage)
  })
})
