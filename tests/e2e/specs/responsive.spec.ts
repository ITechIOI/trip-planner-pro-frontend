import { expect, test } from '@playwright/test'
import { installMockApi } from '../fixtures/api'
import { mockAuthenticatedUser } from '../fixtures/auth'
import { expectNoHorizontalScroll } from '../fixtures/visual'

test.describe('responsive and accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)
  })

  test('uses sidebar on desktop and bottom navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/trips/1/dashboard')

    await expect(page.getByRole('navigation', { name: 'Trip workspace' })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Mobile trip workspace' })).toBeHidden()
    await expectNoHorizontalScroll(page)

    await page.setViewportSize({ width: 390, height: 844 })
    await expect(page.getByRole('navigation', { name: 'Mobile trip workspace' })).toBeVisible()
    await expectNoHorizontalScroll(page)
  })

  test('dialogs trap focus and restore focus to trigger', async ({ page }) => {
    await page.goto('/trips/1/itinerary')
    const trigger = page.getByRole('button', { name: 'Add activity' })

    await trigger.focus()
    await trigger.click()
    await expect(page.getByRole('dialog', { name: 'Add activity' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Close dialog' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Add activity' })).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })

  test('form errors use alert semantics and progress exposes progressbar semantics', async ({ page }) => {
    await page.goto('/trips/1/budget')
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')

    await page.getByRole('button', { name: 'Add cost' }).click()
    await page
      .getByRole('dialog', { name: 'Add budget item' })
      .getByRole('button', { name: 'Add cost' })
      .click()

    await expect(page.getByRole('alert').filter({ hasText: 'Item name is required' })).toBeVisible()
  })
})
