import type { Locator, Page } from '@playwright/test'

/** Ana sayfadaki film listesinin kart başlıkları (yalnız onlar), sırayla. */
export function movieTitles(page: Page): Locator {
  return page.getByRole('list', { name: 'Filmler' }).getByRole('heading', { level: 3 })
}

/** Başlığı tam olarak `title` olan film kartı. */
export function movieCard(page: Page, title: string): Locator {
  return page.getByRole('listitem').filter({
    has: page.getByRole('heading', { level: 3, name: title, exact: true }),
  })
}

/** O kartın favori butonu: adı “Favorilere ekle” de olsa “Favorilerden çıkar” da olsa. */
export function favoriteButton(page: Page, title: string): Locator {
  return movieCard(page, title).getByRole('button', { name: /^Favori/ })
}
