import { expect, type Page } from '@playwright/test'

/**
 * Ana sayfa senaryosu: kullanıcı Sinema'yı açar ve trend filmleri görür.
 * Test altyapısı `page`'i hazırlar (baseURL = https://sinema.test); sen yalnız adımları yaz.
 */
export async function homeScenario(page: Page): Promise<void> {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Sinema' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bu haftanın trend filmleri' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Dövüş Kulübü' })).toBeVisible()
}
