import { expect, test } from '@playwright/test'
import { genreListResponse, movie550Details, movie550Summary, tmdbList } from './fixtures'

const TMDB_BASE = 'https://api.themoviedb.org'

test.beforeEach(async ({ page }) => {
  // Bu spec'e özel: her istek burada karşılanır, gerçek themoviedb.org'a hiç gidilmez.
  await page.route(`${TMDB_BASE}/**`, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const authorization = request.headers()['authorization'] ?? ''
    if (!/^Bearer\s+\S+$/.test(authorization)) {
      await route.fulfill({
        status: 401,
        json: {
          status_code: 7,
          status_message: 'Invalid API key: You must be granted a valid key.',
        },
      })
      return
    }

    const path = url.pathname.replace(/^\/3/, '')
    if (path === '/genre/movie/list') {
      await route.fulfill({ json: genreListResponse })
      return
    }
    if (path === '/trending/movie/week') {
      await route.fulfill({ json: tmdbList([movie550Summary]) })
      return
    }
    if (path === '/search/movie') {
      const query = (url.searchParams.get('query') ?? '').toLocaleLowerCase('tr-TR')
      const haystack = movie550Summary.title.toLocaleLowerCase('tr-TR')
      const results = query && haystack.includes(query) ? [movie550Summary] : []
      await route.fulfill({ json: tmdbList(results) })
      return
    }
    if (path === '/movie/550') {
      await route.fulfill({ json: movie550Details })
      return
    }

    // Eşleşmeyen bir TMDB isteği: sessizce 200 dönmek yerine gerçekçi bir 404 veriyoruz.
    await route.fulfill({
      status: 404,
      json: { status_code: 34, status_message: 'The resource you requested could not be found.' },
    })
  })
})

test('ana sayfadan aramaya gidip film detayını açar', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Sinema' })).toBeVisible()

  await page.getByRole('link', { name: 'Ara', exact: true }).click()
  await expect(page).toHaveURL(/\/search$/)
  await expect(page.getByRole('heading', { name: 'Film ara' })).toBeVisible()

  await page.getByRole('textbox', { name: 'Film ara' }).fill('dövüş')

  const result = page.getByRole('link', { name: 'Dövüş Kulübü', exact: true })
  await expect(result).toBeVisible()
  await result.click()

  await expect(page).toHaveURL(/\/movie\/550$/)
  await expect(page.getByRole('heading', { level: 2, name: 'Dövüş Kulübü' })).toBeVisible()
})
