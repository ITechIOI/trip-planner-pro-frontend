import { expect, test } from '@playwright/test'
import { installMockApi } from '../fixtures/api'
import { mockAuthenticatedUser } from '../fixtures/auth'

test.describe('packing', () => {
  test.beforeEach(async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)
  })

  test('adds, edits, deletes, and toggles packed state', async ({ page }) => {
    await page.goto('/trips/1/packing')
    await page.getByRole('button', { name: 'Add item' }).click()
    const addDialog = page.getByRole('dialog', { name: 'Add packing item' })
    await addDialog.getByLabel('Item name').fill('Sunscreen')
    await addDialog.getByLabel('Quantity').fill('2')
    await addDialog.getByLabel('Category').selectOption('PERSONAL')
    await addDialog.getByRole('button', { name: 'Add item' }).click()

    await expect(page.getByRole('heading', { name: 'Sunscreen' })).toBeVisible()

    await page
      .locator('.item-row')
      .filter({ hasText: 'Sunscreen' })
      .getByRole('button', { name: 'Mark packed' })
      .click()
    await expect(page.locator('.item-row').filter({ hasText: 'Sunscreen' })).toContainText(
      'Packed',
    )

    await page
      .locator('.item-row')
      .filter({ hasText: 'Sunscreen' })
      .getByRole('button', { name: 'Edit' })
      .click()
    const editDialog = page.getByRole('dialog', { name: 'Edit packing item' })
    await editDialog.getByLabel('Item name').fill('Mineral sunscreen')
    await editDialog.getByRole('button', { name: 'Save item' }).click()
    await expect(page.getByRole('heading', { name: 'Mineral sunscreen' })).toBeVisible()

    await page
      .locator('.item-row')
      .filter({ hasText: 'Mineral sunscreen' })
      .getByRole('button', { name: 'Delete' })
      .click()
    await expect(page.getByRole('heading', { name: 'Mineral sunscreen' })).toHaveCount(0)
  })

  test('filters list while keeping trip-level progress stable', async ({ page }) => {
    await page.goto('/trips/1/packing')

    await expect(page.getByText('67%')).toBeVisible()
    await expect(page.getByText('2 of 3 packed')).toBeVisible()
    const filters = page.locator('.filter-toolbar')
    await filters.getByLabel('Category').selectOption('CLOTHES')
    await filters.getByLabel('Packed status').selectOption('NOT_PACKED')

    await expect(page.getByRole('heading', { name: 'T-shirts' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Passport' })).toHaveCount(0)
    await expect(page.getByText('67%')).toBeVisible()
    await expect(page.getByText('2 of 3 packed')).toBeVisible()
  })
})
