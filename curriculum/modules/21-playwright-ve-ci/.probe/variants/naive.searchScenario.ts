import { expect, type Page } from '@playwright/test'
export async function searchScenario(page: Page): Promise<void> {
  await page.goto('/search')
  const box = page.getByLabel('Film ara')
  await box.fill('matrix')
  await page.waitForTimeout(1000)
  expect(
    await page.getByRole('region', { name: 'Arama sonuçları' }).getByRole('listitem').count(),
  ).toBe(2)
  await box.fill('başlangıç')
  await page.waitForTimeout(1000)
  expect(page.url()).toContain('q=')
  expect(await page.getByRole('link', { name: 'Başlangıç', exact: true }).isVisible()).toBe(true)
  expect(
    await page.getByRole('region', { name: 'Arama sonuçları' }).getByRole('listitem').count(),
  ).toBe(1)
  expect(await page.getByText('Aranıyor…').isVisible()).toBe(false)
}
