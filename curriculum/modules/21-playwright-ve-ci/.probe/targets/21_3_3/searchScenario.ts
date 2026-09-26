import { expect, type Page } from '@playwright/test'

/**
 * Arama senaryosu: kullanıcı önce “matrix” arar, sonra fikrini değiştirip “başlangıç” arar.
 * Sabit bekleme (waitForTimeout) kullanma; beklemeyi web-first assertion’lara bırak.
 */
export async function searchScenario(page: Page): Promise<void> {
  await page.goto('/search')
  const searchBox = page.getByRole('searchbox', { name: 'Film ara' })
  const results = page.getByRole('region', { name: 'Arama sonuçları' }).getByRole('listitem')

  await searchBox.fill('matrix')
  await expect(results).toHaveCount(2)

  await searchBox.fill('başlangıç')
  await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'başlangıç')
  await expect(page.getByRole('link', { name: 'Başlangıç', exact: true })).toBeVisible()
  await expect(results).toHaveCount(1)
  await expect(page.getByText('Aranıyor…')).toBeHidden()
}
