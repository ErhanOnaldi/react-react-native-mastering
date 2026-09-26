import type { Locator, Page } from '@playwright/test'
export function movieTitles(page: Page): Locator {
  return page.locator('.card-title')
}
export function movieCard(page: Page, title: string): Locator {
  return page.locator('li.movie-card').filter({ hasText: title })
}
export function favoriteButton(page: Page, title: string): Locator {
  return movieCard(page, title).locator('.btn-fav')
}
