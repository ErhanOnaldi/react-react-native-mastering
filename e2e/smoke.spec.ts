import { expect, test } from '@playwright/test'

// Uçtan uca duman testi: pano → quiz → kod görevi (editör + gerçek test çalıştırma) → ilerleme.
test('öğrenci quiz ve kod görevini çözebilir', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Hoş geldin/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Deneme modülü/ }).first()).toBeVisible()

  // Quiz: yanlış cevap → açıklama, sonra doğru cevap
  await page.goto('/q/0.1.1')
  await page.getByLabel(/11/).check()
  await page.getByRole('button', { name: 'Cevapla' }).click()
  await expect(page.getByText(/Tam olarak değil/)).toBeVisible()
  await page.getByRole('button', { name: /Tekrar dene/ }).click()
  await page.getByLabel(/^2$/).check()
  await page.getByRole('button', { name: 'Cevapla' }).click()
  await expect(page.getByText('🎉 Doğru!')).toBeVisible()

  // Kod görevi: önce başlangıç kodu kalır
  await page.goto('/q/0.1.3')
  await expect(page.getByRole('tab', { name: 'sum.ts' })).toBeVisible()
  await page.getByRole('button', { name: /Çalıştır/ }).click()
  await expect(page.getByText('0/2 test')).toBeVisible()

  // Editöre çözümü yaz (Monaco modeli üzerinden) ve otomatik kaydı bekle
  await page.waitForFunction(() => 'monaco' in window)
  await page.evaluate(() => {
    const monaco = (window as unknown as { monaco: typeof import('monaco-editor') }).monaco
    const model = monaco.editor.getModels().find((m) => m.uri.path.endsWith('03-toplama/sum.ts'))
    model?.setValue('export function sum(a: number, b: number): number {\n  return a + b\n}\n')
  })
  await expect(page.getByText('Kaydedildi')).toBeVisible()
  await page.getByRole('button', { name: /Çalıştır/ }).click()
  await expect(page.getByText(/Tebrikler! 2\/2 test/)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Sonraki', exact: true })).toBeVisible()

  // Kenar çubuğunda tamamlandı işareti
  await expect(
    page
      .getByRole('complementary', { name: 'Müfredat' })
      .getByRole('link', { name: /Tamamlandı sum fonksiyonu/ }),
  ).toBeVisible()
})
