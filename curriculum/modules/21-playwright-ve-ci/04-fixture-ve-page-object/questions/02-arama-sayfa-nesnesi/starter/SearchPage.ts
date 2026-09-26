import { expect, type Locator, type Page } from '@playwright/test'

/** Sinema’nın arama sayfası için page object. */
export class SearchPage {
  readonly page: Page
  /** "Film ara" kutusu */
  readonly searchBox: Locator
  /** Sonuç bölgesindeki maddeler */
  readonly results: Locator

  constructor(page: Page) {
    this.page = page
    this.searchBox = page.locator('.todo')
    this.results = page.locator('.todo')
  }

  /** /search sayfasını açar. */
  async goto(): Promise<void> {}

  /** Sorguyu yazar ve BU sorgunun sonuçları ekrana gelene kadar bekler. */
  async search(query: string): Promise<void> {}

  /** Şu an listelenen filmlerin adları (beklemez). */
  async resultTitles(): Promise<string[]> {
    return []
  }

  /** Sonuçlardan adı tam olarak `title` olan filmi açar; detay sayfası yüklenene kadar bekler. */
  async openMovie(title: string): Promise<void> {}
}
