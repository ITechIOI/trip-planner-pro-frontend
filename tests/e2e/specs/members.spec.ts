import { expect, test } from '@playwright/test'
import { installMockApi } from '../fixtures/api'
import { mockAuthenticatedUser } from '../fixtures/auth'

test.describe('trip members', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page)
  })

  test('adds, updates, and deletes trip members', async ({ page }) => {
    await installMockApi(page)

    await page.goto('/trips/1/members')
    await expect(page.getByRole('heading', { name: 'Members' })).toBeVisible()
    await expect(page.getByTestId('member-row')).toHaveCount(2)
    await expect(page.getByText('Demo Traveler')).toBeVisible()
    await expect(page.getByText('demo@example.com')).toBeVisible()
    await expect(page.getByText('Taylor Planner')).toBeVisible()
    await expect(page.getByText(/User ID/)).toHaveCount(0)
    await expect(page.getByText(/ID:/)).toHaveCount(0)

    await page.getByLabel('Member email').fill('friend@example.com')
    await page.locator('form').getByLabel('Role').selectOption('EDIT')
    await page.getByRole('button', { name: 'Add member' }).click()
    await expect(page.getByTestId('member-row')).toHaveCount(3)
    await expect(page.getByText('friend', { exact: true })).toBeVisible()
    await expect(page.getByText('friend@example.com')).toBeVisible()
    await expect(page.getByText(/User ID/)).toHaveCount(0)
    await expect(page.getByText(/ID:/)).toHaveCount(0)

    const viewMember = page.getByTestId('member-row').last()
    await viewMember.locator('select').selectOption('EDIT')
    await expect(viewMember.locator('select')).toHaveValue('EDIT')

    await viewMember.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByTestId('member-row')).toHaveCount(2)
    await expect(page.getByText(/User ID/)).toHaveCount(0)
    await expect(page.getByText(/ID:/)).toHaveCount(0)
  })
})
