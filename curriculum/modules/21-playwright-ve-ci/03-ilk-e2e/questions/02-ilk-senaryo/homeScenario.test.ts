// @vitest-environment node
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { serveFakeApi } from '@exercise/fake-api'
import { homeScenario } from '@exercise/homeScenario'
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

/** Senaryo hata fırlatmalı: bozuk sürümü yakalamayan senaryo yeşil kalır. */
async function expectToCatch(run: Promise<void>, message: string) {
  const error = await run.then(
    () => undefined,
    (e: unknown) => e,
  )
  expect(error, message).toBeInstanceOf(Error)
}

/** playwright.config'in işini yapar: uygulamayı sunar, baseURL'i ayarlar, sahte API'yi bağlar. */
async function openSinema(options: Partial<AppOptions> = {}, origin = APP_ORIGIN): Promise<Page> {
  const context = await browser.newContext({ baseURL: origin })
  contexts.push(context)
  await serveSinema(context, options, origin)
  await serveFakeApi(context)
  return context.newPage()
}

describe('homeScenario', () => {
  it('çalışan Sinema’da senaryon hatasız biter', { timeout: 20_000 }, async () => {
    const page = await openSinema()
    await homeScenario(page)
    expect(new URL(page.url()).pathname, 'Senaryo ana sayfayı ("/") açmalı').toBe('/')
  })

  it('sayfayı baseURL’e göre açar: staging adresinde de çalışır', { timeout: 20_000 }, async () => {
    const staging = 'https://staging.sinema.test'
    const page = await openSinema({}, staging)
    await homeScenario(page)
    expect(
      page.url().startsWith(staging),
      'Adresi elle yazma: page.goto("/") baseURL’i kullanır',
    ).toBe(true)
  })

  it(
    'TMDB token’ı unutulunca (401, film listesi yok) senaryon kalır',
    { timeout: 20_000 },
    async () => {
      const page = await openSinema({ sendToken: false })
      await expectToCatch(
        homeScenario(page),
        'Liste hiç gelmediği hâlde senaryon geçti: "Dövüş Kulübü"nün göründüğünü doğruluyor musun?',
      )
    },
  )

  it('h1 “Vite + React” olunca senaryon kalır', { timeout: 20_000 }, async () => {
    const page = await openSinema({ title: 'Vite + React' })
    await expectToCatch(
      homeScenario(page),
      'Başlık bozukken senaryon geçti: h1’in "Sinema" olduğunu doğrula',
    )
  })

  it('uygulama açılışta çökünce (boş sayfa) senaryon kalır', { timeout: 20_000 }, async () => {
    const page = await openSinema({ crash: true })
    await expectToCatch(homeScenario(page), 'Boş sayfada senaryon geçti')
  })
})
