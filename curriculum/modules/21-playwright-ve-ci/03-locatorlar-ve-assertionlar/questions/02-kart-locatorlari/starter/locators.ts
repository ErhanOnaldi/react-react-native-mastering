import type { Locator, Page } from '@playwright/test'

/** Ana sayfadaki film listesinin kart başlıkları (yalnız onlar), sırayla. */
export function movieTitles(page: Page): Locator {
  return page.locator('.todo')
}

/** Başlığı tam olarak `title` olan film kartı. */
export function movieCard(page: Page, title: string): Locator {
  return page.locator('.todo')
}

/** O kartın favori butonu: adı “Favorilere ekle” de olsa “Favorilerden çıkar” da olsa. */
export function favoriteButton(page: Page, title: string): Locator {
  return page.locator('.todo')
}
