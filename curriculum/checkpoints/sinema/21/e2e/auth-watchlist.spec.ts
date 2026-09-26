import { expect, test } from '@playwright/test'
import { loginSuccessResponse } from './fixtures'

const DUMMYJSON_BASE = 'https://dummyjson.com'
const VALID_USER = { username: 'emilys', password: 'emilyspass' }

test.beforeEach(async ({ page }) => {
  // Bu spec'e özel: DummyJSON girişini burada taklit ediyoruz, hazır storageState kullanmıyoruz —
  // amaç router'ın korumalı rotaya gerçekten yönlendirdiğini uçtan uca yakalamak.
  await page.route(`${DUMMYJSON_BASE}/**`, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    if (url.pathname === '/auth/login' && request.method() === 'POST') {
      const body = (request.postDataJSON() ?? {}) as {
        username?: string
        password?: string
      }
      if (body.username !== VALID_USER.username || body.password !== VALID_USER.password) {
        await route.fulfill({ status: 400, json: { message: 'Invalid credentials' } })
        return
      }
      await route.fulfill({ json: loginSuccessResponse })
      return
    }
    await route.fulfill({ status: 404, json: { message: 'Not found' } })
  })
})

test('boş oturumla /watchlists açılınca girişten geçip yeni liste ekler', async ({ page }) => {
  await page.goto('/watchlists')

  // Korumalı rota: oturum yokken /login'e yönlenmeli ve form görünmeli.
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Giriş yap' })).toBeVisible()

  await page.getByLabel('Kullanıcı adı').fill(VALID_USER.username)
  await page.getByLabel('Parola').fill(VALID_USER.password)
  await page.getByRole('button', { name: 'Giriş yap' }).click()

  // Giriş sonrası router, redirect öncesi hedef olan /watchlists'e geri dönmeli.
  await expect(page).toHaveURL(/\/watchlists$/)
  await expect(page.getByRole('heading', { name: 'İzleme listelerim' })).toBeVisible()

  await page.getByLabel('Liste adı').fill('Hafta sonu')
  await page.getByRole('button', { name: 'Kaydet' }).click()

  await expect(page.getByRole('heading', { level: 3, name: 'Hafta sonu' })).toBeVisible()
})
