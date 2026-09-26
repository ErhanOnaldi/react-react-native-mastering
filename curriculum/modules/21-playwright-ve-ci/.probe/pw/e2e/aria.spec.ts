import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('https://sinema.test/**', (r) =>
    r.fulfill({
      contentType: 'text/html; charset=utf-8',
      body: '<nav aria-label="Ana menü"><a href="/">Ana sayfa</a> · <a href="/search">Ara</a> · <a href="/w">İzleme listelerim</a></nav><h1>Sinema</h1>',
    }),
  )
})

test('root satırıyla', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Ana menü' })).toMatchAriaSnapshot(`
    - navigation "Ana menü":
      - link "Ana sayfa"
      - link "Ara"
      - link "İzleme listelerim"
  `)
})

test('yalnız çocuklar', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Ana menü' })).toMatchAriaSnapshot(`
    - link "Ana sayfa"
    - link "Ara"
    - link "İzleme listelerim"
  `)
})

test('eksik öğe (kısmi)', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Ana menü' })).toMatchAriaSnapshot(`
    - navigation "Ana menü":
      - link "Ana sayfa"
      - link "İzleme listelerim"
  `)
})

test('yanlış sıra', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Ana menü' })).toMatchAriaSnapshot(
    `
    - navigation "Ana menü":
      - link "Ara"
      - link "Ana sayfa"
  `,
    { timeout: 1000 },
  )
})
