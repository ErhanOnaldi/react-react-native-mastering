## Neden böyle?

```ts
async search(query: string) {
  await this.searchBox.fill(query)
  await expect(this.region.getByRole('heading', { name: `“${query}” için` })).toBeVisible()
}
```

Görevin kalbi, `search()`’ün **neyi** beklediği. Üç aday var:

| Bekleme | Sorun |
| --- | --- |
| `await expect(this.results.first()).toBeVisible()` | İkinci aramada eski sonuçlar zaten görünür: anında döner, eski listeyi okursun. Sonuç yoksa hiç görünmez: 5 sn sonra kalır. |
| `await expect(page.getByText('Aranıyor…')).toBeHidden()` | Debounce bitene kadar “Aranıyor…” henüz **yok**; koşul anında sağlanır ve cevap gelmeden dönersin. |
| Sorguyu içeren sonuç başlığı | Yalnızca **bu** sorgunun cevabı render edilince görünür. Sonuç sayısı 0 olsa da görünür. ✅ |

Doğru bekleme “ne zaman bittiğini kullanıcı nereden anlar?” sorusunun cevabıdır. Kullanıcı başlıkta kendi sorgusunu görünce sonuçların geldiğini anlar; test de öyle.

- **`resultTitles()` beklemez:** `allTextContents()` o anki metinleri döndürür. Beklemenin sorumluluğu `search()`’te; böylece `resultTitles` her çağrıldığı yerde tutarlı davranır.
- **`openMovie` bir sonraki sayfanın hazır olmasını bekler:** Tıklama gezinmeyi başlatır ama detay verisi ağdan gelir. Metodun sözleşmesi “döndüğünde film sayfası kullanılabilir” olursa, arkasından gelen her assertion güvenle çalışır.
- **Locator’lar constructor’da:** Locator tembel olduğu için sayfa henüz açılmamışken oluşturmak sorun değil.

## Alternatifler

- `search()` içinde `page.waitForResponse('**/search/movie**')` da beklenebilir; ama ağ cevabı gelmesi ekranın güncellendiği anlamına gelmez (React render’ı sonra). Kullanıcının gördüğünü beklemek daha sağlam.
- `openMovie` yeni bir `MovieDetailsPage` nesnesi döndürebilir (`return new MovieDetailsPage(this.page)`); büyük paketlerde sayfa geçişlerini böyle zincirlemek yaygındır.

## Fixture’a bağlamak

Proje görevinde bu sınıfı bir fixture ile her teste hazır verebilirsin:

```ts
export const test = base.extend<{ searchPage: SearchPage }>({
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page)
    await searchPage.goto()
    await use(searchPage)
  },
})
```
