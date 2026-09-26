import { expect, test } from '@playwright/test'
import { mockOpenLibrary } from './open-library.ts'

test.beforeEach(async ({ page }) => {
  await mockOpenLibrary(page)
})

test('ara → detay → listeye ekle → sayfa yenilense de liste durur', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('searchbox', { name: 'Kitap ara' }).fill('dune')
  await page.getByRole('button', { name: 'Ara' }).click()
  await expect(page).toHaveURL(/\/search\?q=dune/)

  await page.getByRole('link', { name: 'Dune', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Dune', exact: true })).toBeVisible()
  await expect(page.getByText('Frank Herbert')).toBeVisible()

  await page.getByLabel('Durum').selectOption({ label: 'Okudum' })
  await page.getByLabel('Puan').selectOption('5')
  await page.getByRole('button', { name: 'Listeye ekle' }).click()
  await expect(page.getByRole('link', { name: 'Okuma listem (1)' })).toBeVisible()

  await page.getByRole('link', { name: 'Okuma listem (1)' }).click()
  await page.reload()
  await expect(page.getByRole('link', { name: 'Dune', exact: true })).toBeVisible()
  await expect(page.getByText('Okudum · Puan: 5/5')).toBeVisible()
})

test('geri tuşu önceki aramaya döner', async ({ page }) => {
  await page.goto('/search?q=dune')
  await page.getByRole('link', { name: 'Dune Messiah' }).click()
  await expect(page).toHaveURL(/\/works\/OL893461W/)
  await page.goBack()
  await expect(page.getByRole('searchbox', { name: 'Kitap ara' })).toHaveValue('dune')
})
