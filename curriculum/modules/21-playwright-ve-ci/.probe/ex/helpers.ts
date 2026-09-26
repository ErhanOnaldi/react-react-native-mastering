import type { Page } from '@playwright/test'

export async function heading(page: Page) {
  return page.getByRole('heading', { level: 1 }).textContent()
}
