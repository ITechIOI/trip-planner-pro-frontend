import { expect, test } from '@playwright/test'
import { clearMockAuth, mockAuthenticatedUser } from '../fixtures/auth'
import { installMockApi } from '../fixtures/api'

test.describe('auth flow', () => {
  test('renders login and register forms with validation errors', async ({ page }) => {
    await installMockApi(page)

    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText('Username is required')).toBeVisible()
    await expect(page.getByText('Password is required')).toBeVisible()

    await page.getByRole('link', { name: 'Create one' }).click()
    await expect(
      page.getByRole('heading', { name: 'Create your travel workspace' }),
    ).toBeVisible()
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page.getByText('Full name is required')).toBeVisible()
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible()
  })

  test('failed login keeps entered credentials and shows submit error', async ({ page }) => {
    await installMockApi(page)

    await page.goto('/login')
    await page.getByLabel('Username').fill('wrong-user')
    await page.getByLabel('Password').fill('wrong-password')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByRole('alert')).toContainText('Authentication failed')
    await expect(page.getByLabel('Username')).toHaveValue('wrong-user')
    await expect(page.getByLabel('Password')).toHaveValue('wrong-password')
  })

  test('successful login navigates to trips', async ({ page }) => {
    await installMockApi(page)

    await page.goto('/login')
    await page.getByLabel('Username').fill('demo')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page).toHaveURL(/\/trips$/)
    await expect(page.getByRole('heading', { name: 'Trips' })).toBeVisible()
  })

  test('protected workspace redirects unauthenticated users to login', async ({ page }) => {
    await installMockApi(page)
    await clearMockAuth(page).catch(() => undefined)

    await page.goto('/trips/1/dashboard')

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  })

  test('sign out clears auth state and returns to login', async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)

    await page.goto('/trips/1/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    await page.getByRole('button', { name: /sign out/i }).click()

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(
      page.evaluate(() => window.localStorage.getItem('tripPlannerPro.accessToken')),
    ).resolves.toBeNull()
  })
})
