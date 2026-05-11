import { expect, test } from '@playwright/test'
import { installMockApi } from '../fixtures/api'
import { mockAuthenticatedUser } from '../fixtures/auth'

test.describe('profile', () => {
  test.beforeEach(async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)
  })

  test('opens profile from account menu and updates editable profile fields', async ({ page }) => {
    await page.goto('/trips')
    await page.getByRole('button', { name: 'Open account menu' }).click()
    await page.getByRole('menuitem', { name: 'Profile' }).click()

    await expect(page).toHaveURL(/\/profile$/)
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
    await expect(page.getByLabel('Username')).toHaveValue('demo')

    await page.getByLabel('Full name').fill('Demo Family Planner')
    await page.getByLabel('Email').fill('planner@example.com')
    await page.getByLabel('Phone').fill('+84999888777')
    await page.getByLabel('Choose avatar image').setInputFiles({
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: Buffer.from('avatar'),
    })
    await page.getByRole('button', { name: 'Save profile' }).click()

    await expect(page.getByText('Profile updated')).toBeVisible()
    await expect(page.getByLabel('Full name')).toHaveValue('Demo Family Planner')
    await expect(page.locator('img[alt="Demo Family Planner"]')).toBeVisible()

    await page.getByRole('button', { name: 'Remove avatar' }).click()
    await page.getByRole('button', { name: 'Save profile' }).click()

    await expect(page.getByText('Profile updated')).toBeVisible()
    await expect(page.locator('img[alt="Demo Family Planner"]')).toHaveCount(0)
  })
})
