// @vitest-environment node
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { serveFakeApi } from '@exercise/fake-api'
import { SearchPage } from '@exercise/SearchPage'
import { APP_ORIGIN, serveSinema } from '@exercise/sinema-app'

let browser: Browser
const contexts: BrowserContext[] = []

beforeAll(async () => {
  browser = await chromium.launch()
}, 60_000)

afterEach(async () => {
  await Promise.all(contexts.splice(0).map((c) => c.close()))
})

afterAll(async () => {
  await browser?.close()
})

/** Arama 800 ms, detay 600 ms sürer: beklemeyen metotlar hemen yakalanır. */
async function openSinema(): Promise<Page> {
  const context = await browser.newContext({ baseURL: APP_ORIGIN })
  context.setDefaultTimeout(5_000)
  contexts.push(context)
  await serveSinema(context)
  await serveFakeApi(context, { searchLatencyMs: 800, latencyMs: 600 })
  return context.newPage()
}

describe('SearchPage', () => {
  it('goto arama sayfasını açar', { timeout: 20_000 }, async () => {
    const page = await openSinema()
    await new SearchPage(page).goto()
    expect(new URL(page.url()).pathname).toBe('/search')
    expect(await page.getByRole('heading', { level: 2 }).textContent()).toBe('Film ara')
  })

  it(
    'search sonuçlar gelene kadar bekler: hemen ardından resultTitles doğru listeyi verir',
    { timeout: 20_000 },
    async () => {
      const page = await openSinema()
      const searchPage = new SearchPage(page)
      await searchPage.goto()
      await searchPage.search('matrix')
      expect(await searchPage.resultTitles(), 'search() sonuçlar gelmeden döndü').toEqual([
        'Matrix',
        'Matrix Reloaded',
      ])
    },
  )

  it('ikinci aramada eski sonuçlarla dönmez', { timeout: 20_000 }, async () => {
    const page = await openSinema()
    const searchPage = new SearchPage(page)
    await searchPage.goto()
    await searchPage.search('matrix')
    await searchPage.search('dövüş')
    expect(
      await searchPage.resultTitles(),
      'search("dövüş") eski “matrix” sonuçları ekrandayken döndü: bu sorgunun sonucunu bekle',
    ).toEqual(['Dövüş Kulübü'])
  })

  it(
    'sonuç çıkmayan aramada da döner; resultTitles boş liste verir',
    { timeout: 20_000 },
    async () => {
      const page = await openSinema()
      const searchPage = new SearchPage(page)
      await searchPage.goto()
      await searchPage.search('yokböylebirfilm')
      expect(await searchPage.resultTitles()).toEqual([])
    },
  )

  it('results ve searchBox locator’ları doğru öğeleri gösterir', { timeout: 20_000 }, async () => {
    const page = await openSinema()
    const searchPage = new SearchPage(page)
    await searchPage.goto()
    await searchPage.search('matrix')
    expect(await searchPage.results.count()).toBe(2)
    await searchPage.searchBox.fill('')
    expect(await page.getByRole('searchbox').inputValue()).toBe('')
  })

  it(
    'openMovie tam adla filmi açar ve detay yüklenene kadar bekler',
    { timeout: 20_000 },
    async () => {
      const page = await openSinema()
      const searchPage = new SearchPage(page)
      await searchPage.goto()
      await searchPage.search('matrix')
      await searchPage.openMovie('Matrix')
      expect(new URL(page.url()).pathname).toBe('/movie/603')
      expect(
        await page.getByRole('heading', { level: 2 }).textContent(),
        'openMovie() detay sayfası yüklenmeden döndü',
      ).toBe('Matrix')
    },
  )
})
