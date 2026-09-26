// @vitest-environment node
import { chromium, expect as pwExpect, type Browser } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { heading } from '@exercise/helpers'

let browser: Browser

beforeAll(async () => {
  browser = await chromium.launch()
}, 30_000)

afterAll(async () => {
  await browser?.close()
})

describe('probe', () => {
  it('setContent + helper', async () => {
    const page = await browser.newPage()
    await page.setContent('<h1>Dövüş Kulübü</h1>')
    expect(await heading(page)).toBe('Dövüş Kulübü')
    await pwExpect(page.getByRole('heading')).toHaveText('Dövüş Kulübü')
  }, 20_000)

  it('route + cross-origin fetch with auth from setContent page', async () => {
    const page = await browser.newPage()
    await page.route('https://api.themoviedb.org/3/**', (route) =>
      route.fulfill({
        json: { id: 550, title: 'Dövüş Kulübü', auth: route.request().headers()['authorization'] },
      }),
    )
    await page.setContent('<p id="out">...</p>')
    const result = await page.evaluate(async () => {
      const res = await fetch('https://api.themoviedb.org/3/movie/550', {
        headers: { Authorization: 'Bearer x' },
      })
      return res.json()
    })
    expect(result).toEqual({ id: 550, title: 'Dövüş Kulübü', auth: 'Bearer x' })
  }, 20_000)

  it('goto routed fake origin', async () => {
    const page = await browser.newPage()
    await page.route('https://sinema.test/**', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<h1>Sinema</h1><script>fetch("https://api.themoviedb.org/3/trending/movie/week",{headers:{Authorization:"Bearer t"}}).then(r=>r.json()).then(d=>{document.body.insertAdjacentHTML("beforeend","<p>"+d.results[0].title+"</p>")})</script>',
      }),
    )
    await page.route('https://api.themoviedb.org/3/trending/**', (route) =>
      route.fulfill({ json: { results: [{ title: 'Başlangıç' }] } }),
    )
    await page.goto('https://sinema.test/')
    await pwExpect(page.getByText('Başlangıç')).toBeVisible()
  }, 20_000)
})
