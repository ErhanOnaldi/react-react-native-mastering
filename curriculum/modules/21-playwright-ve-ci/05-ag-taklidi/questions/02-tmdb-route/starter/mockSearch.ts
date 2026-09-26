import type { Page } from '@playwright/test'

export async function mockSearch(page: Page): Promise<void> {
  await page.route('https://api.themoviedb.org/3/search/movie?**', (route) =>
    route.fulfill({ json: { page: 1, results: [], total_pages: 1, total_results: 0 } }),
  )
}
