// @vitest-environment node
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { serveFakeApi, type FakeApiOptions } from '@exercise/fake-api'
import { searchScenario } from '@exercise/searchScenario'
import { APP_ORIGIN, serveSinema, type AppOptions } from '@exercise/sinema-app'

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

async function openSinema(app: Partial<AppOptions> = {}, api: FakeApiOptions = {}): Promise<Page> {
  const context = await browser.newContext({ baseURL: APP_ORIGIN })
  context.setDefaultTimeout(5_000)
  contexts.push(context)
  await serveSinema(context, app)
  await serveFakeApi(context, api)
  return context.newPage()
}

async function expectToCatch(run: Promise<void>, message: string) {
  const error = await run.then(
    () => undefined,
    (e: unknown) => e,
  )
  expect(error, message).toBeInstanceOf(Error)
}

describe('searchScenario', () => {
  it('çalışan Sinema’da senaryon hatasız biter', { timeout: 20_000 }, async () => {
    const page = await openSinema()
    await searchScenario(page)
    expect(new URL(page.url()).pathname).toBe('/search')
  })

  it(
    'arama cevabı 1,5 sn gecikse de senaryon geçer (beklemeyi assertion’lar yapar)',
    { timeout: 20_000 },
    async () => {
      const page = await openSinema({}, { searchLatencyMs: 1_500 })
      await searchScenario(page)
    },
  )

  it(
    'yeni aramada eski sonuçları bırakan sürümde senaryon kalır',
    { timeout: 25_000 },
    async () => {
      const page = await openSinema({ keepStaleResults: true })
      await expectToCatch(
        searchScenario(page),
        '“başlangıç” aramasında eski Matrix sonuçları da listede kaldı ama senaryon geçti: sonuç sayısını doğrula',
      )
    },
  )

  it('aramayı URL’ye (?q=) yazmayan sürümde senaryon kalır', { timeout: 25_000 }, async () => {
    const page = await openSinema({ writeQueryToUrl: false })
    await expectToCatch(
      searchScenario(page),
      'URL’de ?q= yok ama senaryon geçti: toHaveURL ile doğrula',
    )
  })

  it('“Aranıyor…” yazısı hiç kalkmayan sürümde senaryon kalır', { timeout: 25_000 }, async () => {
    const page = await openSinema({ stuckLoading: true })
    await expectToCatch(searchScenario(page), '“Aranıyor…” ekranda kaldı ama senaryon geçti')
  })

  it('TMDB 401 dönen sürümde (sonuç yok) senaryon kalır', { timeout: 25_000 }, async () => {
    const page = await openSinema({ sendToken: false })
    await expectToCatch(searchScenario(page), 'Hiç sonuç gelmediği hâlde senaryon geçti')
  })
})
