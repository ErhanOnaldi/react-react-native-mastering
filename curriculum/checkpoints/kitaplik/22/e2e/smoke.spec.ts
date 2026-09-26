import { expect, test } from '@playwright/test'

test('ana sayfa açılır ve arama kutusu hazırdır', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Kitaplık' })).toBeVisible()
  await expect(page.getByRole('searchbox', { name: 'Kitap ara' })).toBeVisible()
})
