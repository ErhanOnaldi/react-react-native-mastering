import { expect, type Locator, type Page } from '@playwright/test'

/** Sinema’nın arama sayfası için page object. */
export class SearchPage {
  readonly page: Page
  /** "Film ara" kutusu */
  readonly searchBox: Locator
  /** Sonuç bölgesindeki maddeler */
  readonly results: Locator
  private readonly region: Locator

  constructor(page: Page) {
    this.page = page
    this.searchBox = page.getByRole('searchbox', { name: 'Film ara' })
    this.region = page.getByRole('region', { name: 'Arama sonuçları' })
    this.results = this.region.getByRole('listitem')
  }

  /** /search sayfasını açar. */
  async goto(): Promise<void> {
    await this.page.goto('/search')
  }

  /** Sorguyu yazar ve BU sorgunun sonuçları ekrana gelene kadar bekler. */
  async search(query: string): Promise<void> {
    await this.searchBox.fill(query)
    await expect(this.region.getByRole('heading', { name: `“${query}” için` })).toBeVisible()
  }

  /** Şu an listelenen filmlerin adları (beklemez). */
  async resultTitles(): Promise<string[]> {
    return this.results.getByRole('link').allTextContents()
  }

  /** Sonuçlardan adı tam olarak `title` olan filmi açar; detay sayfası yüklenene kadar bekler. */
  async openMovie(title: string): Promise<void> {
    await this.region.getByRole('link', { name: title, exact: true }).click()
    await expect(
      this.page.getByRole('heading', { level: 2, name: title, exact: true }),
    ).toBeVisible()
  }
}
