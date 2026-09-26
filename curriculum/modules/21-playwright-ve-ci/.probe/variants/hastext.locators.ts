import type { Locator, Page } from '@playwright/test'
export function movieTitles(page: Page): Locator {
  return page.getByRole('heading')
}
export function movieCard(page: Page, title: string): Locator {
  return page.getByRole('listitem').filter({ hasText: title })
}
export function favoriteButton(page: Page, title: string): Locator {
  return movieCard(page, title).getByRole('button', { name: 'Favorilere ekle' })
}
