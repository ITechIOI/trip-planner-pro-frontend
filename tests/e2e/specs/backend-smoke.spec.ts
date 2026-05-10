import process from 'node:process'
import { expect, test } from '@playwright/test'

test.describe('@backend-smoke backend smoke', () => {
  test('authenticates against a real backend when enabled', async ({ page }) => {
    test.skip(
      !process.env.E2E_BACKEND_URL,
      'Set E2E_BACKEND_URL to run backend smoke tests.',
    )

    const seededUsername = process.env.E2E_USERNAME
    const seededPassword = process.env.E2E_PASSWORD

    if (seededUsername && seededPassword) {
      await page.goto('/login')
      await page.getByLabel('Username').fill(seededUsername)
      await page.getByLabel('Password').fill(seededPassword)
      await page.getByRole('button', { name: /sign in/i }).click()
    } else {
      const uniqueUser = `smoke-${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Full name').fill('Smoke Test User')
      await page.getByLabel('Username').fill(uniqueUser)
      await page.getByLabel('Password').fill('password123')
      await page.getByRole('button', { name: /create account/i }).click()
    }

    await expect(page).toHaveURL(/\/trips$/)
    await expect(page.getByRole('heading', { name: 'Trips' })).toBeVisible()
  })
})
