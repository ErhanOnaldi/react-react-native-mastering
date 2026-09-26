import type { Page } from '@playwright/test'

export async function mockSearch(page: Page): Promise<void> {
  await page.route('https://api.themoviedb.org/3/search/movie?**', async (route) => {
    const authorization = route.request().headers()['authorization'] ?? ''
    if (!/^Bearer\s+\S+$/.test(authorization)) {
      await route.fulfill({ status: 401, json: { status_code: 7 } })
      return
    }
    const url = new URL(route.request().url())
    const results =
      url.searchParams.get('query') === 'dövüş' ? [{ id: 550, title: 'Dövüş Kulübü' }] : []
    await route.fulfill({
      json: { page: 1, results, total_pages: 1, total_results: results.length },
    })
  })
}
