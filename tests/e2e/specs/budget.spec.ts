import { expect, test } from '@playwright/test'
import { installMockApi } from '../fixtures/api'
import { mockAuthenticatedUser } from '../fixtures/auth'

test.describe('budget', () => {
  test.beforeEach(async ({ page }) => {
    await installMockApi(page)
    await mockAuthenticatedUser(page)
  })

  test('shows summary totals, category totals, and warning levels', async ({ page }) => {
    await page.goto('/trips/1/budget')

    await expect(page.getByText('Estimated total')).toBeVisible()
    await expect(page.getByText('Actual vs estimated')).toBeVisible()
    await expect(page.getByText('Remaining')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Category totals' })).toBeVisible()
    await expect(
      page.locator('.category-list').getByText('Transport', { exact: true }),
    ).toBeVisible()
    await expect(page.getByText('SAFE', { exact: true }).first()).toBeVisible()

    await page.goto('/trips/3/budget')
    await expect(
      page.locator('.warning-banner').getByText('WARNING', { exact: true }),
    ).toBeVisible()

    await page.goto('/trips/4/budget')
    await expect(
      page.locator('.warning-banner').getByText('CRITICAL', { exact: true }),
    ).toBeVisible()
  })

  test('requires actual cost when adding a paid item', async ({ page }) => {
    await page.goto('/trips/1/budget')
    await page.getByRole('button', { name: 'Add cost' }).click()
    const dialog = page.getByRole('dialog', { name: 'Add budget item' })
    await dialog.getByLabel('Item name').fill('Paid activity')
    await dialog.getByLabel('Estimated cost').fill('500000')
    await dialog.getByLabel('Payment status').selectOption('PAID')
    await dialog.getByRole('button', { name: 'Add cost' }).click()

    await expect(dialog.getByText('Actual cost is required when payment status is Paid')).toBeVisible()
  })

  test('adds, edits, deletes, and toggles payment status', async ({ page }) => {
    await page.goto('/trips/1/budget')
    await page.getByRole('button', { name: 'Add cost' }).click()
    const addDialog = page.getByRole('dialog', { name: 'Add budget item' })
    await addDialog.getByLabel('Item name').fill('Boat tour')
    await addDialog.getByLabel('Estimated cost').fill('900000')
    await addDialog.getByLabel('Actual cost').fill('950000')
    await addDialog.getByLabel('Category').selectOption('ACTIVITY')
    await addDialog.getByLabel('Payment status').selectOption('PAID')
    await addDialog.getByRole('button', { name: 'Add cost' }).click()

    await expect(page.getByRole('heading', { name: 'Boat tour' })).toBeVisible()

    await page
      .locator('.item-row')
      .filter({ hasText: 'Boat tour' })
      .getByRole('button', { name: 'Mark unpaid' })
      .click()
    await expect(page.locator('.item-row').filter({ hasText: 'Boat tour' })).toContainText(
      'Unpaid',
    )

    await page
      .locator('.item-row')
      .filter({ hasText: 'Boat tour' })
      .getByRole('button', { name: 'Edit' })
      .click()
    const editDialog = page.getByRole('dialog', { name: 'Edit budget item' })
    await editDialog.getByLabel('Item name').fill('Private boat tour')
    await editDialog.getByRole('button', { name: 'Save cost' }).click()
    await expect(page.getByRole('heading', { name: 'Private boat tour' })).toBeVisible()

    await page
      .locator('.item-row')
      .filter({ hasText: 'Private boat tour' })
      .getByRole('button', { name: 'Delete' })
      .click()
    await expect(page.getByRole('heading', { name: 'Private boat tour' })).toHaveCount(0)
  })
})
