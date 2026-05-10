import type { Page } from '@playwright/test'

export class WorkspacePageObject {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async gotoDashboard(tripId = 1) {
    await this.page.goto(`/trips/${tripId}/dashboard`)
  }

  async gotoItinerary(tripId = 1) {
    await this.page.goto(`/trips/${tripId}/itinerary`)
  }

  async gotoPacking(tripId = 1) {
    await this.page.goto(`/trips/${tripId}/packing`)
  }

  async gotoBudget(tripId = 1) {
    await this.page.goto(`/trips/${tripId}/budget`)
  }

  async openAddActivityDialog() {
    await this.page.getByRole('button', { name: 'Add activity' }).click()
  }

  async openAddPackingItemDialog() {
    await this.page.getByRole('button', { name: 'Add item' }).first().click()
  }

  async openAddBudgetItemDialog() {
    await this.page.getByRole('button', { name: 'Add cost' }).first().click()
  }
}
