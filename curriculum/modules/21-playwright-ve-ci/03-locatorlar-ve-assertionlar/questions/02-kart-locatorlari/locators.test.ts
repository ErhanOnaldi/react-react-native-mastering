// @vitest-environment node
import {
  chromium,
  expect as pw,
  type Browser,
  type BrowserContext,
  type Page,
} from '@playwright/test'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { movies, serveFakeApi } from '@exercise/fake-api'
import { favoriteButton, movieCard, movieTitles } from '@exercise/locators'
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

async function openHome(markup: AppOptions['markup']): Promise<Page> {
  const context = await browser.newContext({ baseURL: APP_ORIGIN })
  context.setDefaultTimeout(5_000)
  contexts.push(context)
  await serveSinema(context, { markup })
  await serveFakeApi(context)
  const page = await context.newPage()
  await page.goto('/')
  return page
}

/** Testin kendi referans locator'ı: öğrencinin locator'ından bağımsız kontrol için. */
function referenceButton(page: Page, title: string) {
  return page
    .getByRole('listitem')
    .filter({ has: page.getByRole('heading', { name: title, exact: true }) })
    .getByRole('button')
}

describe.each([
  ['ilk sürüm', 'v1'],
  ['shadcn sürümü', 'shadcn'],
] as const)('Kart locator’ları (%s)', (_label, markup) => {
  it('movieTitles yalnızca kart başlıklarını sırayla verir', { timeout: 20_000 }, async () => {
    const page = await openHome(markup)
    await pw(movieTitles(page)).toHaveText(movies.map((m) => m.title))
  })

  it(
    'movieCard("Matrix") tek kart bulur, "Matrix Reloaded"a karışmaz',
    { timeout: 20_000 },
    async () => {
      const page = await openHome(markup)
      await pw(movieCard(page, 'Matrix')).toHaveCount(1)
      await pw(movieCard(page, 'Matrix')).toContainText('1999')
      await pw(movieCard(page, 'Matrix Reloaded')).toContainText('2003')
    },
  )

  it('favoriteButton doğru kartın butonuna tıklar', { timeout: 20_000 }, async () => {
    const page = await openHome(markup)
    await favoriteButton(page, 'Matrix Reloaded').click()
    await pw(referenceButton(page, 'Matrix Reloaded')).toHaveAttribute('aria-pressed', 'true')
    await pw(referenceButton(page, 'Matrix')).toHaveAttribute('aria-pressed', 'false')
  })

  it(
    'favoriteButton adı “Favorilerden çıkar” olunca da aynı butonu bulur',
    { timeout: 20_000 },
    async () => {
      const page = await openHome(markup)
      await favoriteButton(page, 'Dövüş Kulübü').click()
      await pw(referenceButton(page, 'Dövüş Kulübü')).toHaveText('Favorilerden çıkar')
      await favoriteButton(page, 'Dövüş Kulübü').click()
      await pw(referenceButton(page, 'Dövüş Kulübü')).toHaveText('Favorilere ekle')
      expect(await referenceButton(page, 'Dövüş Kulübü').getAttribute('aria-pressed')).toBe('false')
    },
  )
})
