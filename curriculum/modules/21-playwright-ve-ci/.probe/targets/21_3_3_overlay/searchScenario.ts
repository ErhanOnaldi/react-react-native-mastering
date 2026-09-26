import { expect, type Page } from '@playwright/test'
export async function searchScenario(page: Page): Promise<void> {
  await page.goto('/search')
  const box = page.getByLabel('Film ara')
  await box.fill('matrix')
  await box.fill('başlangıç')
  await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'başlangıç')
  await expect(page.getByRole('link', { name: 'Başlangıç', exact: true })).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Arama sonuçları' }).getByRole('listitem'),
  ).toHaveCount(1)
  await expect(page.getByText('Aranıyor…')).toBeHidden()
}
