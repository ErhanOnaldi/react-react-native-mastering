## Neden böyle?

```ts
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
```

- **Locator’ı bir kez tanımla, çok kez kullan:** `results` bir tarif; her assertion onu o anki DOM’a yeniden uygular. İlk aramada 2, ikincide 1 sayar.
- **İlk aramayı beklemek şart:** `fill('matrix')`’ten hemen sonra `fill('başlangıç')` yazarsan debounce ilk aramayı hiç başlatmaz. “Eski sonuç kaldı” hatası o zaman ortaya çıkamaz ve senaryon onu yakalayamaz. E2E senaryosu, hatanın **doğabileceği yolu** yürümeli.
- **`toHaveCount(1)` neden güvenilir?** Doğru uygulamada sayı 2 → 0 (yükleniyor) → 1 olur; 1’i yalnızca en sonda görür. Eski sonuçları bırakan sürümde 2 → 3 olur; 1’i hiç görmez ve 5 sn sonra hata verir.
- **`toBeHidden()`:** “Yükleniyor kalktı mı?” sorusu da bir kullanıcı gereksinimi. Sonuç gelse bile dönmeye devam eden bir spinner bir hatadır.
- **URL için fonksiyon:** `?q=ba%C5%9Flang%C4%B1%C3%A7` gibi kodlanmış bir string yazmak yerine `url.searchParams.get('q')` ile çözülmüş değeri karşılaştırırsın.

## Tuzaklar

- `expect(await results.count()).toBe(1)` beklemez: debounce sürerken 2 görür ve kalır.
- `waitForTimeout(1000)` 1,5 sn’lik cevapta yetmez; hızlı makinede de her koşuda 2 sn boşa gider.
- `exact: true` olmadan “Başlangıç” adı başka bir bağlantıda parça olarak geçerse strict mode hatası alırsın.

## Sektörde

Takımlarda “flaky” (kararsız) testlerin büyük kısmı zamanlama varsayımlarından doğar. Kod incelemesinde `waitForTimeout` ve beklemeyen `isVisible()` kontrolleri genellikle ilk düzeltilen satırlardır.
