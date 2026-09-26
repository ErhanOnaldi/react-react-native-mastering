import type { Page } from '@playwright/test'
import { duneDoc, duneWork, herbert, messiahDoc } from '../src/test/msw/fixtures.ts'

/** E2E testleri de gerçek Open Library'ye gitmez: ağ katmanında taklit ederiz. */
export async function mockOpenLibrary(page: Page) {
  // Önce "her şey 404": taklit edilmemiş bir istek gerçek ağa sızmasın.
  // Sonra kaydedilen route'lar önce çalışır (Playwright: son kaydedilen kazanır).
  await page.route('https://openlibrary.org/**', (route) =>
    route.fulfill({ status: 404, json: { error: 'notfound' } }),
  )
  await page.route('https://openlibrary.org/search.json**', (route) =>
    route.fulfill({ json: { numFound: 2, start: 0, docs: [duneDoc, messiahDoc] } }),
  )
  await page.route('https://openlibrary.org/works/OL893414W.json', (route) =>
    route.fulfill({ json: duneWork }),
  )
  await page.route('https://openlibrary.org/authors/OL79034A.json', (route) =>
    route.fulfill({ json: herbert }),
  )
  // Kapak görselleri testin konusu değil: ağa çıkmasın
  await page.route('https://covers.openlibrary.org/**', (route) => route.abort())
}
