import type { Page } from '@playwright/test'

export class AuthPageObject {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async gotoLogin() {
    await this.page.goto('/login')
  }

  async gotoRegister() {
    await this.page.goto('/register')
  }

  async login(username: string, password: string) {
    await this.page.getByLabel('Username').fill(username)
    await this.page.getByLabel('Password').fill(password)
    await this.page.getByRole('button', { name: /sign in/i }).click()
  }

  async register({
    fullName,
    username,
    password,
  }: {
    fullName: string
    username: string
    password: string
  }) {
    await this.page.getByLabel('Full name').fill(fullName)
    await this.page.getByLabel('Username').fill(username)
    await this.page.getByLabel('Password').fill(password)
    await this.page.getByRole('button', { name: /create account/i }).click()
  }
}
